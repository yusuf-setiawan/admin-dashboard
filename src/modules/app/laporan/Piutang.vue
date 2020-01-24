<template>
    <div class="page-piutang">
        <bz-topbar :title="title" icon="flaticon-layers">
            <template slot="tools">
               <!-- <b-button @click="onFilter" type="button" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white">Submit</b-button>-->
            </template>
        </bz-topbar>

        <div class="container contentwithtopbar">
            <bz-portlet v-show="false" title="Filter">
                <template slot="body">
                    <bz-form ref="form" @onSubmit="onSubmit" :fields="fieldsFilter" :model="modelFilter"></bz-form>
                </template>

                <!-- <template slot="foot">
                    <b-button @click="onFilter" type="button" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Submit</b-button>
                </template> -->
            </bz-portlet>

            <bz-portlet >
                <template slot="body">
                    <b-row>
                        <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number m--font-danger">
                                    {{total_piutang | decimal}}
                                    <small>Total Piutang</small>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                    
                </template>
            </bz-portlet>

            <bz-portlet>
                <template slot="body">
                    <bz-datatable ref="resultTable" :notSearchable="true" :getDataSource="getDataSource" :noPagination="false" :handleRows="handleRows" :q="q"  @row-clicked="onRowClick" :fields="result.fields"></bz-datatable>
                    <div v-if="!result.rows.length">
                        No Data Found
                    </div>
                </template>
            </bz-portlet>
        </div>

    </div>
</template>


<script>
const items = [];

export default {
    data () {
        return {
            title:'Laporan Piutang',
            q:'',
            fieldsFilter: [],
            modelFilter: {
                //product_id:null,
                start_date:null,
                end_date: null
            },
            result:{
                rows: [],
                fields: ["CustomerId", "name",">piutang:decimal"],
                data: {}
            },
            Items: [],
            //product_name: '',
            //Products:'',
        }
    },
    computed: {
       total_piutang: function() {
           var total = 0;
           if (this.result!=undefined)
           {
                if (this.result.rows!=undefined)
                {
                    for (let i = 0; i < this.result.rows.length; i++) {
                        total=total + parseFloat(this.result.rows[i].piutang);
                    }                    
                }               
           }
           return total;
        }                 
    },
    async created() {
        console.log("Start mount piutang");
    },
    methods: {
         async handleRows(rows) {
            return rows.map(row => {
                if (row.trx_type=="MutasiManual")
                    row.trx_code = row.trx_data.trx_code
                else if (row.trx_type=="PembelianReceive")
                    row.trx_code = row.trx_data.code
                else   
                    row.trx_code = "N/A";

                row.value = row.debit*1 - row.credit*1;
                row.stock_akhir = row.balance_after * 1;
                return row;
            });
        },

        async getDataSource(endpoint, queryParams) {
            var model = this.$refs.form.values;
            var data = {
                data: null, // other data
                rows: [],  // total rows in this page
                total: 0  // total rows without filter
            }
            try {
                var endpoint = this.$api.formatUrl('report/piutang', queryParams);
                var response = await this.$api.patch(endpoint, model);
                data.data = response;
                data.rows = response.rows;
                //data.total = response.summary.total;
                this.result.data = response;
                this.result.rows = data.rows;
            } catch (error) {
                console.log("ERROR", error);
            }
            
            return data;
        },

        async onRowClick(item, index, event) {
            console.log("ROW CLICKED", item, index, event);
        },

        async onSubmit() {

        }
    }
}
</script>