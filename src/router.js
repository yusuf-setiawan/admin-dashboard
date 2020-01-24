import Vue from 'vue'
import Router from 'vue-router'


import AuthComponent from './modules/auth/Auth.vue';
import AppComponent from './modules/app/Index.vue';

Vue.use(Router)

var router = new Router({
    routes: [
        {
            path: '/',
            name: "auth-index",
            component: AuthComponent,
            children: AuthComponent.routes
        },
        {
            path: '/app',
            name: "app-index",
            component: AppComponent,
            children: AppComponent.routes
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})


export default router;