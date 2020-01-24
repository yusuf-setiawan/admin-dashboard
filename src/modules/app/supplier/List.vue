<template>
    <div class="page-supplier">
        <bz-topbar title="Supplier" icon="socicon-stayfriends">
            <template slot="tools">
                <ul class="m-portlet__nav">
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
                            <bz-datatable ref="datatable" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @button-clicked="onButtonClick" @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
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
    name: "supplier-list",
    route: "supplier",
    endpoint: "supplier",
    buttons: "edit,delete",
    fields: [{key:"name", class:"w-25"}, 
    {key:"code", class:"w-25"},
    "address", "email", "phone","actions"],
    data() {
        return {
            title: "Supplier",
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
