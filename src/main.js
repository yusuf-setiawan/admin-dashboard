import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import './app.scss'

Vue.use(require('vue-moment'));

// BEGIN VUE BOOSTRAP
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
// import 'bootstrap/scss/bootstrap.scss'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// END VUE BOOSTRAP


// BEGIN LOAD BZAPI
import BzApi from "./plugins/BzApi";
Vue.use(BzApi);
// END BZAPI

// BEGIN LOAD BZFILTER
import BzFilters from "./plugins/BzFilters";
Vue.use(BzFilters);
// END BZAPI

// BEGIN VUE AWESOME
// import 'vue-awesome/icons'
// import Icon from 'vue-awesome/components/Icon'
// Vue.component('fa', Icon)
// END VUE AWESOME


// Begin: Vue Multiselect
import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect);
// End: Vue Multiselect

// // BEGIN UIV COMPONENTS
// import { Typeahead } from 'uiv'
// Vue.component('typeahead', Typeahead);

// // END UIV COMPONENTS


// BEGIN SNOTIFY
import Snotify, { SnotifyPosition } from 'vue-snotify'; // 1. Import Snotify
Vue.use(Snotify, {
        toast: {
            position: SnotifyPosition.rightBottom
        }
    })
    // END SNOTIFY
import BzDataTable from '@/components/DataTable.vue';
Vue.component('bz-datatable', BzDataTable);
import BzForm from '@/components/BzForm.vue';
Vue.component('bz-form', BzForm);
import BzTopBar from '@/components/TopBar.vue';
Vue.component('bz-topbar', BzTopBar);
import BzPortlet from '@/components/Portlet.vue';
Vue.component('bz-portlet', BzPortlet);

import VueGoogleAutocomplete from '@/components/VueGoogleAutocomplete.vue';
Vue.component('bz-vuegoogleautocomplete', VueGoogleAutocomplete);

import Spinner from '@/components/Spinner.vue';
Vue.component('Spinner', Spinner);

Vue.config.productionTip = false

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';
Vue.use(flatPickr);

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

// Global registration
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

//import Autocomplete from 'v-autocomplete'
//import 'v-autocomplete/dist/v-autocomplete.css'

//Vue.use(Autocomplete)

async function redirectIfNotAuth(to, from, next) {
    if (to.path == from.path) next();
    const user = await getLoginState()


    //for try
    /*var user = {
        token: "sdfdsfdsfdsYTGUJYTUYT575676",
        user_id: 1,
        user_name: "joe",
        user_email: "joe@gmail.co",
        user_username: "joe",
    }*/

    console.log("redirectifnoaouth", user);
    if (!user) {
        if (to.path == '/')
            next();
        else next('/');
    } else
    if (to.path == '/') {
        next('/app');
    } else {
        next();
    }
}

function getLoginState() {
    console.log("getLoginState");
    return new Promise((resolve, reject) => {
        if (store.state.token === undefined) {
            const unwatch = store.watch(
                () => store.state.token,
                (value) => {
                    unwatch()
                    resolve(value)
                }
            )
        } else {
            resolve(store.state.token)
        }
    })
}


router.beforeEach((to, from, next) => {
    console.log("before each router", to, from);
    redirectIfNotAuth(to, from, next);
})

store.dispatch('initApp').then(() => {
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
});