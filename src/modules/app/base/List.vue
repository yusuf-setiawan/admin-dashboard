<template>
    <div class="user-index">
        <!-- BEGIN: Subheader -->
        <div class="m-subheader ">
            <div class="d-flex align-items-center">
                <div class="mr-auto">
                    <h3 class="m-subheader__title ">{{title}}</h3>
                </div>
            </div>
        </div>
        <!-- END: Subheader -->


        <div class="m-content">

            <!--Begin::Section-->
            <div class="m-portlet">
                <div class="m-portlet__body  m-portlet__body--no-padding">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <div class="toolbar mb-3">
                                <b-button-toolbar justify key-nav  aria-label="Toolbar with button groups">
                                    <b-button-group size="sm" class="mr-1">
                                        <b-btn :to="$options.route+'/new'"><fa name="plus"/> New </b-btn>
                                    </b-button-group>
                                    <b-input-group  size="sm" class="mx-1">
                                        <b-form-input v-model="q" class="text-right"></b-form-input>
                                        <b-input-group-append>
                                            <b-btn variant="outline-secondary"><fa name="search"/></b-btn>
                                        </b-input-group-append>
                                    </b-input-group>
                                </b-button-toolbar>
                            </div>
                            <bz-datatable ref="datatable" :q="q" @button-clicked="onButtonClick"  @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint"></bz-datatable>
                        </div>
                    </div>
                </div>
            </div>
            <!--End::Section-->

        </div>
    </div>
</template>


<script>

export default {
    name: "user-list",
    route: "user",
    endpoint: "users",
    endpointParams: {},
    buttons: "edit,delete",
    fields: ["id", {key:"username", class:"w-25"}, "email"],
    data() {
        return {
            title: "User",
            rows: [],
            currentPage: 1,
            itemPerPage: 10,
            totalItem: 0,
            q:''
        };
    },
    methods: {
        async handleRows(rows) {
            return rows;
        },
        async onRowClick(item, index, event) {
            this.$router.push(this.$options.route+'/edit/'+item.id);
        },
        async onButtonClick(item, index, event) {
            if (event == "edit") {
                this.$router.push(this.$options.route+'/edit/'+item.id);
            }
            else if (event == "delete") {
                if (confirm("Are you sure want to delete this item?")) {
                    this.$api.delete(this.$options.endpoint+'/'+item.id)
                    .then((data)=> {
                        this.$snotify.success('Data Deleted!');
                        this.$refs.datatable.refreshData();
                    })
                    .catch((err)=> {
                        this.$snotify.error('Data deletion error!', err.toString());
                    })
                }
            }
        }
    },
    async mounted() {},
};
</script>


<style lang="scss">
</style>
