<template>
    <div v-show="isReady" class="page-PengirimanBarang">
        <bz-topbar title="Pengiriman Barang" icon="flaticon-truck">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <b-button v-if="status === 'pending'" type="button" @click="onSave()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">Save</b-button>
                        <b-button type="button" @click="refresh()" class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent mr-3">Refresh</b-button>
                        <b-button v-if="status === 'pending'" type="button" @click="onConfirm()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">Confirm</b-button>
                        <b-button v-if="status === 'active'" type="button" @click="onComplete()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">Complete</b-button>
                        <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                    </li>						
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
         <div class="m-portlet__body">
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-3 text-left">Tanggal Pengiriman</label>
                <span v-if="isEditMode" class="mr-5 col-sm-3 text-left">
                    <label> {{ model.FormattedDate }} </label> 
                </span>
                <flat-pickr v-else class="form-control col-sm-2" 
                    :config="{altInput:true, altFormat:'d M Y'}" 
                    v-model="model.tanggal"  />
                <label v-if="id!=''" class="text-left ml-5 mr-3 ">Status</label>
                <span v-if="id!=''" :class="statusClass">{{ status|humanize }}</span>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-3 text-left">No. Pengiriman</label>
                <span v-if="isEditMode" class="col-sm-8 text-left">
                    <label> {{ model.code }} </label> 
                </span>
                <b-form-input v-else class="col-sm-3" v-model="model.code"></b-form-input>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-3 text-left">Notes</label>
                <span v-if="isEditMode" class="col-sm-5 text-left">
                    <label> {{ model.notes }} </label> 
                </span>
                <b-form-textarea v-else class="col-sm-5" v-model="model.notes"></b-form-textarea>
            </div>

            <div class="row m-row--no-padding m-row--col-separator-xl">
                <label  class="col-sm-12 col-form-label"><strong> Item Detail</strong></label>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl col-sm-12">
                <div class="col">   
                    <bz-datatable ref="Itemdatatable" :notSearchable="true" :noPagination="true" :containerData="sendDetails" :handleRows="handleRows" :q="q" :fields="$options.SendDetailsFields" ></bz-datatable>
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    route: "user",
    endpointpenjualan: "penjualan",
    endpointParams:{scope:"detail",status:"active",sort:"-id"},
    buttons: "delete",
    sendbuttons: "select",
    Pembfields: ["id","tanggal:date","code",
    "Customer.name",">qty:decimal", ">qty_pending:decimal", ">qty_sent:decimal",">total:decimal", ">total_paid:decimal", ">total_pending:decimal",
    "status","status_payment"],
    AddItemfields: ["no",{key:"name", class:"w-25"}, 
    "price:decimal","qty:decimal","qty_pending:decimal","qty_sent:input:number","actions"],        
    SendDetailsFields:['product_id','product_name','>qty:decimal','qty_sent:input:number'],
    extends:BaseFormComponent,
    name: "penjualansend-form",
    endpoint: "penjualan-send",
    data() {
        return {
            statusClass: this.$options.filters.status_badge('pending'),
            isEditMode: false,
            errors: {},
            CustomerList: [],
            qty_sent: '',
            q:'',
            id:'',
            tanggal_penjualan:'',
            status:'pending',
            tanggal:{},
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'Penjualan': {},
                'tanggal_penjualan' : '',                
                'CustomerId':'',      
                'code':'' ,   
                'total': '0',
                'qty': '0',
                "qty_sent": '0',
                'value': '0',
                'status': 'null',
                'notes': '',
                'PenjualanSentDetails': [],
            },
            PenjualanSentDetails: {
                "id": '',
                "product_id": '',
                "qty_sent": '0',
                "PenjualanDetailId": '',
                "PenjualanSendId": ''
            },
             Items: [],
             sendDetails: [],
             query:'',
        };
    },
    methods: {
        format (value) {
            return this.$options.filters.decimal(value)
        },
        async handleRows(rows) {
             console.log("handleRows = ", rows);           
            return rows;
        },
        async onSave() {
            var isSucceed = true;
            console.log("this.sendDetails = ", this.sendDetails);     
              
            for (let i = 0; i < this.sendDetails.length; i++) {
                try {
                    var qtySend= $("input#qty_sent")[i].value; 
                    this.sendDetails[i].qty_sent=qtySend;
                    var resultDet = await this.$api.put('penjualan-send-detail/'+this.sendDetails[i].id, this.sendDetails[i], true);
                } 
                catch (error) {
                    console.log("ERR", error);
                    this.$refs.form.errors = error;
                    this.$snotify.error('Validation Error');
                    isSucceed=false;
                }
            }
            if (isSucceed)
            {
                this.$snotify.success('Data Saved');
                this.refresh();
            }
        },
        async onConfirm() {
            if (confirm("Are you sure to confirm? You can't add send item when you confirm.")) {
               try {
                    var model = { PenjualanSendId: this.id }
                    //console.log("onConfirm model = ", model);
                    var result = await this.$api.patch('penjualan-send/confirm', model);
                    //console.log("result = ", result);
                    this.status = result.status;
                    this.model.status = result.status;
                } catch (error) {
                    console.log("ERR", error);
                    this.$refs.form.errors = error;
                    this.$snotify.error('Validation Error');
                }
            }
        },
        async onComplete() {
            var model = { PenjualanSendId: this.id }
            //console.log("onComplete model = ", model);

            try {
                var result = await this.$api.patch('penjualan-send/complete', model);
                //console.log("result = ", result);

                this.$snotify.success('Data Saved');
                this.$router.push(this.$options.successRoute);
            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
       async refresh() {
            this.model = await this.$api.get("penjualan-send/" + this.id, {scope:'detail'});
            console.log("modelRefresh = ", this.model);

            var myDate = new Date(this.model.tanggal)
            this.model.FormattedDate = moment(myDate).format('DD MMM YYYY') 
            this.status = this.model.status

            var PenjualanSendDetails = this.model.PenjualanSendDetails
            this.sendDetails.length=0;
            this.sendDetails=[];
            for (let i = 0; i < PenjualanSendDetails.length; i++) {
                var retDet = {
                    no: i+1 ,
                    id: PenjualanSendDetails[i].id,
                    product_id: PenjualanSendDetails[i].product_id,
                    product_name: PenjualanSendDetails[i].PenjualanDetail.product_name,  
                    qty: PenjualanSendDetails[i].PenjualanDetail.qty,  
                    qty_sent: parseInt(PenjualanSendDetails[i].qty_sent),
                };
                this.sendDetails.push(retDet); 
            }

           this.$refs.Itemdatatable.refreshData();
  
        },          
    },
    async created() {
        console.log("Start mount sendpenjualan");

        if (this.$store.state.penjualan_id!='')
        {
            this.model.PenjualanId= this.$store.state.penjualan_id;
            this.$store.dispatch('updatePenjualanId', '');
        }
        
        //set current date
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.model.tanggal=date;

        //isEditMode
        if (this.$route.params.id) {
            this.isEditMode=true;
            this.id=this.$route.params.id;
           this.refresh();
        }
    },
    watch: {
        status: function(val) {
            this.statusClass = this.$options.filters.status_badge(val)

           if (val!='pending')
                this.$options.SendDetailsFields = ['product_id','product_name','>qty:decimal','>qty_sent:decimal']
        }, 

  },
    successRoute: '/app/penjualansend',
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
