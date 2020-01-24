<template>
    <div class="page-customer">
        <bz-topbar title="Customer" icon="socicon-odnoklassniki">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
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
                                            <bz-vuegoogleautocomplete
                    id="map"
                    ref="address"
                    classname="input"
                    placeholder="Start typing"
                    v-on:placechanged="getAddressData"
                    v-on:error="handleError"
                    country="sg"
                >
                </bz-vuegoogleautocomplete>
                        </div>
                    </div>
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
    name: "customer-form",
    endpoint: "customer",
    fields: [{key:"name", class:"w-25"}, 
    {key:"code", class:"w-25"},
        "address:textarea", 
        "city","country","province",
        "email:email", 
        "phone:number",
        {
            key:'gender', 
            type:"select", 
            options:['male','female']
        },
        "notes:textarea", 
],
  data() {
            return {
                /**
                 * The Autocomplete object.
                 *
                 * @type {Autocomplete}
                 * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
                 */
                autocomplete: null,
        address: ''
        }
  },
      methods: {
        /**
        * When the location found
        * @param {Object} addressData Data of the found location
        * @param {Object} placeResultData PlaceResult object
        * @param {String} id Input container ID
        */
      getAddressData(addressData, placeResultData, id) {
            this.address = addressData;
      },

      handleError(error) {
        alert(error)
      }
    },
    successRoute: '/app/customer',
};
</script>


<style lang="scss">
</style>
