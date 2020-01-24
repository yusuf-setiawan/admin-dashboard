<template>
    <div class="page-penjualan">
        <bz-topbar title="Penjualan" icon="flaticon-shopping-basket">
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
                    <!--begin model-->
        <b-modal id="addProduct_modal"
             ref="addProduct_modal"
             title="Create New Penjualan"
             @shown="clear">
                <form @submit.stop.prevent="saveAddItem">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Tanggal</label>
                        <flat-pickr class="form-control col-sm-8" 
                            :config="{altInput:true, altFormat:'d M Y'}" 
                            v-model="model.tanggal"  />
                   </div>

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-4 col-form-label">Customer</label>
                        <vue-bootstrap-typeahead 
                            class="col-sm-8" 
                            v-model="Customer" ref="CustomerTypeahead"
                            :data="AutoCompleteCustomer"
                            placeholder="Ketik Nama Customer"
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
    name: "penjualan-list",
    route: "penjualan",
    endpoint: "penjualan",
    endpointParams:{scope:"detail"},
    buttons: "edit,delete",
    fields: ["tanggal:date","code",
    "Customer.name",">qty:decimal", ">qty_pending:decimal", ">qty_sent:decimal",">total:decimal", ">total_paid:decimal", ">total_pending:decimal",
    "status:badge","status_payment:badge"],
    data() {
        return {
            title: "Penjualan",
            Customer:'',
            AutoCompleteCustomer: [],
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'CustomerId':'',      
                'CustomerName' : '',     
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
            this.Customer = '';
            this.$refs.CustomerTypeahead.inputValue = ''
        },
        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()

            console.log("evt = ", evt);
            if (this.Customer=='' ) 
                this.$snotify.error('Please type customer name!!');
            else
                this.saveAddItem()
        },
        async saveAddItem() {
                console.log("Customer = ", this.Customer);

                var item = this.Customer.split("  ");
                this.model.CustomerId = item[0].substr(1);
 
                console.log("modelPenj = ", this.model);

                try {
                    //Save Penjualan
                    var result = await this.$api.post("Penjualan", this.model, true);
                    console.log("result Penjualan = ", result);
                    this.$router.push(this.$options.route+'/new/'+result.id);
 
                } catch (error) {
                    console.log("ERR", error);
                    this.$refs.form.errors = error;
                    this.$snotify.error('Validation Error');
                }
        },
        async getAutoCompleteCustomerList() {
            let list = [];

            var DBList = await this.$api.get("customer", {_build:true});
            console.log("DBList = ", DBList);
            for (let i = 0; i < DBList.length; i++) {
                var item = '#' + DBList[i].id + '  ' + DBList[i].name;
                list.push(item); 
            }

           return list;
        },
    },
    async created() {
        console.log("Start mount penjualan");
        this.AutoCompleteCustomer= await this.getAutoCompleteCustomerList();
        console.log("AutoCompleteCustomer ", this.AutoCompleteCustomer);

        //set current date
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.model.tanggal=date;
    }
};
</script>


<style lang="scss">
</style>
