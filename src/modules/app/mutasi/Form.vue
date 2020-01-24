<template>
    <div class="page-mutasi">
        <bz-topbar title="Mutasi Stock" icon="fa fa-balance-scale">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                        <b-button type="button" v-if="!isViewMode" @click="onSubmit()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">Submit</b-button>
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
    route: "mutasi-manual",
    endpointProduct: "product",
    buttons: "edit",
    fields: [
       "trx_date:date", "notes", 
        {
            key:'type', 
            type:"select", 
            options:['in','out']
        }, 
        "value:number", 
        "ProductId:select:product:id:name",
    ],
    extends:BaseFormComponent,
    name: "mutasi-form",
    endpoint: "mutasi-manual",
    data() {
        return {
            formType: {},
            isReady: false,
            errors: {},
            fieldList: [],
            ProductList: [],
            q:'',
            ProductId:{},
            trxDate:{},
            number: 'number',
            model: {
                'trx_date' : '',
                'notes': '',
                'type': '',
                'value': '',
                'ProductId':0
            },
        };
    },
     computed:  {
        isViewMode: function() {
            return this.$route.params.id?true:false;
        },
        mode: function() {
            return this.$route.params.id?'view':'create';
        }
    },
    successRoute: '/app/mutasi',
};
</script>


<style lang="scss">
.modal-lg {
        max-width: 900px;
}
</style>
