<template>
    <div class="page-mutasi_kasbank">
        <bz-topbar :title="title" icon="flaticon-layers">
            <template slot="tools">
                <b-button @click="onFilter" type="button" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white">Submit</b-button>
            </template>
        </bz-topbar>

        <div class="container contentwithtopbar">
            <bz-portlet title="Filter">
                <template slot="body">
                    <bz-form ref="form" @onSubmit="onSubmit" :fields="fieldsFilter" :model="modelFilter"></bz-form>
                </template>

                <!-- <template slot="foot">
                    <b-button @click="onFilter" type="button" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Submit</b-button>
                </template> -->
            </bz-portlet>

            <bz-portlet v-if="result.data.summary">
                <template slot="body">
                    <b-row>
                       <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{result.data.summary.total | decimal}}
                                    <small>Total</small>
                                </div>
                            </div>
                        </b-col>
                        <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{result.data.summary.balance_before | decimal}}
                                    <small>Saldo Awal</small>
                                </div>
                            </div>
                        </b-col>
                        <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number m--font-success">
                                    {{result.data.summary.debit | decimal}}
                                    <small>Total Pemasukan</small>
                                </div>
                            </div>
                        </b-col>
                        <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number m--font-danger">
                                    {{result.data.summary.credit | decimal}}
                                    <small>Total Pengeluaran</small>
                                </div>
                            </div>
                        </b-col>
                        <b-col>
                            <div class="m-widget26">
                                <div class="m-widget26__number m--font-brand">
                                    {{result.data.summary.balance_after | decimal}}
                                    <small>Saldo Akhir</small>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                    
                </template>
            </bz-portlet>

            <bz-portlet>
                <template slot="body">
                    <bz-datatable ref="resultTable"  :notSearchable="true" :getDataSource="getDataSource" :noPagination="false" :handleRows="handleRows" :q="q"  @row-clicked="onRowClick" :fields="result.fields"></bz-datatable>
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
            title:'Laporan Mutasi KasBank',
            q:'',
            fieldsFilter: ["kasbank_id:select:kasbank:id:name","start_date:date", "end_date:date"],
            modelFilter: {
                start_date:null,
                end_date: null
            },
            result:{
                rows: [],
                fields: ["code","trx_date:date",
                "trx_type",">balance_before:decimal",">debit:decimal", ">credit:decimal", ">balance_after:decimal"],
                data: {}
            },
            Items: [],
        }
    },
    computed: {
    },
    async created() {
        console.log("Start mount Mutasi KasBank");
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

            console.log("GETDATASOURCE", endpoint, queryParams, model);
            var data = {
                data: null, // other data
                rows: [],  // total rows in this page
                total: 0  // total rows without filter
            }
            if (model.kasbank_id!=null)
            {
                try {
                    var endpoint = this.$api.formatUrl('report/mutasi-kasbank', queryParams);
                    var response = await this.$api.patch(endpoint, model);
                    data.data = response;
                    data.rows = response.rows;
                    data.total = response.summary.total;
                    this.result.data = response;
                    this.result.rows = data.rows;
                } catch (error) {
                    console.log("ERROR", error);
                }
            }
            return data;
        },

        async onRowClick(item, index, event) {
            console.log("ROW CLICKED", item, index, event);
        },

        async onFilter() {
            try {
                    var model = this.$refs.form.values;
                    var myDate = new Date(model.start_date)
                    var start_date = moment(myDate).format('DD-MMM-YYYY') 
    
                    var myDate = new Date(model.end_date)
                    var end_date = moment(myDate).format('DD-MMM-YYYY') 

                    var elt = document.getElementById('kasbank_id');

                    var name = '';
                    if (elt.selectedIndex == -1)
                        this.$snotify.error('Please Select Kasbank');
                    else
                    {
                        name = elt.options[elt.selectedIndex].text;                    
                        this.$refs.resultTable.refreshData();
                        this.title = `Laporan Mutasi ${name} Periode ${start_date} s/d ${end_date}`
                    }

                    // var data = await this.$api.patch('report/Mutasi KasBank', model);    
                    // this.result.data = data;
                    // this.result.rows = data.rows.map(row => {
                    //     if (row.trx_type=="MutasiManual")
                    //         row.trx_code = row.trx_data.trx_code
                    //     else if (row.trx_type=="Mutasi KasBank")
                    //         row.trx_code = row.trx_data.code
                    //     else   
                    //         row.trx_code = "N/A";

                    //     row.value = row.debit*1 - row.credit*1;
                    //     row.stock_akhir = row.balance_after * 1;
                    //     return row;
                    // });
                    //this.$refs.resultTable.refreshData();
                    //this.title = `Laporan Mutasi KasBank Periode ${model.start_date} s/d ${model.end_date}`
               // }
            } catch (error) {
                console.log("ERROR", error);
            }   

            console.log("RESULT", this.result)
        },

        async onSubmit() {

        }
    }
}
</script>