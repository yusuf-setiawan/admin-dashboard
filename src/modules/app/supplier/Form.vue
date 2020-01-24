<template>
    <div class="page-supplier">
        <bz-topbar title="Supplier" icon="socicon-stayfriends">
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
    name: "supplier-form",
    endpoint: "supplier",
    fields: [{key:"name", class:"w-25"}, 
    {key:"code", class:"w-25"},
    "address:textarea", 
    "city","country","province",
        "email:email", 
        "phone:number",
        {
            key:'gender', 
            type:"select", 
            options:['male','female']
        },        
        "notes:textarea", 
    ],
    successRoute: '/app/supplier',
};
</script>


<style lang="scss">
</style>
