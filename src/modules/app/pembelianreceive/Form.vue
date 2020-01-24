<template>
    <div class="page-pembelianreceive">
        <bz-topbar title="Penerimaan Barang" icon="fa fa-truck-loading">
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
                <label class="col-sm-2 text-left">Tanggal Receive</label>
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
                <label class="col-sm-2 text-left">No. Receive</label>
                <span v-if="isEditMode" class="col-sm-8 text-left">
                    <label> {{ model.code }} </label> 
                </span>
                <b-form-input v-else class="col-sm-3" v-model="model.code"></b-form-input>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                <label class="col-sm-2 text-left">Notes</label>
                <span v-if="isEditMode" class="col-sm-5 text-left">
                    <label> {{ model.notes }} </label> 
                </span>
                <b-form-textarea v-else class="col-sm-5" v-model="model.notes"></b-form-textarea>
            </div>
        </div>
            <div class="row m-row--no-padding m-row--col-separator-xl">
                <label  class="col-sm-12 col-form-label"><strong> Item Detail</strong></label>
            </div>
            <div class="row m-row--no-padding m-row--col-separator-xl col-sm-12">
                <div class="col">   
                    <bz-datatable ref="Itemdatatable" :notSearchable="true" :noPagination="true" :containerData="receiveDetails" :handleRows="handleRows" :q="q" :fields="$options.receiveDetailsFields" ></bz-datatable>
                 </div>
            </div>
        </div>
    </div>
    </div>
</template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    route: "pembelianreceive",
    endpointPembelian: "pembelian",
    endpointParams:{scope:"detail",status:"active",sort:"-id"},
    buttons: "delete",
    receivebuttons: "select",
    Pembfields: ["id","tanggal:date","code",
    "Supplier.name",">qty:decimal", ">qty_pending:decimal", ">qty_sent:decimal",">total:decimal", ">total_paid:decimal", ">total_pending:decimal",
    "status","status_payment"],
    AddItemfields: ["no","name", 
    "price:decimal","qty:decimal","qty_pending:decimal","qty_received:input:number","actions"],        
    receiveDetailsFields:['product_id','product_name','>qty:decimal','qty_received:input:number'],
    extends:BaseFormComponent,
    name: "pembelianreceive-form",
    endpoint: "pembelian-receive",
    data() {
        return {
            statusClass: this.$options.filters.status_badge('pending'),
            errors: {},
            isEditMode: false,
            isReady:false,
            isLocked: false,
            qty_received: '',
            q:'',
            id:'',
            tanggal_pembelian:'',
            status:'pending',
            tanggal:{},
            number: 'number',
            model: {
                'id' : '',
                'tanggal' : '',
                'FormattedDate' : '',
                'Pembelian': {},
                'tanggal_pembelian' : '',                
                'PembelianId':'',  
                'SupplierId':'',      
                'code':'' ,   
                'code_pembelian':'' ,   
                'total': '0',
                'qty_receivened': '0',
                'status': 'pending',
                'notes': '',
                'PembelianReceiveDetails': [],
            },
            Items: [],
            receiveDetails: [],
            query:'',
     
        };
    },
    methods: {
        format (value, event) {
            return this.$options.filters.decimal(value)
        },
        async handleRows(rows) {
             console.log("handleRows = ", rows);           
            return rows;
        },
        async onSave() {
            var isSucceed = true;
            console.log("this.receiveDetails = ", this.receiveDetails);     
              
            for (let i = 0; i < this.receiveDetails.length; i++) {
                try {
                    var qtyreceive = $("input#qty_received")[i].value; 
                    this.receiveDetails[i].qty_received=qtyreceive;
                    var resultDet = await this.$api.put('pembelian-receive-detail/'+this.receiveDetails[i].id, this.receiveDetails[i], true);
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
            if (confirm("Are you sure to confirm? You can't add receive item when you confirm.")) {
               try {
                    var model = { PembelianReceiveId: this.id }
                    //console.log("onConfirm model = ", model);
                    var result = await this.$api.patch('pembelian-receive/confirm', model);
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
            var model = { PembelianReceiveId: this.id }
            //console.log("onComplete model = ", model);

            try {
                var result = await this.$api.patch('pembelian-receive/complete', model);
               // console.log("result = ", result);

                this.$snotify.success('Data Saved');
                this.$router.push(this.$options.successRoute);
            } catch (error) {
                console.log("ERR", error);
                this.$refs.form.errors = error;
                this.$snotify.error('Validation Error');
            }
        },
        async refresh() {
            this.model = await this.$api.get("pembelian-receive/" + this.id, {scope:'detail'});
            //console.log("modelRefresh = ", this.model);

            var myDate = new Date(this.model.tanggal)
            this.model.FormattedDate = moment(myDate).format('DD MMM YYYY') 
            this.status = this.model.status
 
            var PembelianReceiveDetails = this.model.PembelianReceiveDetails
            this.receiveDetails.length=0;
            this.receiveDetails=[];
            for (let i = 0; i < PembelianReceiveDetails.length; i++) {
                var retDet = {
                    no: i+1 ,
                    id: PembelianReceiveDetails[i].id,
                    product_id: PembelianReceiveDetails[i].product_id,
                    product_name: PembelianReceiveDetails[i].PembelianDetail.product_name,  
                    qty_received: parseInt(PembelianReceiveDetails[i].qty_received),
                    qty: PembelianReceiveDetails[i].PembelianDetail.qty,  
                };
                this.receiveDetails.push(retDet); 
            }

            this.$refs.Itemdatatable.refreshData();
        },              
    },
    async created() {
        console.log("Start mount receivepembelian");
        if (this.$store.state.pembelian_id!='')
        {
            this.model.PembelianId= this.$store.state.pembelian_id;
            this.$store.dispatch('updatePembelianId', '');
        }

        //set current date
        this.model.tanggal=new Date();
 
        //isEditMode
        if (this.$route.params.id) {
            this.isEditMode=true;
            this.id=this.$route.params.id;
             await this.refresh();
        }
        this.isReady=true;
    },
    watch: {
        status: function(val) {
            this.statusClass = this.$options.filters.status_badge(val)
            if (val!='pending')
                this.$options.receiveDetailsFields = ['product_id','product_name','>qty:decimal','>qty_received:decimal']
    }, 
   },
    successRoute: '/app/pembelianreceive',
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
