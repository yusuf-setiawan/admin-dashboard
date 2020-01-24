<template>
    <div class="page-product">
        <bz-topbar title="Product" icon="flaticon-open-box">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <b-button type="button" @click="toKartuStock()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-5">Kartu Stock</b-button>
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
    name: "product-form",
    endpoint: "product",
    fields: [{key:"name", class:"w-25"}, "code",
    "category:select:category:id:name",
    "description:textarea",
    {
        key:'status', 
        type:"select", 
        options:['enabled','disabled']
    },
        "image:image", 
        "price:number","buy_price:number"],

    successRoute: '/app/product',
    kartuStockRoute: '/app/laporankartustock',
    methods: {
        async toKartuStock() {
            this.$store.dispatch('updateProductId', this.model.id);
            this.$router.push(this.$options.kartuStockRoute);
        },
    },
};
</script>


<style lang="scss">
</style>
