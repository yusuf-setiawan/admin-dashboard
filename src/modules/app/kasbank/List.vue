<template>
    <div class="page-kasbank">
        <bz-topbar title="Kasbank" icon="la la-bank">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <router-link :to="$options.mutasiroute" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info mr-3">
                            Lihat Mutasi
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
    name: "kasbank-list",
    mutasiroute: "mutasikasbank",
    route: "kasbank",
    endpoint: "kasbank",
    buttons: "edit,delete",
    data() {
        return {
            title: "Kasbank",
        };
    },
    fields: [
        'name', 
        'code', 
        '>balance:decimal',
        'description:textarea', 
        {
            key:'status', 
            type:"select", 
            options:['enabled','disabled']
        }, 
        "actions"
    ],
    methods: {
        async handleRows(rows) {
            var result = rows.map(row => {
                row.imagePath = this.$api.getImage(row.image,0,60,'inside');
                console.log(row.imagePath);
                return row;
            });
            return result;
        },
        updateItems (text) {
            this.filteredItems = this.items.filter((item) => {
            return (new RegExp(text.toLowerCase())).test(item.name.toLowerCase())
            })
        },
        itemSelected (item) {
        console.log('Selected item!', item)
        },
        itemClicked (item) {
        console.log('You clicked an item!', item)
        },
        getLabel (item) {
        if (item) {
            return item.name
        }

        return ''
        },            
    }
};
</script>


<style lang="scss">
.rb-btn {
    display: flex;
    justify-content: flex-end;
}
</style>
