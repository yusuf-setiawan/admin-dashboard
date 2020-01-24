<template>
    <div class="page-user">
        <bz-topbar title="User" icon="fa fa-user">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <router-link :to="$options.profileroute" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">
                            Change Password
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
    profileroute: "profile",
    name: "user-list",
    route: "user",
    endpoint: "user",
    fields: ["id", {key:"username", class:"w-25"}, "email", "role", "status"],
    data() {
        return {
            title: "User",
         };
    },
    methods: {
        async onRowClick(item, index, event) {
            this.$router.push(this.$options.route+'/edit/'+item.id);
        },
    },
};
</script>


<style lang="scss">
</style>
