<template>
    <div class="app-layout">
         <!-- Sidebar -->
        <b-nav vertical id="sidebar" class="text-left">
            <b-nav-item class="title" to="/app">
                <h3> VOUCHER </h3>
            </b-nav-item>
            <template v-for="(item, index) in menu" >

                <template  v-if="item.type=='group'">
                    <b-nav-item class="group"  :key="item.label"  
                        v-b-toggle="'sub-'+index"
                    >
                        <span class="icon"><fa :name="item.icon"/></span> 
                        {{item.label}}
                        <span class="closecaret" style="float:right">
                            <fa name="caret-right"/>
                        </span>
                        <span class="opencaret" style="float:right">
                            <fa name="caret-down"/>
                        </span>
                    </b-nav-item>
                    
                    <b-collapse visible class="submenu" :id="'sub-'+index" :key="'sub'+item.label">
                        <b-nav-item v-for="submenu in item.items" :key="submenu.label" :to="submenu.to">
                            <span class="icon"><fa :name="submenu.icon"/></span> 
                            {{submenu.label}}
                        </b-nav-item>
                    </b-collapse>

                </template>
                <b-nav-item v-else :key="item.label" :to="item.to">
                    <span class="icon"><fa :name="item.icon"/></span> 
                    {{item.label}}
                </b-nav-item>
            </template>
            
        </b-nav>

        <!-- Page Content -->
        <div id="content" class="text-left pt-3">
            <b-container fluid>
                <router-view></router-view>
            </b-container>
        </div>
        
    </div>
</template>


<script>
import DashboardComponent from "./Dashboard.vue"
import UserComponent from "./user/Index.vue"
import SettingComponent from "./setting/Index.vue"
import CategoryComponent from "./category/Index.vue"
import TenantComponent from "./tenant/Index.vue"
import VoucherComponent from "./voucher/Index.vue"

export default {
    name: "app-layout",
    data() {
        return {
            menu : [
                {label: "User", icon: "user", to: "/app/user"},
                // {label: "Customer", icon: "users", to: "/app/customer"},
                {label: "Category", icon: "tag", to: "/app/category"},
                // {label: "Project", icon: "briefcase", to: "/app/project"},
                {label: "Setting", icon: "cog", to: "/app/setting"},
                {label: "Tenant", icon: "home", to: "/app/tenant"},
                {label: "Voucher", icon: "sale", to: "/app/voucher"},
                // {
                //     label: "Pegawai", icon: "user", type:'group', 
                //     items: [
                //         {label: "List", icon: "user", to: "/app/pegawai"},
                //         {label: "Jabatan", icon: "users", to: "/app/jabatan"},
                //     ]
                // },
            ]
        };
    },
    routes: [
        {
            path: "",
            component: DashboardComponent
        },
        {
            path: "user",
            component: UserComponent,
            children: UserComponent.routes
        },
        {
            path: "category",
            component: CategoryComponent,
            children: CategoryComponent.routes
        },
        {
            path: "tenant",
            component: TenantComponent,
            children: TenantComponent.routes
        },
        {
            path: "setting",
            component: SettingComponent,
            children: SettingComponent.routes
        },
        {
            path: "voucher",
            component: VoucherComponent,
            children: VoucherComponent.routes
        },

    ]
};
</script>


<style lang="scss">
    .app-layout {
        display: flex;
        width: 100%;
        align-items: stretch;
    }
    
    #sidebar {
        padding-top: 1rem;
        min-width: 250px;
        max-width: 250px;
        min-height: 100vh;
        background: #362152;

        
        .nav-item {
            .nav-link {
                color: #ddd;
                .icon {
                    margin-right: 5px;
                    min-width: 20px;
                }
            }

            .nav-link.active,
            .nav-link:hover {
                color: #fff;
                background-color: rgba(255,255,255,0.25);
            }
        }
        .nav-item.title{
            margin-bottom: 1rem;
            .nav-link.active,
            .nav-link:hover {
                background-color: inherit;
            }
        }

        .nav-item.group{
            .opencaret {
                display:inline-block;
            }
            .closecaret {
                display:none;
            }
        }
        
        .nav-item.group.collapsed{
            .opencaret {
                display:none;
            }
            .closecaret {
                display:inline-block;
            }
        }

        .dropdown-toggle::after {
            display: block;
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
        }
    }

    #sidebar.active {
        margin-left: -250px;
    }

    #content {
        width: 100%;
    }

    .submenu a {
        padding-left: 2.5rem;
    }

</style>

