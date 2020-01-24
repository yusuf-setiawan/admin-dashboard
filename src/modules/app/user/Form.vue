<template>
    <div class="page-user">
        <bz-topbar title="User" icon="fa fa-user">
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
</template>


<script>
import Vue from 'vue';
import BaseFormComponent from '../base/Form.vue'

export default {
    extends: BaseFormComponent,
    name: "user-form",
    endpoint: "user",
    fields: [
        'username', 
        'email:email', 
        'password:password', 
        'verify_password:password', 
        {
            key:'role', 
            type:"select", 
            options:['admin', 'superadmin']
        }, 
        {
            key:'status', 
            type:"select", 
            options:['inactive', 'active', 'banned', 'suspended']
        }, 
    ],
    successRoute: '/app/user',

    methods: {
        async filterModelBeforePost(model) {
            if (!model.password) delete model.password;
            if (!model.verify_password) delete model.verify_password;
            return model;
        },
    }
};
</script>


<style lang="scss">
</style>
