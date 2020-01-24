
<script>

import BaseIndexComponent from "../base/Index.vue"
import FormComponent from "./Form.vue"
import ListComponent from "./List.vue"
import ViewComponent from "./View.vue"
import PrintComponent from "./Invoice.vue"

export default {
    extends: BaseIndexComponent,
    name: "penjualan-index",
    routes: [
        {
            path: "", component: ListComponent
        },
        {
            path: "new/:id", component: FormComponent
        },
        {
            path: "edit/:id", component: FormComponent
        },
        {
            path: "view/:id", component: ViewComponent
        },    
        {
            path: "print/:id", component: PrintComponent
        } 
    ]
};
</script>


<style lang="scss">
</style>
