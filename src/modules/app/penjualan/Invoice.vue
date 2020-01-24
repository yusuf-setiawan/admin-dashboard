<template>
<div>
    <bz-topbar title=" " icon=" ">
        <template slot="tools">
            <ul class="m-portlet__nav">
                <a @click="$router.go(-1)" class="btn btn-primary m-btn m-btn--custom m-btn--icon text-white">
                    <span>
                        <i class="fa fa-angle-left"></i>
                            <span>Back</span>
                    </span>
                </a> 
            </ul>
            <ul class="m-portlet__nav">
                <li class="m-portlet__nav-item">
                    <b-button type="button" @click="print()" class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent mr-3">Print</b-button>
                </li>						
            </ul>
        </template>
    </bz-topbar>
    <div class="container-fluid contentwithtopbar">       
        <div class="m-content" id="modalInvoice">
            <div class="m-portlet">
                <div class="m-portlet__body m-portlet__body--no-padding">
                    <div class="m-invoice-1">
                        <div class="m-invoice__wrapper">
                            <div class="m-invoice__head" style="background-image: url(../../assets/app/media/img//bg/bg-6.jpg);">
                                <div class="m-invoice__container m-invoice__container--centered">
                                    <div class="m-invoice__logo">
                                        <a href="#">
                                            <h1>INVOICE</h1>
                                        </a>
                                        <!--
                                        <a href="#">
                                            <img src="../../assets/app/media/img//logos/logo_client_white.png">
                                        </a>-->
                                    </div>
                                    <span class="m-invoice__desc">
                                        <span>UD. Abadi</span>
                                        <span>Jl. Mayjend Sungkono 12, Surabaya</span>
                                    </span>
                                    <div class="m-invoice__items">
                                        <div class="m-invoice__item">
                                            <span class="m-invoice__subtitle">DATA</span>
                                            <span class="m-invoice__text">{{model.FormattedDate}}</span>
                                        </div>
                                        <div class="m-invoice__item">
                                            <span class="m-invoice__subtitle">INVOICE NO.</span>
                                            <span class="m-invoice__text">{{model.code}}</span>
                                        </div>
                                        <div class="m-invoice__item">
                                            <span class="m-invoice__subtitle">INVOICE TO.</span>
                                            <span class="m-invoice__text">{{CustomerName}}<br>{{CustomerAddress}}<br>{{CustomerPhone}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m-invoice__body m-invoice__body--centered">
                <b-table :items="Items" >
                    <template slot="price" slot-scope="data" v-html="data.value">
                        <span>{{data.value | money }}</span>
                    </template>
                    <template slot="quantity" slot-scope="data" v-html="data.value">
                        <span>{{data.value | decimal }}</span>
                    </template>
                            <template slot="total" slot-scope="data" v-html="data.value">
                        <div class="text-danger">{{data.value | money }}</div>
                    </template>
                </b-table>
                            </div>
                            <div class="m-invoice__footer">
                                <div class="m-invoice__container m-invoice__container--centered">
                                    <div class="m-invoice__content text-left">
                                        <span>BANK TRANSFER</span>
                                        <span>Account Name  : BCA</span>
                                        <span>Account Number: 1010679457</span>  
                                        
                                    </div>
                                    <div class="m-invoice__content">
                                        <span>TOTAL AMOUNT</span>
                                        <span class="m-invoice__price text-danger">{{model.total | money}}</span>
                                        <span>Taxes Included</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>


<script>

import BaseListComponent from "../base/List.vue"
export default {
    extends: BaseListComponent,
    name: "penjualan-print",
    route: "penjualan",
    endpoint: "penjualan",
    buttons: "edit,delete",
    fields: [{key:"name", class:"w-25"}, 
    {key:"code", class:"w-25"},
    "address", "email", "phone","actions"],
    data() {
        return {
            title: "Supplier",
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
           Items: [],
           CustomerName: '',
           CustomerAddress:'',
           CustomerPhone:'',
           Bank:''
        };
    },
       methods: {
           print () {
                const modal = document.getElementById("modalInvoice")
                const cloned = modal.cloneNode(true)
                let section = document.getElementById("print")

                if (!section) {
                    section  = document.createElement("div")
                    section.id = "print"
                    document.body.appendChild(section)
                }

                section.innerHTML = "";
                section.appendChild(cloned);
                window.print();
                },	
        async handleRows(rows) {
            var result = rows.map(row => {
                row.imagePath = this.$api.getImage(row.image,0,60,'inside');
                console.log(row.imagePath);
                return row;
            });
            return result;
        },
        async refresh() {
            var model = { PenjualanId: this.id }
            var refresh = await this.$api.patch('penjualan/refresh', model);
            var result = await this.$api.get("penjualan/" + refresh.id, {scope:'detail'});
            this.model = result;
            console.log("model after refresh = ", this.model);

            this.CustomerPhone=this.model.Customer.phone;
            this.CustomerAddress = this.model.Customer.address + ', ' + this.model.Customer.city;
            this.CustomerName = this.model.Customer.name;
            if ( this.model.Customer.email!='')
                this.CustomerName = this.CustomerName + ' ( ' + this.model.Customer.email + ' )'
 
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
                        name: PenjualanDetails[i].product_name,  
                        price: PenjualanDetails[i].product_sell_price,                  
                        quantity: parseInt(PenjualanDetails[i].qty) ,                  
                        total: PenjualanDetails[i].total,                 
                    };
                    this.Items.push(item); 
                }
             }
        },
    },
    async mounted() {
        console.log("Start mount print penjualan");

        this.id=this.$route.params.id;
        await this.refresh();

        this.isReady=true;
     },    
};
</script>


<style lang="scss">
@media screen {
  #print {
    display: none;
   }
}

@media print {
 body * {
  visibility:hidden;
  }
  #print, #print * {
    visibility:visible;
  }
  #print {
    position:absolute;
    left:0;
    top:0;
  }
}
</style>
