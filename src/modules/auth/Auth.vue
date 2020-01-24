<template>
    <div class="auth-layout">
        <router-view></router-view>
    </div>
</template>


<script>

import LoginComponent from './Login.vue';


export default {
    name: "auth-layout",
    data() {
        return {
            q: ""
        };
    },
    routes: [
        {
            path: "",
            component: LoginComponent
        }
    ]
};
</script>


<style lang="scss">
.auth-layout {
    height: 100vh;
    background-image: url('../../assets/bg.jpg')
}
</style>
