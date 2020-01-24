<template>
    <div class="user-index">
        <router-view></router-view>
    </div>
</template>


<script>

import FormComponent from "./Form.vue"
import ListComponent from "./List.vue"

export default {
    name: "user-index",
    routes: [
        {
            path: "", component: ListComponent
        },
        {
            path: "new", component: FormComponent
        },
        {
            path: "edit/:id", component: FormComponent
        }
    ]
};
</script>


<style lang="scss">
</style>
