<template>
    <div class="page-product">
        <bz-topbar title="Product" icon="flaticon-open-box">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <router-link :to="$options.kartustockroute" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">
                            Kartu Stock
                        </router-link>
                    </li>
                    <li class="m-portlet__nav-item">
                        <router-link :to="$options.route+'/new'" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">
                            <i class="la la-plus"></i>
                                    New {{title}}
                        </router-link>
                    </li>						
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
                <div class="m-portlet__body ">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col"> 
                            <!--  
                            <div class="toolbar float-right col-sm-4 mr-0">
                                <b-form-group horizontal>
                                <b-input-group>
                                    <b-form-input v-model="q" placeholder="Type to Search" />
                                    <b-input-group-append>
                                    <button :disabled="!q" @click="q = ''" class="btn btn-outline-metal active">Clear</button>
                                    </b-input-group-append>
                                </b-input-group>
                                </b-form-group>
                            </div>-->
                            <bz-datatable ref="datatable" @sort-changed="sortingChanged" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @head-clicked="onHeadClick" @button-clicked="onButtonClick" @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
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
    defaultField: {
        key:"", class:"", sortable: true
    },
    name: "product-list",
    route: "product",
    kartustockroute: "laporankartustock",
    endpoint: "product",
    buttons: "edit,delete",
    fields: [
        {key:"name", class:"w-25"}, "code",
        "imagePath:image", 
        ">stock:decimal",
        ">price:decimal",
        ">buy_price:decimal",
        "actions"
    ],
    data() {
        return {
            title: "Product",
         };
    },
    methods: {
        async handleRows(rows) {
            var result = rows.map(row => {
                row.imagePath = this.$api.getImage(row.image,0,60,'inside');
                console.log(row.imagePath);
                return row;
            });
            return result;
        },
               
    }
};
</script>


<style lang="scss">
</style>
