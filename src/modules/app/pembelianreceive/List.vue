<template>
    <div class="page-penerimaanbarang">
        <bz-topbar title="Penerimaan Barang" icon="fa fa-truck-loading">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <a v-b-modal.addProduct_modal class="float-right btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info text-white">
                        <span>
                            <i class="la la-plus"></i>
                            New {{title}}
                        </span>
                    </a>  					
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
                <div class="m-portlet__body ">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-datatable ref="datatable" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @button-clicked="onButtonClick" @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
       <!--begin model-->
        <b-modal id="addProduct_modal" size="lg"
             ref="addProduct_modal"
             title="New Penerimaan Barang">
                <form @submit.stop.prevent="saveAddItem">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Tanggal</label>
                        <flat-pickr class="form-control col-sm-8" 
                            :config="{altInput:true, altFormat:'d M Y'}" 
                            v-model="model.tanggal"  />
                   </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                        <label class="col-sm-4 col-form-label">No. Penerimaan</label>
                        <b-form-input class="col-sm-8" v-model="model.code"></b-form-input>
                    </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Notes</label>
                        <b-form-textarea class="col-sm-8" v-model="model.notes"></b-form-textarea>
                    </div>    

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mb-0">
            <div class="m-portlet col-sm-12 pb-0">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <a @click="showPembelianModal" class="mr-3 btn btn-brand m-btn m-btn--icon btn-lg m-btn--icon-only  m-btn--pill m-btn--air">
                                <i class="fa flaticon-search-magnifier-interface-symbol text-white"></i>
                            </a>
                            <h3 class="col-form-label">Search Pembelian</h3>
                        </div>
                    </div>
                </div>
                <div v-if="tanggal_pembelian!=''" class="m-portlet__body mb-0 pb-0">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                        <label class="col-sm-2 mr-3 text-left">Tgl Pembelian</label>
                        <label class="col-sm-3 text-left"> : {{ tanggal_pembelian }}</label>
                        <label class="col-sm-2 text-left">Supplier</label>
                        <label class="text-left"> : {{ SupplierName }}</label>
                    </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                        <label class="col-sm-2 mr-3 text-left">No. Invoice</label>
                        <label class="col-sm-9 text-left"> : {{ code_pembelian }}</label>
                    </div>                    
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-datatable ref="PembDetaildatatable" :notSearchable="true" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" :fields="$options.AddItemfields" ></bz-datatable>
                        </div>
                    </div>
                </div>
            </div>
                    </div> 
                </form>
                    <div slot="modal-footer" class="w-100">
                        <b-btn size="sm" class="float-right" variant="primary" @click="handleOk">
                        Create
                        </b-btn>
                    </div>  
                </b-modal>
    <!--end::Modal-->

    <!--begin model-->
        <b-modal id="listPembelian_modal" size="lg"
             ref="listPembelian_modal"
             title="List Pembelian">
                <bz-datatable ref="datatable" :q="q" @row-clicked="onPenjRowClick" :fields="$options.Pembfields" :buttons="$options.buttons" :endpointParams="$options.endpointPembelianParams" :endpoint="$options.endpointPembelian"></bz-datatable>
                    <div slot="modal-footer" class="m-0">
                    </div>  
        </b-modal>
    <!--end::Modal-->
    </div>
</template>

<script>

import BaseListComponent from "../base/List.vue"
export default {
    extends: BaseListComponent,
    name: "pembelianreceive-list",
    route: "pembelianreceive",
    endpoint: "pembelian-receive",
    endpointPembelian: "pembelian",
    endpointPembelianParams:{scope:"detail",status:"active",sort:"-id"},
    endpointParams: {scope:"detail"},
    buttons: "edit,delete",
    Pembfields: ["tanggal:date","code",
    "Supplier.name",">qty:decimal", ">qty_pending:decimal", ">qty_sent:decimal",">total:decimal",
    "status:badge","status_payment:badge"],
    fields: ["tanggal:date","PembelianId","code",">qty_sent:decimal","status:badge"],
    AddItemfields: ["no","name", 
    ">price:decimal",">qty:decimal",">qty_pending:decimal"],    
    data() {
        return {
            title: "Penerimaan Barang",
           tanggal_pembelian:'',
            SupplierId:'',
            SupplierName:'',
            code_pembelian:'',
            tanggal:{},
            model: {
                'tanggal' : '',
                'PembelianId':'',  
                'code':'' ,   
                'notes':'' ,  
            },
            Items: [],         
        };
    },
    methods: {
        showPembelianModal() {
            this.$refs.listPembelian_modal.show()                
        },

        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()

            console.log("evt = ", evt);
            if (this.model.PembelianId=='' ) 
                this.$snotify.error('Please select Pembelian!!');
            else
                this.saveAddItem()
        },
        async saveAddItem() {
            console.log("modelPenj = ", this.model);
            var isSuccessDetail = true;

            try {
                //Save
                var result = await this.$api.post("pembelian-receive", this.model, true);
                //console.log("result receive Pembelian = ", result);

                if (result.id!='')
                {
                    for (let i = 0; i < this.Items.length; i++) {
                        var model = { 
                            product_id: this.Items[i].product_id, 
                            qty_sent: 0, 
                            PembelianReceiveId: result.id, 
                            PembelianDetailId: this.Items[i].PembelianDetailId
                        }
                        console.log("model detail = ", model);   
                        try {
                            var resultDet = await this.$api.patch('pembelian-receive/add-item', model);
                            //console.log("result addItem detail = ", resultDet);   
                        } 
                        catch (error) {
                            console.log("ERR", error);
                            this.$refs.form.errors = error;
                            this.$snotify.error('Validation Error');
                            isSuccessDetail=false;
                        }
                    }
                }

                if (isSuccessDetail)
                    this.$router.push(this.$options.route+'/new/'+result.id);

            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        async onPenjRowClick(item, index, event) {
            this.fillPembelian(item)
            this.$refs.listPembelian_modal.hide()                
            this.$refs.addProduct_modal.show()                
        },
        fillPembelian(item) {
            console.log("item", item);
            var myDate = new Date(item.tanggal)
            this.tanggal_pembelian = moment(myDate).format('DD MMM YYYY') 
            this.model.PembelianId=item.id;
            this.code_pembelian=item.code;
            this.SupplierName=item.Supplier.name;
            var count = item.PembelianDetails.length;
            this.Items.length=0;
            this.Items=[];
            for (let i = 0; i < count; i++) {
                    var det = {
                    no: i+1 ,
                    id: item.PembelianDetails[i].id,
                    PembelianDetailId: item.PembelianDetails[i].id,  
                    qty: parseInt(item.PembelianDetails[i].qty),
                    qty_pending: parseInt(item.PembelianDetails[i].qty_pending),
                    name: item.PembelianDetails[i].product_name,  
                    product_id: item.PembelianDetails[i].product_id,      
                    price: item.PembelianDetails[i].product_buy_price,      
                    PembelianReceiveId: this.id,                 
                };
                this.Items.push(det); 
            }
        },
    },
    async created() {
         //set current date
        this.model.tanggal=new Date();
    },    
};
</script>


<style lang="scss">
</style>
