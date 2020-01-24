<template>
    <div v-show="isReady" class="page-user">
        <bz-topbar title="Penjualan" icon="flaticon-shopping-basket">
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
                <label class="col-sm-2 col-form-label">Customer</label>
                <span class="mr-5 col-sm-3 col-form-label">
                    <label> {{ model.CustomerName }} </label> 
                </span>

                <label class="col-form-label mr-3 col-sm-2">Status Payment</label>
                <label :class="statusPaymentClass">{{ status_payment|humanize }}</label>                
            </div>

            <div class="row m-row--no-padding m-row--col-separator-xl form-group  mt-4">
                <label id="ProductIdLabel" for="ProductIdLabel" class="col-sm-2 col-form-label">No. Invoice</label>
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
                <h4  class="col-sm-12 col-form-label"><strong> Item Detail</strong></h4>
            </div>
            <div v-show="isItemAdded" class="row m-row--no-padding m-row--col-separator-xl mb-5">
                <div class="col">
                    <bz-datatable ref="Itemdatatable" :noPagination="true" :containerData="Items" :handleRows="handleRows" :q="q" @button-clicked="onDetailButtonClick" :fields="$options.AddItemfields" :buttons="$options.buttons" ></bz-datatable>
                </div>
            </div>
            <div class="m-demo__preview">
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
    </div>
    </div>
    </template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    route: "penjualan",
    endpointProduct: "product",
    endpointCustomer: "customer",
    buttons: "delete",
    AddItemfields: ["no",{key:"name", class:"w-25"}, 
    ">price:decimal",">quantity:int",">total:decimal","actions"],        
    Paymentfields: ["no","payment_method","tanggal:date",">total:decimal", "notes"],   
    extends:BaseFormComponent,
    name: "penjualan-form",
    endpoint: "penjualan",
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
            Customer:'',
            status:'pending',
            status_payment:'pending',
            tanggal:{},
            number: 'number',
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'CustomerId':'',      
                'CustomerName' : '',     
                'code':'' ,   
                'total': '0',
                'total_paid': '0',
                'total_pending': '0',
                'qty': '0',
                'qty_pending': '0',
                'value': '0',
                'value_pending': '0',
                 'status': 'null',
                'status_payment': 'null',
           },
            addItem: {
                'product_id' : '',
                'name': '',
                //'product_buy_price': '', 
                //'product_sell_price': '',
                'qty': '',  
                'PenjualanId':''  
            },           
            addPayment: {
                'tanggal' : '',
                'total': '',
                'KasBankId': '',
                'KasBankName': '',
                'PenjualanId':'',
                'notes':'',  
            },
             Items: [],
             PaymentItems: [],
             AutoCompleteCustomer: [],
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
        async getAutoCompleteCustomerList() {
            let list = [];

            var DBList = await this.$api.get("customer", {_build:true});
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
                var formattedPrice = this.formatMoney(DBList[i].price, 0, "Rp. ", ".")
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
           var model = { PenjualanId: this.id }
           //console.log("onConfirm model = ", model);
           var result = await this.$api.patch('penjualan/confirm', model);
           //console.log("onConfirm result = ", result);
           this.status = result.status;
           this.model.status = result.status;
           this.status_payment = result.status_payment;
           this.model.status_payment = result.status_payment;
        },
        async onComplete() {
            var model = { PenjualanId: this.id }
            //console.log("onComplete model = ", model);

            try {
                var result = await this.$api.patch('penjualan/complete', model);
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
                    this.addPayment.PenjualanId=this.id;
                    this.addPayment.KasBankId=this.selectedPayment.value;
                    this.addPayment.KasBankName=this.selectedPayment.text;
                    //console.log("onAddPayment Model = ", this.addPayment);
                
                    var resultaddPayment = await this.$api.patch("penjualan/add-payment", this.addPayment);
                    //console.log("result addPayment = ", resultaddPayment);

                    if (resultaddPayment.id!=undefined)
                    {
                        this.$snotify.success('Payment added');

                        this.model.total = resultaddPayment.total;
                        this.model.total_paid = resultaddPayment.total_paid;
                        this.model.total_pending = resultaddPayment.total_pending;
                        this.model.status = resultaddPayment.status;
                        this.status = resultaddPayment.status;
                        this.status_payment = resultaddPayment.status_payment;

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
            this.addItem.qty = '';
            this.$refs.ProductTypeahead.inputValue = ''
        },
        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()

            console.log("evt = ", evt);
            if (this.Products=='' ) 
                 this.$snotify.error('Please type item name!!');
            else if (this.addItem.qty=='' || this.addItem.qty=='0') 
                this.$snotify.error('Please add item quantity!!');
            else 
                this.saveAddItem()
        },
        async saveAddItem() {
            try {
                this.addItem.PenjualanId=this.id;
            
                //console.log("onAddItem ItemModel = ", this.addItem);
            
                var resultAddItem = await this.$api.patch("penjualan/add-item", this.addItem);
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
            var model = { PenjualanId: this.id }
            var refresh = await this.$api.patch('penjualan/refresh', model);
            var result = await this.$api.get("penjualan/" + refresh.id, {scope:'detail'});
            this.model = result;
            //console.log("model after refresh = ", this.model);
 
            var myDate = new Date(this.model.tanggal)
            this.model.FormattedDate = moment(myDate).format('DD MMM YYYY') 
 
            this.model.total = this.model.total.toString();          
            this.model.total_pending = this.model.total_pending.toString();          
            this.id=this.model.id;
            this.status = this.model.status;
            this.status_payment = this.model.status_payment;
            this.model.CustomerName=this.model.Customer.name;
 
            //get Penjualan Detail
            this.Items.length = 0
            this.Items=[];
            var PenjualanDetails = this.model.PenjualanDetails;

            if (PenjualanDetails.length>0)
            {
                this.isItemAdded = true;
                for (let i = 0; i < PenjualanDetails.length; i++) {
                    var item = {
                        no: i+1 ,
                        id: PenjualanDetails[i].id,
                        name: PenjualanDetails[i].product_name,  
                        price: PenjualanDetails[i].product_sell_price,                  
                        quantity: parseInt(PenjualanDetails[i].qty) ,                  
                        total: PenjualanDetails[i].total,                 
                    };
                    this.Items.push(item); 
                }
                this.$refs.Itemdatatable.refreshData();   
            }

 
            
            //Get Payment Detail    
            this.PaymentItems.length = 0
            this.PaymentItems=[];
            var PaymentDetails = this.model.PenjualanPayments;
            if (PaymentDetails.length>0)
            {
                for (let i = 0; i < PaymentDetails.length; i++) {
                    var item = {
                        no: i+1 ,
                        payment_method: PaymentDetails[i].payment_method,  
                        tanggal: PaymentDetails[i].tanggal,                  
                        total: PaymentDetails[i].total ,                  
                        notes: PaymentDetails[i].notes,                 
                    };
                    this.PaymentItems.push(item); 
                }
                 this.$refs.payDatatable.refreshData();   
            }
        },

        async onDetailButtonClick(item, index, event) {
            if (event == "delete") {
                if (confirm("Are you sure want to delete this item?")) {
                    this.$api.delete('penjualan-detail/'+item.id)
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
                        this.$refs.Itemdatatable.refreshData();
                    })
                    .catch((err)=> {
                        this.$snotify.error('Data deletion error!', err.toString());
                    })
                }
            }
        },
        async onRetur() {
            this.$store.dispatch('updatePenjualanId', this.id);
            this.$router.push(this.$options.returRoute+'/new/');
        },
        async onSend() {
             this.$store.dispatch('updatePenjualanId', this.id);
            this.$router.push(this.$options.sendRoute+'/new/');
        },
    },
    async mounted() {
        console.log("Start mount penjualan");
        this.PaymentList= await this.getFormattedPaymentList();

        this.AutoCompleteProduct= await this.getAutoCompleteProductList();
        this.id=this.$route.params.id;
        await this.refresh();

        var myDate = new Date(this.model.tanggal)
        this.model.FormattedDate = moment(myDate).format('DD MMM YYYY') 
        this.isReady=true;
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
    successRoute: '/app/penjualan',
    returRoute: '/app/penjualanretur',
    sendRoute: '/app/penjualansend',
};
</script>


<style lang="scss">
.modal-lg {
        max-width: 900px;
}

</style>
