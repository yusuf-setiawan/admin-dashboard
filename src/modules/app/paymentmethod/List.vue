<template>
            <!--Begin::Section-->
            <div class="m-portlet">
                    <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <span class="m-portlet__head-icon">
                                <i class="m-menu__link-icon fa fa-money-check-alt"></i>
                            </span>
                            <h3 class="m-portlet__head-text">
                                {{mode|humanize}} payment-method
                            </h3>
                        </div>			
                    </div>
                    <div class="m-portlet__head-tools">
                        <ul class="m-portlet__nav">
                            <li class="m-portlet__nav-item">
                                <router-link :to="$options.route+'/new'" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">
                                    <i class="la la-plus"></i>
                                            New {{title}}
                                </router-link>
                                <!-- <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon"><i class="la la-cloud-upload"></i></a>	 -->
                            </li>						
                        </ul>
                    </div>                    
                </div>  
                <div class="m-portlet__body ">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-datatable ref="datatable" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @button-clicked="onButtonClick" @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
                        </div>
                    </div>                    
                </div>
            </div>
            <!--End::Section-->
</template>


<script>

import BaseListComponent from "../base/List.vue"
export default {
    extends: BaseListComponent,
    name: "paymentmethod-list",
    route: "paymentmethod",
    endpoint: "payment-method",
    buttons: "edit,delete",
    data() {
        return {
            title: "Payment method",
         };
    },
        fields: [
       {key:"name", class:"w-25"}, "description",
        "status", 
        "imagePath:image", 
        "actions"
         ],
    mounted() {
            this.setTitle(this.title, 'm-menu__link-icon fa fa-money-check-alt');
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
        setTitle(title, icon) {
                this.$store.dispatch('updateTitle', title);
                this.$store.dispatch('updateTitleIcon', icon);
            }
        }
};
</script>


<style lang="scss">
</style>
