<template>
    <div class="user-index">

        <div class="m-content">

            <!--Begin::Section-->
            <div class="m-portlet">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <span class="m-portlet__head-icon">
                                <i class="flaticon-layers"></i>
                            </span>
                            <h3 class="m-portlet__head-text">
                                Account
                            </h3>
                        </div>			
                    </div>
                    <div class="m-portlet__head-tools">
                        <ul class="m-portlet__nav">
                            <li class="m-portlet__nav-item">
                                <router-link :to="$options.route+'/new'" class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air">
                                    <span>
                                        <i class="la la-cart-plus"></i>
                                        <span>New Account</span>
                                    </span>
                                </router-link>
                                <!-- <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon"><i class="la la-cloud-upload"></i></a>	 -->
                            </li>			
                        </ul>
                    </div>
                </div>
                <div class="m-portlet__body ">
               
               
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                            <vue-bootstrap-typeahead
                    class="mb-4"
                    v-model="query"
                    :data="users"
                    :serializer="item => item.login"
                    placeholder="Search GitHub Users"
                    prepend="nama:"
                    @hit="searchRepositories"
                >

                <!-- Append a button -->
                <template slot="append">
                <button @click="searchRepositories" class="btn btn-primary">
                Search
                </button>
                </template>

                <!-- Begin custom suggestion slot -->
                <template slot="suggestion" slot-scope="{ data, htmlText }">
                <div class="d-flex align-items-center">
                    <img
                    class="rounded-circle"
                    :src="data.avatar_url"
                    style="width: 40px; height: 40px;" />

                    <!-- Note: the v-html binding is used, as htmlText contains
                        the suggestion text highlighted with <strong> tags -->
                <span class="ml-4" v-html=data.id></span>
                    <span class="ml-4" v-html="htmlText"></span>
                    <i class="ml-auto fab fa-github-square fa-2x"></i> 
                </div>
                </template>
                </vue-bootstrap-typeahead>

                <h3>Search Users Repositories</h3>
                {{ userRepositories  }}

</div>

                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-datatable ref="datatable" :endpointParams="$options.endpointParams" :handleRows="handleRows" :q="q" @button-clicked="onButtonClick" @row-clicked="onRowClick" :fields="$options.fields" :buttons="$options.buttons" :endpoint="$options.endpoint" ></bz-datatable>
                        </div>
                    </div>
                </div>
            </div>
            <!--End::Section-->

        </div>

        
    </div>
</template>


<script>

import BaseListComponent from "../base/List.vue"
export default {
    extends: BaseListComponent,
    name: "account-list",
    route: "account",
    endpoint: "account",
    buttons: "edit,delete",
    fields: [ 
    "name","unit","category",
    "actions"],
       data() {
        return {
            query: '',
            userRepositories: '',
            users: [],
            allData:[{ id: "1", name: "buku", buy_price: "12500" },
            { id: "2", name: "paper", price: "3000" },
            { id: "3", name: "calculator", price: "75000" }
            ]
        }
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
    searchUsers(newQuery) {
          console.log(newQuery)
          this.users = this.allData.filter(obj => Object.values(obj).some(val => val.includes(newQuery)));
    },
    searchRepositories() {
      this.userRepositories = this.query;
    },
    
   },
    mounted() {
              //this.allData=this.trialItem();
                        console.log("allData = ", this.allData)
    },
  watch() {
    // When the query value changes, fetch new results from
    // the API - debounce the search to avoid hitting the API limits
    query: _.debounce(function(newQuery) { this.searchUsers(newQuery) }, 250)
  },
  filters: {
    stringify(value) {
      return JSON.stringify(value, null, 2)
    }
  },

};
</script>


<style lang="scss">
</style>
