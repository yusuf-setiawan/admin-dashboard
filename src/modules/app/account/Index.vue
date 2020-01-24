
<script>

import BaseIndexComponent from "../base/Index.vue"
import FormComponent from "./Form.vue"
import ListComponent from "./List.vue"

export default {
    extends: BaseIndexComponent,
    name: "account-index",
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
