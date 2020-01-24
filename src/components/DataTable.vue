<template>
<div>
    <div v-if="isReady">
        <div v-if="!notSearchable" class="form-group m-form__group float-right col-sm-4 pr-0">
            <div class="input-group">
                <input type="text" v-model="q" class="form-control" placeholder="Search">
                <div class="input-group-append">
                <button :disabled="!q" class="btn btn-primary" type="button"><i class="fa fa-search"></i> </button>
                </div>
            </div>
        </div>
        <b-table @sort-changed="sortingChanged" class="table-responsive m-table m-table--head-bg-brand" responsive="sm" hover :items="rows" :fields="formattedFields" @row-clicked="onRowClick">
           <!-- A virtual column -->
            <template slot="index" slot-scope="data">
                {{data.index + 1}}
            </template>

            <template slot="actions" slot-scope="cell">
                <template v-for="b in buttonList">
                    <b-btn v-if="b=='delete'" class="mr-1" :key=b size="sm" variant="danger" @click.stop="onButtonClick(cell.item,cell.index,b)">{{b}}</b-btn>
                    <b-btn v-if="b=='edit'" class="mr-1 btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info" :key=b size="sm" variant="primary" @click.stop="onButtonClick(cell.item,cell.index,b)">{{b}}</b-btn>
                    <b-btn v-if="b=='select'" class="mr-1 btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info" :key=b size="sm" variant="primary" @click.stop="onButtonClick(cell.item,cell.index,b)">{{b}}</b-btn>
                </template>
            </template>

            <!--
            <template slot="actions" slot-scope="row">
                <b-btn size="sm" @click.stop="row.toggleDetails">
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                </b-btn>
            </template>
            
            <template slot="row-details" slot-scope="row">
                <span>{{ row.item.trx_data }} </span> 
                <b-table class="col-sm-6" sm hover :items="detailField(row.item.trx_data)" :fields="detail"/>
            </template>               -->         
            <template v-for='field in formattedFields' :slot='field.key' slot-scope='row'>
                <span :key=field.key v-html="row.value"></span>
            </template>

        </b-table>

        <b-pagination v-show="!noPagination" v-if="totalItem>0" @input="onPagination" align="center"  size="md" :total-rows="totalItem" v-model="currentPage" :per-page="itemPerPage"></b-pagination>
   </div>
    <Spinner v-else/>
    </div>
</template>


<script>
import _ from 'lodash'
import Vue from 'vue'

export default {
    name: "bz-datatable",
    props: {
        fields: Array,
        //fieldsDet: Array,
        endpoint: String,
        endpointParams: Object,
        buttons: String,
        inputs: String,
        handleRows: Function,
        getDataSource: Function,
        to: String,
        q: String,
        containerData:Array,
        noPagination:Boolean,
        notSearchable:Boolean,
    },
    data() {
        return {
            rows: [],
            currentPage: 1,
            itemPerPage: 10,
            totalItem: 0,
            isReady: false,
            // formattedFields: [],
            queryParams: {},
            //detail:[],
            sort: '',
        };
    },
    watch:  {
        q: _.debounce(function(newVal){
            this.refreshData();
        }, 500),
        containerData: function(val) {
            this.rows = val;
            this.totalItem =this.rows.length;    
       }, 
    },
    methods: {
        async sortingChanged (ctx) {
                if (ctx.sortDesc)
                    this.sort = '-' + ctx.sortBy;
                else
                    this.sort = ctx.sortBy;

                await this.refreshData();
        },
        async onPagination(nextPage) {
            //console.log("OnPage", this.currentPage, this.itemPerPage, nextPage);
            await this.refreshData();
        },
        async refreshData() {
            if (this.noPagination)
            {
                this.queryParams.page = 0;
                this.queryParams.count = 10000;
            }
            else
            {
                this.queryParams.page = this.currentPage-1;
                this.queryParams.count = this.itemPerPage;
            }

            this.queryParams.q = this.q;
            //this.detail = this.fieldsDet
            //console.log("this.detail = ", this.detail);
            if (this.sort!='')
                this.queryParams.sort = this.sort;
 
            if (this.getDataSource) {
                var data = await this.getDataSource(this.endpoint, this.queryParams);
                if (this.handleRows)
                    this.rows = await this.handleRows(data.rows);
                else this.rows = data.rows;
                this.totalItem = data.total*1; 
                console.log("DATASOURCE:", this.rows, this.totalItem);
            }
            else if (this.containerData===undefined)
            {
                // console.log("containerData adalah undefined");
               console.log("endpoint:", this.endpoint);
                console.log("queryParams:", this.queryParams);

                if (this.endpoint!=undefined)
                {
                    var data = await this.$api.getDataTable(this.endpoint, this.queryParams);
                    console.log("data:", data);
                    if (this.handleRows) {
                        this.rows = await this.handleRows(data.rows);
                    }
                    else
                        this.rows = data.rows;
                    
                    this.totalItem = data.total*1;  
                }        
            }
            else
            {
                this.rows = this.containerData;
                this.totalItem =this.containerData.length;
            }

            //console.log("containerData:", this.containerData);
           //console.log("totalItem:", this.totalItem);
           // console.log("itemPerPage:", this.itemPerPage);
        },
        async onButtonClick(item, index, target) {
            console.log("buttonclicked", item, index, target);
            this.$emit('button-clicked', item, index, target);
        },
        async onRowClick(item, index, event) {
            this.$emit('row-clicked', item, index, event);
        },
        /*detailField(det) {
            let arr = [];
            arr.push(det);
            return arr ;
        }*/
    },
    computed: {
        //isDetails: function () {
        //    return this.buttons.includes("details");
        //},
        buttonList: function () {
            return this.buttons.split(',');
        },
        formattedFields: function() {
            return this.fields.map((item)=> {
                var field = {
                    key: '',
                    sortable: true,
                    format: 'text',
                    class:'',
                    subformat:''
                }
                if (typeof item == 'string' && item.indexOf(':')>-1) {
                    var parts = item.split(":");
                    var format = parts[1];
                    field.key = parts[0];
                    field.sortable=true;

                    if (parts.length>2)
                        field.subformat = parts[2];

                    if (field.key.startsWith('>')) {
                        field.key = field.key.substring(1);
                        field.class = "text-right";
                    }
                    else if (field.key.startsWith('<')) {
                        field.key = field.key.substring(1);
                        field.class = "text-left";
                    }
                    else if (field.key.startsWith('|')) {
                        field.key = field.key.substring(1);
                        field.class = "text-center";
                    }

                    if (format == 'decimal') {
                        field.formatter = (value, key, item) => {
                            return this.$options.filters.decimal(value)
                        }
                    }

                    else if (format == 'int') {
                        field.formatter = (value, key, item) => {
                            try {
                                return parseInt(value)
                            }
                            catch (error) {
                                return 0;
                            }
                        }
                    }
                    else if (format == 'date') {
                        field.formatter = (value, key, item) => {
                            if (parts[2])
                                return this.$options.filters.moment(value, parts[2])
                            else
                                return this.$options.filters.moment(value, "DD MMM YY")
                        }

                    }
                    else if (format == 'image') {
                        field.formatter = (value, key, item) => {
                            //console.log("Formatter", value, key, item);
                            var url = encodeURI(value);
                            return `<img src='${url}'>`;
                        }
                    }

                    else if (format == 'input') {
                        field.formatter = (value, key, item) => {
                            var type = 'text';
                            if (field.subformat!='')
                                type=field.subformat;
                                value = this.$options.filters.decimal(value);
                            return ` <input  id="` + key + `" value="${value}" v-model="` + key + `" type="` + 
                                    type + `"></input>`;
                        }

                    } 
                    else if (format == 'badge') {
                        field.formatter = (value, key, item) => {
                            var badgeClass = this.$options.filters.status_badge(value);
                            return `<span class='${badgeClass}'>${value}</span>`;
                        }
                    }

                    field.format = format;
                }
                else if (item =='actions')
                    return item;
                else 
                {
                    if (item.key===undefined)
                    field.key=item;
                    else
                    {
                        field.key = item.key;
                        field.class=item.class;
                    }

                }

                return field;
            })
        }
    },
    created() {
        this.queryParams = Object.assign({}, this.endpointParams);
    },
    async mounted() {
        await this.refreshData();
        this.isReady = true;
    },
};
</script>


<style lang="scss">
table {
    text-align: left;
}
.table-responsive table th {
    word-break: normal;
    white-space: nowrap;
}
.m-widget11 .table tbody>tr>td {
    padding-left: 0.75rem;
}
</style>
