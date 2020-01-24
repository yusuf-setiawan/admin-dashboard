<template>
    <div v-show="isReady" class="page-pembelian">
        <bz-topbar title="Pembelian" icon="fa fa-cart-plus">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <a @click="$router.go(-1)" class="btn btn-primary m-btn m-btn--custom m-btn--icon text-white">
                        <span>
                            <i class="fa fa-angle-left"></i>
                                <span>Back</span>
                        </span>
                    </a> 
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
        <div class="m-portlet__body">
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 col-form-label">Tanggal</label>
                <span class="mr-5 col-sm-3 col-form-label">
                    <label> {{ model.FormattedDate }} </label> 
                </span>
                <label class="col-form-label mr-3 col-sm-2">Status</label>
                <label :class="statusClass">{{ status|humanize }}</label>             
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 col-form-label">Supplier</label>
                <span class="mr-5 col-sm-3 col-form-label">
                    <label> {{ model.SupplierName }} </label> 
                </span>
                <label class="col-form-label mr-3 col-sm-2">Status Payment</label>
                <label :class="statusPaymentClass">{{ status_payment|humanize }}</label>                
            </div>

            <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                <label class="col-sm-2 col-form-label">No. Invoice</label>
                <span class="col-sm-2 col-form-label">
                    <label> {{ model.code }} </label> 
                </span>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 col-form-label">Notes</label>
                <span class="col-sm-5 col-form-label">
                    <label> {{ model.notes }} </label> 
                </span>
                <div v-if="status === 'active'" class="col-sm-5">
                    <a data-toggle="modal" data-target="#PaymentDetail_modal" class="btn btn-info m-btn m-btn--custom m-btn--icon text-white float-right">
                        <span>Show Payment Detail</span>
                    </a>
                </div>              
            </div>
                <div v-show="isItemAdded" class="row m-row--no-padding m-row--col-separator-xl">
                    <label  class="col-sm-12 col-form-label"><strong> Item Detail</strong></label>
                </div>
                <div v-show="isItemAdded" class="row m-row--no-padding m-row--col-separator-xl mb-5">
                    <div class="col">
                   <bz-datatable ref="ItemPembdatatable" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" @button-clicked="onDetailButtonClick" :fields="$options.AddItemfields" :buttons="$options.buttons" ></bz-datatable>
                    </div>
                </div>
            <div v-if="isItemAdded" class="m-demo__preview">
                <div class="m-stack m-stack--ver m-stack--general m-stack--demo">
                     <div class="m-stack__item m-stack__item--center m-stack__item--middle m-stack__item--fluid">
                        <h5> Total</h5>
                        <hr>
                        <h3>Rp. {{ model.total|decimal }}</h3>
                    </div>
                    <div class="m-stack__item m-stack__item--center m-stack__item--middle m-stack__item--fluid">
                        <h5> Total Paid</h5>
                        <hr>
                        <h3>Rp. {{ model.total_paid|decimal }}</h3>
                    </div>
                    <div class="m-stack__item m-stack__item--center m-stack__item--middle m-stack__item--fluid">
                        <h5> Total Pending</h5>
                        <hr>
                        <h3>Rp. {{ model.total_pending|decimal }}</h3>
                    </div>
                </div>
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
                        <vue-bootstrap-typeahead
                            ref="ProductTypeahead"
                            class="mr-5 col-sm-12" 
                            v-model="Products" @hit="ProductChange"
                            :data="AutoCompleteProduct"
                            placeholder="Ketik Nama Product"
                        />
                     </div>
                    <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                        <h3 class="col-form-label mr-3">Price</h3>
                        <b-form-input class="col-sm-6 mr-3" type="number" v-model="addItem.product_buy_price"></b-form-input>
                        <h3 class="col-form-label mr-3  float-right">Quantity</h3>
                        <b-form-input :formatter="format" class="col-sm-2 float-right" type="number" v-model="addItem.qty"></b-form-input>
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
        </div>
        <!--end::Modal-->        
    </div>
    </div>
</template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    route: "pembelian",
    laporanroute: "laporanpembelian",
    endpointProduct: "product",
    endpointSupplier: "supplier",
    buttons: "delete",
    AddItemfields: ["no",{key:"name", class:"w-25"}, 
    ">price:decimal",">quantity:int",">total:decimal"],        
    Paymentfields: ["no", "payment","tanggal:date",">total_paid:decimal", "notes"],   
    extends:BaseFormComponent,
    name: "pembelian-form",
    endpoint: "pembelian",
    endpointParams:{scope:"detail"},
    data() {
        return {
            statusClass: 'col-form-label pr-3 pl-3 bg-danger text-white',
            statusPaymentClass: 'col-form-label pr-3 pl-3 bg-danger text-white',
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
        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()

            //console.log("evt = ", evt);
            if (this.Products=='' ) 
                this.$snotify.error('Please type item name!!');
            else if (this.addItem.qty=='' || this.addItem.qty=='0' || this.addItem.product_buy_price=='' || this.addItem.product_buy_price=='0') 
                this.$snotify.error('Please add item buy price and quantity!!');
            else 
                this.saveAddItem()
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
        async refresh() {
            var model = { PembelianId: this.id }
            var refresh = await this.$api.patch('pembelian/refresh', model);
            var result = await this.$api.get("pembelian/" + refresh.id, {scope:'detail'});
            this.model = result;
            //console.log("model after refresh = ", this.model);
 
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
                    name: PembelianDetails[i].product_name,  
                    price: PembelianDetails[i].product_buy_price,                  
                    quantity: parseInt(PembelianDetails[i].qty) ,                  
                    total: PembelianDetails[i].total,                 
                };
                this.Items.push(item); 
            }
 
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
        async onRetur() {
            this.$store.dispatch('updatePembelianId', this.id);
            this.$router.push(this.$options.returRoute+'/new');
        },
        async onReceive() {
            this.$store.dispatch('updatePembelianId', this.id);
            this.$router.push(this.$options.receiveRoute+'/new');
        },
    },
    async mounted() {
        console.log("Start mount pembelian");
        this.PaymentList= await this.getFormattedPaymentList();

        this.AutoCompleteProduct= await this.getAutoCompleteProductList();
        this.id=this.$route.params.id;
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
        status: function(val, oldVal) {
            if (val==='pending')
            {
                this.statusClass = "col-form-label pr-3 pl-3 bg-danger text-white"
                this.$options.AddItemfields = ["no",{key:"name", class:"w-25"}, "price:decimal","quantity:number","total:decimal","actions"];
            }
            else if (val==='active')
            {
                    this.statusClass = "col-form-label pr-3 pl-3 bg-success text-white"
                    this.$options.AddItemfields = ["no",{key:"name", class:"w-25"}, "price:decimal","quantity:number","total:decimal"];
            }
        }, 
        status_payment: function(val, oldVal) {
             if (val==='pending')
               this.statusPaymentClass = "col-form-label pr-3 pl-3 bg-danger text-white"
            else if (val==='complete')
               this.statusPaymentClass = "col-form-label pr-3 pl-3 bg-success text-white"
            

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

</style>
