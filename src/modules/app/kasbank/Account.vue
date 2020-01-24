<template>
    <!--Begin::Section-->
    <div class="m-portlet">
        <div class="m-portlet__head">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <span class="m-portlet__head-icon">
                        <i class="flaticon-layers"></i>
                    </span>
                    <h3 class="m-portlet__head-text">
                        Create Account
                    </h3>
                </div>			
            </div>
        </div>
        <div class="m-portlet__body ">
            <div class="row m-row--no-padding m-row--col-separator-xl">
                <div class="col">   
                    <bz-form ref="form" v-if="isReady" @onSubmit="onSubmit" :fields="$options.fields" :model="model"></bz-form>
                </div>
            </div>
        </div>

        <div class="m-portlet__foot">
            <div class="row align-items-center text-left">
                <div class="col-lg-12">
                    <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                    <b-button type="button" @click="onSubmit()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">Submit</b-button>
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
    name: "account-form",
    endpoint: "account",
    fields: [ 
    "name","unit","category"
    ],
    successRoute: '/app/kasbank',
};
</script>


<style lang="scss">
</style>
