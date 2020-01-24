<template>
    <div v-show="isReady" class="page-pembelian">
        <bz-topbar title="Pembelian" icon="fa fa-cart-plus">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <a @click="showModal" v-if="status === 'pending'" class="btn btn-warning m-btn m-btn--custom m-btn--icon mr-3 text-white">
                            <span>
                                <i class="la la-plus"></i>
                                    <span>Add Item</span>
                            </span>
                        </a> 
                        <a v-if="status === 'active'" data-toggle="modal" data-target="#addPayment_modal" class="btn btn-info m-btn m-btn--custom m-btn--icon text-white mr-3">
                            <span>
                                <i class="la la-plus"></i>
                                    <span>Add Payment</span>
                            </span>
                        </a>
                        <b-button type="button" @click="refresh()" class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent mr-3">Refresh</b-button>
                        <b-button v-if="status === 'pending' && isItemAdded" type="button" @click="onConfirm()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">Confirm</b-button>
                        <b-button v-if="status === 'active'" type="button" @click="onComplete()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">Complete</b-button>
                        <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-5">Cancel</b-button>

                        <b-dropdown v-if="status === 'active'" right text="Select menu" variant="info">
                            <b-dropdown-item-button v-b-modal.addRetur_modal>Retur Pembelian</b-dropdown-item-button>
                            <b-dropdown-item-button v-b-modal.addReceive_modal>Penerimaan Barang</b-dropdown-item-button>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item-button @click="onPrint()">Print</b-dropdown-item-button>
                        </b-dropdown> 
                    </li>						
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
        <div class="m-portlet__body">
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 text-left">Tanggal</label>
                <span class="mr-5 col-sm-3 text-left">
                    <label> {{ model.FormattedDate }} </label> 
                </span>
                 <label v-if="isItemAdded" class="text-left mr-3 col-sm-2 ">Status</label>
                <span v-if="isItemAdded" :class="statusClass">{{ status|humanize }}</span>             
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 text-left">Supplier</label>
                <span class="mr-5 col-sm-3 text-left">
                    <label> {{ model.SupplierName }} </label> 
                </span>
                <label v-if="isItemAdded" class="text-left mr-3 col-sm-2">Status Payment</label>
                <span v-if="isItemAdded" :class="statusPaymentClass">{{ status_payment|humanize }}</span>                
            </div>

            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 text-left">No. Invoice</label>
                <span class="col-sm-9 text-left">
                    <label> {{ model.code }} </label> 
                </span>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 text-left">Notes</label>
                <span class="col-sm-5 text-left">
                    <label> {{ model.notes }} </label> 
                </span>
                <div v-if="status === 'active'" class="col-sm-5">
                    <a data-toggle="modal" data-target="#PaymentDetail_modal" class="btn btn-info m-btn m-btn--custom m-btn--icon text-white float-right">
                        <span>Show Payment Detail</span>
                    </a>
                </div>              
            </div>
            <div v-show="isItemAdded" class="row m-row--no-padding m-row--col-separator-xl">
                <h5 class="col-sm-12 text-left">Item Detail</h5>
            </div>
            <div v-show="isItemAdded" class="row m-row--no-padding m-row--col-separator-xl mb-5">
                <div class="col">
                    <bz-datatable ref="ItemPembdatatable"  :notSearchable="true" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" @button-clicked="onDetailButtonClick" :fields="$options.AddItemfields" :buttons="$options.buttons" ></bz-datatable>
                </div>
            </div>
            <div v-if="isItemAdded">
                <b-row>
                    <b-col>
                        <div class="m-widget26">
                            <div class="m-widget26__number">
                                Rp. {{ model.total|decimal }}
                                <small>Total</small>
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <div class="m-widget26">
                            <div class="m-widget26__number m--font-success">
                                Rp. {{ model.total_paid|decimal }}
                                <small>Total Paid</small>
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <div class="m-widget26">
                            <div class="m-widget26__number m--font-danger">
                                Rp. {{ model.total_pending|decimal }}
                                <small>Total Pending</small>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </div>
       </div>
        <!--begin model-->
        <b-modal id="addProduct_modal"
             ref="addProduct_modal"
             title="Add New Item"
             @ok="handleOk"
             @shown="clearProduct">
                <form @submit.stop.prevent="saveAddItem">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <h3 class="col-form-label col-sm-3">Product</h3>
                        <vue-bootstrap-typeahead
                            ref="ProductTypeahead"
                            class="col-sm-8" 
                            v-model="Products" @hit="ProductChange"
                            :data="AutoCompleteProduct"
                            placeholder="Ketik Nama Product"
                        />
                     </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <h3 class="col-form-label col-sm-3">Price</h3>
                        <b-form-input class="col-sm-8" v-model="addItem.product_buy_price"></b-form-input>
                     </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <h3 class="col-form-label col-sm-3  float-right">Quantity</h3>
                        <b-form-input class="col-sm-3" v-model="addItem.qty"></b-form-input>
                    </div>
      </form>
    </b-modal>
    <!--end::Modal-->


        <!--begin::Modal-->
        <div class="modal fade" id="addPayment_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="m-portlet__head-text">
                        Add new Payment
                    </h4>
                </div>
                <div class="modal-body">
                <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                    <label class="col-sm-4 col-form-label">Tanggal</label>
                    <b-form-input type='date' class="col-sm-6" v-model="addPayment.tanggal"></b-form-input>
                </div>
                <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                    <label class="col-sm-4 col-form-label">Kas Bank</label>
                    <select v-model="selectedPayment" class="col-sm-6">
                        <option :value="payment" v-for="payment in PaymentList">{{payment.text}}</option>
                    </select>
                </div>
                <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                    <label class="col-sm-4 col-form-label">Total Payment</label>
                    <b-form-input type='number' class="col-sm-6" v-model="addPayment.total"></b-form-input>
                </div>
                 <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                    <label class="col-sm-4 col-form-label">Notes</label>
                    <b-form-input class="col-sm-6" v-model="addPayment.notes"></b-form-input>
                </div>
                    <div class="float-right">
                            <a data-toggle="modal" @click="onAddPayment()" data-dismiss="modal" class="btn btn-warning m-btn m-btn--custom m-btn--icon mb-3">
                            <span>
                                <i class="la la-plus"></i>
                                    <span>Add Payment</span>
                            </span>
                            </a> 
                        </div>
                    </div>
                </div>
             </div>           
        </div>
        <!--end::Modal-->

                <!--begin::Modal-->
        <div class="modal fade" id="PaymentDetail_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-body">
                <div class="row m-row--no-padding m-row--col-separator-xl mb-3">
                     <h5 class="m-portlet__head-text">
                        Payment Detail
                    </h5>
                </div>
                <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">
                            <bz-datatable ref="payDatatable" :noPagination="true" :containerData="PaymentItems" :handleRows="handleRows" :fields="$options.Paymentfields" :buttons="$options.buttons" ></bz-datatable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
        <!--end::Modal-->        
       <!--begin model-->
        <b-modal id="addRetur_modal" size="lg"
             ref="addRetur_modal"
             title="New Retur Pembelian">
                <form @submit.stop.prevent="saveReturItem">
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-3 col-form-label">Tanggal</label>
                        <div class="col-sm-2">
                            <flat-pickr class="form-control" 
                                :config="{altInput:true, altFormat:'d M Y'}" 
                                v-model="returModel.tanggal"  />
                        </div>
                   </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                        <label class="col-sm-3 col-form-label">No. Retur</label>
                        <b-form-input class="col-sm-9" v-model="returModel.code"></b-form-input>
                    </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-3 col-form-label">Notes</label>
                        <b-form-textarea class="col-sm-9" v-model="returModel.notes"></b-form-textarea>
                    </div>    

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mb-0">
                        <div class="m-portlet col-sm-12 pb-0">
                            <div class="m-portlet__head">
                                <div class="m-portlet__head-caption">
                                    <div class="m-portlet__head-title">
                                        <h3 class="col-form-label">Pembelian</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body mb-0 pb-0">
                                <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                                    <label class="col-sm-2 mr-3 text-left">Tgl Pembelian</label>
                                    <label class="col-sm-3 text-left"> : {{ model.FormattedDate }}</label>
                                    <label class="col-sm-2 text-left">Supplier</label>
                                    <label class="text-left"> : {{ model.SupplierName }}</label>
                                </div>
                                <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                                    <label class="col-sm-2 mr-3 text-left">No. Invoice</label>
                                    <label class="col-sm-9 text-left"> : {{ model.code }}</label>
                                </div>
                                <div class="row m-row--no-padding m-row--col-separator-xl">
                                    <div class="col">   
                                        <bz-datatable ref="PembDetaildatatable" :notSearchable="true" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" :fields="$options.AddReturfields" ></bz-datatable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </form>
                    <div slot="modal-footer" class="w-100">
                        <b-btn size="sm" class="float-right" variant="primary" @click="handleReturOk">
                        Create
                        </b-btn>
                    </div>  
                </b-modal>
    <!--end::Modal-->

       <!--begin model-->
        <b-modal id="addReceive_modal" size="lg"
             ref="addReceive_modal"
             title="New Penerimaan Barang">
                <form @submit.stop.prevent="saveReceiveItem">
                   <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-3 col-form-label">Tanggal</label>
                        <div class="col-sm-2">
                            <flat-pickr class="form-control" 
                                :config="{altInput:true, altFormat:'d M Y'}" 
                                v-model="returModel.tanggal"  />
                        </div>
                   </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                        <label class="col-sm-3 col-form-label">No. Penerimaan</label>
                        <b-form-input class="col-sm-9" v-model="returModel.code"></b-form-input>
                    </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <label class="col-sm-3 col-form-label">Notes</label>
                        <b-form-textarea class="col-sm-9" v-model="returModel.notes"></b-form-textarea>
                    </div>    

                    <div class="row m-row--no-padding m-row--col-separator-xl form-group  mb-0">
                        <div class="m-portlet col-sm-12 pb-0">
                            <div class="m-portlet__head">
                                <div class="m-portlet__head-caption">
                                    <div class="m-portlet__head-title">
                                        <h3 class="col-form-label">Pembelian</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body mb-0 pb-0">
                                <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                                    <label class="col-sm-2 mr-3 text-left">Tgl Pembelian</label>
                                    <label class="col-sm-3 text-left"> : {{ model.FormattedDate }}</label>
                                    <label class="col-sm-2 text-left">Supplier</label>
                                    <label class="text-left"> : {{ model.SupplierName }}</label>
                                </div>
                                <div class="row m-row--no-padding m-row--col-separator-xl form-group ">
                                    <label class="col-sm-2 mr-3 text-left">No. Invoice</label>
                                    <label class="col-sm-9 text-left"> : {{ model.code }}</label>
                                </div>
                                <div class="row m-row--no-padding m-row--col-separator-xl">
                                    <div class="col">   
                                        <bz-datatable ref="PembDetaildatatable" :notSearchable="true" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" :fields="$options.AddReturfields" ></bz-datatable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </form>
                    <div slot="modal-footer" class="w-100">
                        <b-btn size="sm" class="float-right" variant="primary" @click="handleReceiveOk">
                        Create
                        </b-btn>
                    </div>  
                </b-modal>
    <!--end::Modal-->
    </div>
    </div>
</template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    route: "pembelian",
    printRoute: '/app/pembelian/print/',
    endpointProduct: "product",
    endpointSupplier: "supplier",
    buttons: "delete",
    AddItemfields: ["no",{key:"name", class:"w-25"}, 
    ">price:decimal",">quantity:int",">total:decimal","actions"],        
    AddReturfields: ["no","name", 
    ">price:decimal",">quantity:decimal",">qty_pending:decimal"],   
    Paymentfields: ["no", "payment","tanggal:date",">total_paid:decimal", "notes"],   
    extends:BaseFormComponent,
    name: "pembelian-form",
    endpoint: "pembelian",
    endpointParams:{scope:"detail"},
    data() {
        return {
            statusClass: this.$options.filters.status_badge('pending'),
            statusPaymentClass: this.$options.filters.status_badge('pending'),
            formType: {},
            isReady: false,
            isItemAdded: false,
            errors: {},
            fieldList: [],
            PaymentList: [],
            selectedItem: {},
            selectedPayment: {},
            q:'',
            id:'',
            Confirm:false,
            Products:'',
            ProductId:'',
            ProductName:'',            
            Supplier:'',
            SupplierName:'',
            status:'pending',
            status_payment:'pending',
            tanggal:{},
            number: 'number',
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'SupplierId':'', 
                'SupplierName' : '',     
                'code':'' ,   
                'total': '0',
                'total_paid': '0',
                'total_pending': '0',
                'qty': '0',
                'qty_pending': '0',
                'value': '0',
                'value_pending': '0',
                'grand_total': '0',
                'status': 'pending',
                'status_payment': 'pending',
                'PembelianDetails':[]
           },
            addItem: {
                'product_id' : '',
                'product_buy_price': '',
                'qty': '',  
                'PembelianId':''  
            },           
            addPayment: {
                'tanggal' : '',
                'total': '',
                'KasBankId': '',
                'KasBankName': '',
                'PembelianId':'',
                'notes':'',  
            },
            returModel: {
                'tanggal' : '',
                'PenjualanId':'',  
                'code':'' ,   
                'notes':'' ,  
            },
            Items: [],
             PaymentItems: [],
             AutoCompleteSupplier: [],
             AutoCompleteProduct: [],
             query:'',
        };
    },
    methods: {
        format (value, event) {
            return this.$options.filters.decimal(value)
        },
        async getFormattedPaymentList() {
            let list = [];

            var DBList = await this.$api.get("kasbank", {_build:true});

            for (let i = 0; i < DBList.length; i++) {
                var item = {
                value: DBList[i].id ,
                text: DBList[i].name  
                };
                list.push(item); 
            }
           return list;
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
        async getAutoCompleteProductList() {
            let list = [];

            var DBList = await this.$api.get("product", {_build:true});
 
            for (let i = 0; i < DBList.length; i++) {
                var formattedPrice = this.formatMoney(DBList[i].buy_price, 0, "Rp. ", ".")
                var item = `#${DBList[i].id}  ${DBList[i].name} ( ${formattedPrice} stock: ${this.$options.filters.decimal(DBList[i].stock)} ) `;
                list.push(item); 
            }
            return list;
        },
        formatMoney(source,places, symbol, thousand, decimal) {
            return this.$options.filters.money(source, places, symbol, thousand, decimal);
         },

        async handleRows(rows) {
             console.log("handleRows = ", rows);           
            return rows;
        },
        ProductChange(event) {

            var item = event.split("  ");
            this.addItem.product_id = item[0].substr(1);
        },
        async onConfirm() {
           var model = { PembelianId: this.id }
           //console.log("onConfirm model = ", model);
           var result = await this.$api.patch('pembelian/confirm', model);
           //console.log("onConfirm result = ", result);
            this.status = result.status;
           this.model.status = result.status;
           this.status_payment = result.status_payment;
           this.model.status_payment = result.status_payment;
        },
        async onComplete() {
            var model = { PembelianId: this.id }
            //console.log("onComplete model = ", model);

            try {
                var result = await this.$api.patch('pembelian/complete', model);
                //console.log("onComplete result = ", result);
                this.$snotify.success('Data Saved');
                this.$router.push(this.$options.successRoute);
            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        async onAddPayment() {
               try {
                    this.addPayment.PembelianId=this.id;
                    this.addPayment.KasBankId=this.selectedPayment.value;
                    this.addPayment.KasBankName=this.selectedPayment.text;
                    //console.log("onAddPayment Model = ", this.addPayment);
                
                    var resultaddPayment = await this.$api.patch("pembelian/add-payment", this.addPayment);
                    //console.log("result addPayment = ", resultaddPayment);

                    if (resultaddPayment.id!=undefined)
                    {
                        this.model.total = resultaddPayment.total;
                        this.model.total_paid = resultaddPayment.total_paid;
                        this.model.total_pending = resultaddPayment.total_pending;
                        this.model.status = resultaddPayment.status;
                        this.status = resultaddPayment.status;
                        this.status_payment = resultaddPayment.status_payment;
                        this.model.status_payment = resultaddPayment.status_payment;
                        this.model.grand_total = resultaddPayment.grand_total;
                        this.$snotify.success('Payment added');
                        //Clear Payment Field
                        this.addPayment.tanggal='';
                        this.addPayment.total='';
                        this.addPayment.KasBankId='';
                        this.addPayment.KasBankName='';
                        this.addPayment.notes='';
                        
                        this.refresh();
                   }
                 } catch (error) {
                    console.log("ERR", error);
                    this.$refs.form.errors = error;
                    this.$snotify.error('Validation Error');
                }
        },
        async showModal () {
            this.$refs.addProduct_modal.show()
        },
        clearProduct () {
            this.addItem.product_buy_price = '';
            this.addItem.qty = '';
            this.$refs.ProductTypeahead.inputValue = ''
        },
        async saveAddItem() {
            try {
                this.addItem.PembelianId=this.id;
                //console.log("saveAddItem ItemModel = ", this.addItem);
            
                var resultAddItem = await this.$api.patch("pembelian/add-item", this.addItem);
                //console.log("result AddItem = ", resultAddItem);
                if (resultAddItem.id!=undefined)
                {
                    this.model.total = resultAddItem.total;
                    this.model.total_paid = resultAddItem.total_paid;
                    this.model.total_pending = resultAddItem.total_pending;
                    this.model.status = resultAddItem.status;
                    this.status = resultAddItem.status;
                    this.model.status_payment = resultAddItem.status_payment;
                    this.status_payment = resultAddItem.status_payment;

                    this.$snotify.success('Item added');
                    this.refresh();
                    this.clearProduct()
                    this.$refs.addProduct_modal.hide()
                    this.isItemAdded = true;
            }

            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        handleEvt(evt, type) {
            // Prevent modal from closing
            evt.preventDefault()
            console.log("evt = ", evt);

            if (type=='item')
            {
                if (this.Products=='' ) 
                    this.$snotify.error('Please type item name!!');
                else if (this.addItem.qty=='' || this.addItem.qty=='0' || this.addItem.product_buy_price=='' || this.addItem.product_buy_price=='0') 
                    this.$snotify.error('Please add item buy price and quantity');
                else 
                    this.saveAddItem()
            }
            else if (type=='receive')
                this.saveReceiveItem()
            else if (type=='retur')                                            
                this.saveReturItem()
        },
        handleOk (evt) {
            this.handleEvt(evt,'item')
        },
        handleReceiveOk (evt) {
            this.handleEvt(evt,'receive')
        },
        handleReturOk (evt) {
            this.handleEvt(evt,'retur')
        },
        async saveReturItem() {
            console.log("modelPenj = ", this.returModel);
            var isSuccessDetail = true;

            try {
                //Save
                this.returModel.PembelianId=this.id;
                var result = await this.$api.post("pembelian-retur", this.returModel, true);
                //console.log("result retur Pembelian = ", result);

                if (result.id!='')
                {
                    for (let i = 0; i < this.Items.length; i++) {
                        var model = { 
                            product_id: this.Items[i].product_id, 
                            qty_returned: 0, 
                            PembelianReturId: result.id, 
                            PembelianDetailId: this.Items[i].id
                        }
                        console.log("model detail = ", model);   
                        try {
                            var resultDet = await this.$api.patch('pembelian-retur/add-item', model);
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
                    this.$router.push(this.$options.returRoute+'/new/'+result.id);
            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
    async saveReceiveItem() {
            console.log("modelPenj = ", this.returModel);
            var isSuccessDetail = true;

            try {
                //Save
                this.returModel.PembelianId=this.id;
                var result = await this.$api.post("pembelian-receive", this.returModel, true);
                //console.log("result receive pembelian = ", result);

                if (result.id!='')
                {
                    for (let i = 0; i < this.Items.length; i++) {
                        var model = { 
                            product_id: this.Items[i].product_id, 
                            qty_sent: 0, 
                            PembelianReceiveId: result.id, 
                            PembelianDetailId: this.Items[i].id
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
                    this.$router.push(this.$options.receiveRoute+'/new/'+result.id);
            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        async refresh() {
            var model = { PembelianId: this.id }
            var refresh = await this.$api.patch('pembelian/refresh', model);
            var result = await this.$api.get("pembelian/" + refresh.id, {scope:'detail'});
            this.model = result;
            console.log("model after refresh = ", this.model);
 
            var myDate = new Date(this.model.tanggal)
            this.model.FormattedDate = moment(myDate).format('DD MMM YYYY') 

            this.model.total = this.model.total.toString();          
            this.model.total_pending = this.model.total_pending.toString();          
            this.id=this.model.id;
            this.status = this.model.status;
            this.status_payment = this.model.status_payment;
            this.model.SupplierName=this.model.Supplier.name;

            //get Pembelian Detail
            this.Items.length = 0
            this.Items=[];
            var PembelianDetails = this.model.PembelianDetails;

            for (let i = 0; i < PembelianDetails.length; i++) {
                this.isItemAdded=true;
                var item = {
                    no: i+1 ,
                    id: PembelianDetails[i].id,
                    product_id : PembelianDetails[i].product_id,  
                    name: PembelianDetails[i].product_name,  
                    price: PembelianDetails[i].product_buy_price,                  
                    quantity: parseInt(PembelianDetails[i].qty) ,                  
                    total: PembelianDetails[i].total,                 
                    qty_pending: PembelianDetails[i].qty_pending,          
                };
                this.Items.push(item); 
            }
 
            //console.log("Items = ", this.Items);
            this.$refs.ItemPembdatatable.refreshData();   

            //Get Payment Detail    
            this.PaymentItems.length = 0
            this.PaymentItems=[];
            var PaymentDetails = this.model.PembelianPayments;
            if (PaymentDetails.length>0)
            {
                for (let i = 0; i < PaymentDetails.length; i++) {
                    var item = {
                        no: i + 1 ,
                        tanggal: PaymentDetails[i].tanggal,
                        payment: PaymentDetails[i].payment_method,
                        total_paid: PaymentDetails[i].total,                  
                        notes: PaymentDetails[i].notes,  
                        }
                    this.PaymentItems.push(item); 
                }
                //console.log("PaymentItems ", this.PaymentItems);
                this.$refs.payDatatable.refreshData();   
            }
        },

        async onDetailButtonClick(item, index, event) {
        if (event == "delete") {
                if (confirm("Are you sure want to delete this item?")) {
                    this.$api.delete('pembelian-detail/'+item.id)
                    .then((data)=> {
                        this.$snotify.success('Data Deleted!');
                        this.refresh();
                    })
                    .catch((err)=> {
                        this.$snotify.error('Data deletion error!', err.toString());
                    })
                }
            }
        },       
        async onButtonClick(item, index, event) {
            if (event == "edit") {
                this.$router.push(this.$options.route+'/edit/'+item.id);
            }
            else if (event == "delete") {
                if (confirm("Are you sure want to delete this item?")) {
                    this.$api.delete(this.$options.endpoint+'/'+item.id)
                    .then((data)=> {
                        this.$snotify.success('Data Deleted!');
                        this.$refs.datatable.refreshData();
                    })
                    .catch((err)=> {
                        this.$snotify.error('Data deletion error!', err.toString());
                    })
                }
            }
        },
        async onPrint() {
            this.$router.push(this.$options.printRoute+this.id);
        },
    },
    async mounted() {
        console.log("Start mount pembelian");
        this.PaymentList= await this.getFormattedPaymentList();

        this.AutoCompleteProduct= await this.getAutoCompleteProductList();
        this.id=this.$route.params.id;
        this.returModel.tanggal=new Date();

await this.refresh();
        this.isReady=true;
     },
    computed:  {
        mode: function() {
                if (this.isItemAdded)
                    return 'update'
                else
                    return 'create';
        }         
    },   
    watch: {
        status: function(val) {
            this.statusClass = this.$options.filters.status_badge(val)
            if (val==='pending')
                 this.$options.AddItemfields = ["no",{key:"name", class:"w-25"}, "price:decimal","quantity:number","total:decimal","actions"];
            else 
                this.$options.AddItemfields = ["no",{key:"name", class:"w-25"}, "price:decimal","quantity:number","total:decimal"];
        }, 
        status_payment: function(val, oldVal) {
             return this.$options.filters.status_badge(val)
        }    
  },
    successRoute: '/app/pembelian',
    returRoute: '/app/pembelianretur',
    receiveRoute: '/app/pembelianreceive',
};
</script>


<style lang="scss">
.modal-lg {
        max-width: 900px;
}
//.col-form-label {
//    padding-top:0px;
//    padding-bottom: 0px
//}
</style>
