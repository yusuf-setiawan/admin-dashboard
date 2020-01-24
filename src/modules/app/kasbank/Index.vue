
<script>

import BaseIndexComponent from "../base/Index.vue"
import FormComponent from "./Form.vue"
import ListComponent from "./List.vue"
import LedgerComponent from "./Ledger.vue"
import AccountComponent from "./Account.vue"

export default {
    extends: BaseIndexComponent,
    name: "kasbank-index",
    routes: [
        {
            path: "", component: ListComponent
        },
        {
            path: "new", component: FormComponent
        },
        {
            path: "ledger", component: LedgerComponent
        },
        {
            path: "account", component: AccountComponent
        },        
        {
            path: "edit/:id", component: FormComponent
        }
    ]
};
</script>


<style lang="scss">
</style>
