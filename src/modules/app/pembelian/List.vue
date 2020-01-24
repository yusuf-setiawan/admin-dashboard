<template>
    <div class="page-pembelian">
        <bz-topbar title="Pembelian" icon="fa fa-cart-plus">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <a v-b-modal.addProduct_modal class="float-right btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info text-white">
                            <span>
                                <i class="la la-plus"></i>
                                New {{title}}
                            </span>
                        </a>                                 
                    </li>						
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
            <!--begin model-->
            <b-modal id="addProduct_modal"
             ref="addProduct_modal"
             title="Create New Pembelian"
             @shown="clear">
                <form @submit.stop.prevent="saveAddItem">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Tanggal</label>
                        <flat-pickr class="form-control col-sm-8" 
                            :config="{altInput:true, altFormat:'d M Y'}" 
                            v-model="model.tanggal"  />
                   </div>

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Supplier</label>
                        <vue-bootstrap-typeahead 
                            class="col-sm-8" 
                            v-model="Supplier" ref="SupplierTypeahead"
                            :data="AutoCompleteSupplier"
                            placeholder="Ketik Nama Supplier"
                        />
                    </div>

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                        <label class="col-sm-4 col-form-label">No. Invoice</label>
                        <b-form-input class="col-sm-8" v-model="model.code"></b-form-input>
                    </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Notes</label>
                        <b-form-textarea class="col-sm-8" v-model="model.notes"></b-form-textarea>
                    </div>    
 
                </form>
                    <div slot="modal-footer" class="w-100">
                        <b-btn size="sm" class="float-right" variant="primary" @click="handleOk">
                        Create
                        </b-btn>
                    </div>  
                </b-modal>
    <!--end::Modal-->            
        </div>
    </div>
</template>

<script>

import BaseListComponent from "../base/List.vue"
export default {
    extends: BaseListComponent,
    name: "pembelian-list",
    route: "pembelian",
    endpoint: "pembelian",
    endpointParams: {scope:"detail"},
    buttons: "edit,delete",
    fields: ["tanggal:date","code",
    "Supplier.name",">qty:decimal", ">qty_pending:decimal", ">qty_received:decimal",">total:decimal", ">total_paid:decimal", ">total_pending:decimal",
    "status:badge","status_payment:badge"],

data() {
        return {
            title: "Pembelian",
            Supplier:'',
            AutoCompleteSupplier: [],
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'SupplierId':'',      
                'SupplierName' : '',     
                'code':'' ,   
                'notes':'' ,   
            },        
        };
    },
    methods: {
        async handleRows(rows) {
            var result = rows.map(row => {
                row.imagePath = this.$api.getImage(row.image,0,60,'inside');
                console.log(row.imagePath);
                return row;
            });
            return result;
        },
        clear () {
            this.model.tanggal = new Date();
            this.model.code = '';
            this.model.notes = '';
            this.Supplier = '';
            this.$refs.SupplierTypeahead.inputValue = ''
        },
        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()

            //console.log("evt = ", evt);
            if (this.Supplier=='' ) 
                this.$snotify.error('Please type Supplier name!!');
           else
                 this.saveAddItem()
        },
        async saveAddItem() {
            var item = this.Supplier.split("  ");
            this.model.SupplierId = item[0].substr(1);

            try {
                //Save Pembelian
                var result = await this.$api.post("Pembelian", this.model, true);
                //console.log("result Pembelian = ", result);
                this.$router.push(this.$options.route+'/new/'+result.id);

            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        async getAutoCompleteSupplierList() {
            let list = [];

            var DBList = await this.$api.get("supplier", {_build:true});
            for (let i = 0; i < DBList.length; i++) {
                var item = '#' + DBList[i].id + '  ' + DBList[i].name;
                list.push(item); 
            }

           return list;
        },
    },
    async created() {
        //console.log("Start mount pembelian");
        this.AutoCompleteSupplier= await this.getAutoCompleteSupplierList();

    }
};
</script>


<style lang="scss">
</style>
