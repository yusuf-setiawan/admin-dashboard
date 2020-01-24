<template>
    <div class="page-mutasikasbank">
        <bz-topbar title="Mutasi KasBank" icon="flaticon-piggy-bank">
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
                            <bz-datatable ref="datatable" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @button-clicked="onButtonClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
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
    name: "mutasikasbank-list",
    route: "mutasikasbank",
    endpointParams:{scope:"detail",sort:"-id"},
    endpoint: "mutasi-kasbank",
    buttons: "edit,delete",
    fields: ["KasBank.name", "trx_date:date", "type", ">value:decimal", "notes"],
        data() {
        return {
            title: "Mutasi KasBank",
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
