<template>
    <div class="page-mutasikasbank">
        <bz-topbar title="Mutasi KasBank" icon="flaticon-piggy-bank">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                        <b-button type="button" @click="onSubmit()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">Submit</b-button>
                    </li>						
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
                <div class="m-portlet__body ">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-form ref="form" v-if="isReady" @onSubmit="onSubmit" :fields="$options.fields" :model="model"></bz-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--End::Section-->
</template>
<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    extends:BaseFormComponent,
    name: "mutasikasbank-form",
    endpoint: "mutasi-kasbank",
    fields: ["KasBankId:select:kasbank:id:name" ,
    "trx_date:date", 
    {
        key:'type', 
        type:"select", 
        options:['in','out']
    },
    "value:number", "notes:textarea" ],
    successRoute: '/app/mutasikasbank',
    async created() {
        console.log("Start mount mutasikasbank");            

        if (this.$store.state.mutasi_id!='')
        {
            this.model.KasBankId= this.$store.state.mutasi_id;
            this.model.trx_date= new Date();
            this.$store.dispatch('updateMutasiId', '');
        }
    },
};
</script>


<style lang="scss">
</style>

