<template>
<div class="m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--fixed m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default">

        <!-- begin:: Page -->
        <div class="m-grid m-grid--hor m-grid--root m-page">

			<!-- BEGIN: Header -->
			<!-- END: Header -->

            <!-- begin::Body -->
        <a @click="isSideMenuOpen=true" id="close_menu_btn" class="btn btn-brand m-btn m-btn--icon btn-sm m-btn--icon-only  m-btn--pill m-btn--air">
            <i class="fa flaticon-more"></i>
        </a> 
        <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

            <!-- BEGIN: Left Aside -->
            <div id="m_aside_left" class="m-grid__item	m-aside-left  m-aside-left--skin-dark " :class="{'m-aside-left--on':isSideMenuOpen}">
                <!-- BEGIN: Aside Menu -->
                <button  @click="isSideMenuOpen=false" class="m-aside-left-close  m-aside-left-close--skin-dark " id="m_aside_left_close_btn"><i class="la la-close"></i></button>
                <div id="m_ver_menu" class="m-aside-menu m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark m-scrollable m-scroller" style="position: relative; overflow: hidden; height:100vh;">
                    <ul class="m-menu__nav  m-menu__nav--dropdown-submenu-arrow ">                       
                        <!-- Master -->

                         <li class="m-menu__section ">
                            <div class="m-stack m-stack--ver m-stack--general">
                                <div class="m-stack__item m-stack__item--middle m-brand__logo">
                                    <a href="#/app" class="m-brand__logo-wrapper"><img alt="" src="assets/demo/default/media/img/logo/logo_default_dark.png"></a>
                                </div>
                                <div class="m-stack__item m-stack__item--middle m-brand__tools">
                                    <a id="m_aside_left_minimize_toggle" class="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block  ">
                                        <span></span>
                                    </a>
                                    <a id="m_aside_left_offcanvas_toggle" class="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block"><span></span></a>
                                    <a id="m_aside_header_menu_mobile_toggle" href="javascript:;" class="m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block"><span></span></a>
                                    <a id="m_aside_header_topbar_mobile_toggle" href="javascript:;" class="m-brand__icon m--visible-tablet-and-mobile-inline-block"><i class="flaticon-more"></i></a>
                                </div>
                            </div>
                        </li>

                        <li class="m-menu__section ">
                            <h4 class="m-menu__section-text">Master</h4>
                            <i class="m-menu__section-icon flaticon-more-v2"></i>
                        </li>

                        <template v-for="(item, index) in menu" >

                            <router-link tag="li" @click="isSideMenuOpen=false" :to="item.to" :key="item.label" class="m-menu__item  m-menu__item--submenu" aria-haspopup="true" m-menu-submenu-toggle="hover">
                                <a v-if="item.visible===true" class="m-menu__link">
                                    <i :class="item.icon"/>
                                    <span class="m-menu__link-title">
                                            <span class="m-menu__link-wrap">
                                                <span class="m-menu__link-text">{{item.label}}</span>
                                            </span>
                                    </span>
                                </a>
                            </router-link>

                        </template>

                        <!-- Transaksi -->

                        <li class="m-menu__section ">
                            <h4 class="m-menu__section-text">Transaksi</h4>
                            <i class="m-menu__section-icon flaticon-more-v2"></i>
                        </li>

                        <template v-for="(item, index) in transaksiMenu" >
                            <router-link tag="li" :to="item.to" :key="item.label" class="m-menu__item  m-menu__item--submenu" aria-haspopup="true" m-menu-submenu-toggle="hover">
                                <a  class="m-menu__link">
                                    <i :class="item.icon"/>
                                    <span class="m-menu__link-title">
                                            <span class="m-menu__link-wrap">
                                                <span class="m-menu__link-text">{{item.label}}</span>
                                            </span>
                                    </span>
                                </a>
                            </router-link>
                        </template>                        

                        <li class="m-menu__section ">
                            <h4 class="m-menu__section-text">Laporan</h4>
                            <i class="m-menu__section-icon flaticon-more-v2"></i>
                        </li>

                        <template v-for="(item, index) in ReportMenu" >
                            <router-link tag="li" :to="item.to" :key="item.label" class="m-menu__item  m-menu__item--submenu" aria-haspopup="true" m-menu-submenu-toggle="hover">
                                <a  class="m-menu__link">
                                    <i :class="item.icon"/>
                                    <span class="m-menu__link-title">
                                            <span class="m-menu__link-wrap">
                                                <span class="m-menu__link-text">{{item.label}}</span>
                                            </span>
                                    </span>
                                </a>
                            </router-link>
                        </template>  

                        <li class="m-menu__item  m-menu__item--submenu mt-3 " aria-haspopup="true" m-menu-submenu-toggle="hover">
                            <a @click="logout()" class="m-menu__link">
                                <i class="m-menu__link-icon flaticon-open-box"></i>
                                <span class="m-menu__link-title">
                                    <span class="m-menu__link-wrap">
                                        <span class="m-menu__link-text m-menu__section-text" style="color: darkred;">Logout</span>
                                    </span>
                                </span>
                            </a>
                        </li>

                      

                    </ul>
                    <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                        <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                    </div>
                    <div class="ps__rail-y" style="top: 0px; height: 899px; right: 4px;">
                        <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 742px;"></div>
                    </div>
                </div>

                <!-- END: Aside Menu -->
            </div>

            <div v-if="isSideMenuOpen" @click="isSideMenuOpen=false" class="m-aside-left-overlay"></div>

            <!-- END: Left Aside -->
            <div class="m-grid__item m-grid__item--fluid m-wrapper">
                    <router-view></router-view>                            
            </div>
        </div>

        <!-- end:: Body -->

              <!-- begin::Footer -->
        <!--<footer class="m-grid__item		m-footer ">
        </footer>-->
        <!-- end::Footer -->
        </div>

        <!-- end:: Page -->
                <!-- begin::Scroll Top -->
        <div id="m_scroll_top" class="m-scroll-top">
            <i class="la la-arrow-up"></i>
        </div>

        <!-- end::Scroll Top -->
    </div>
</template>


<script>
import DashboardComponent from "./Dashboard.vue"
import UserComponent from "./user/Index.vue"
import CategoryComponent from "./category/Index.vue"
import ProductComponent from "./product/Index.vue"
import SupplierComponent from "./supplier/Index.vue"
import CustomerComponent from "./customer/Index.vue"
import ProfileComponent from "./UserProfile.vue"
import MutasiComponent from "./mutasi/Index.vue"
import PembelianComponent from "./pembelian/Index.vue"
import PembelianReturComponent from "./pembelianretur/Index.vue"
import PembelianReceiveComponent from "./pembelianreceive/Index.vue"
import PenjualanComponent from "./penjualan/Index.vue"
import PenjualanReturComponent from "./penjualanretur/Index.vue"
import PenjualanSendComponent from "./penjualansend/Index.vue"
import KasBankComponent from "./kasbank/Index.vue"
import MutasiKasBankComponent from "./mutasikasbank/Index.vue"

import LaporanHutangComponent from "./laporan/Hutang.vue"
import LaporanPiutangComponent from "./laporan/Piutang.vue"
import LaporanPembelianComponent from "./laporan/Pembelian.vue"
import LaporanPenjualanComponent from "./laporan/Penjualan.vue"
import LaporanKartuStockComponent from "./laporan/KartuStock.vue"
import LaporanMutasiKasBankComponent from "./laporan/MutasiKasBank.vue"

import PerfectScrollbar from 'perfect-scrollbar';

export default {
    name: "app-layout",
    data() {
        return {
            menu : [
                {label: "User", to: "/app/user", icon:"m-menu__link-icon fa fa-user", visible: (this.$store.state.user_role==='superadmin')},
                {label: "Category", to: "/app/category", icon:"m-menu__link-icon socicon-buffer", visible:true},
                {label: "Product", to: "/app/product", icon:"m-menu__link-icon flaticon-open-box", visible:true},
                {label: "Supplier", to: "/app/supplier", icon:"m-menu__link-icon socicon-stayfriends", visible:true},
                {label: "Customer", to: "/app/customer", icon:"m-menu__link-icon socicon-odnoklassniki", visible:true},
                {label: "Kas & Bank", to: "/app/kasbank", icon:"m-menu__link-icon la la-bank", visible:true},
             ],
            transaksiMenu : [
                {label: "Penjualan",  icon: "m-menu__link-icon flaticon-shopping-basket", to: "/app/penjualan", visible:true},
                {label: "Retur Penjualan",  icon: "m-menu__link-icon fa	fa-history", to: "/app/penjualanretur", visible:true},
                {label: "Pengiriman Barang", icon: "m-menu__link-icon flaticon-truck", to: "/app/penjualansend", visible:true},   	
                {label: "Pembelian", icon: "m-menu__link-icon fa fa-cart-plus", to: "/app/pembelian", visible:true},
                {label: "Retur Pembelian", icon: "m-menu__link-icon fa fa-history", to: "/app/pembelianretur", visible:true},
                {label: "Penerimaan Barang", icon: "m-menu__link-icon fa fa-truck-loading", to: "/app/pembelianreceive", visible:true},
                {label: "Mutasi Stock", icon: "m-menu__link-icon fa fa-balance-scale", to: "/app/mutasi", visible:true},
                {label: "Mutasi Kas & Bank", icon: "m-menu__link-icon flaticon-piggy-bank", to: "/app/mutasikasbank", visible:true},
             ],
            ReportMenu : [
                {label: "Laporan Kartu Stock", icon: "m-menu__link-icon fa fa-chart-area", to: "/app/laporankartustock", visible:true},
                {label: "Laporan Hutang", icon: "m-menu__link-icon fa fa-chart-line", to: "/app/laporanhutang", visible:true},
                {label: "Laporan Piutang", icon: "m-menu__link-icon fa fa-chart-bar", to: "/app/laporanpiutang", visible:true},
                {label: "Laporan Penjualan", icon: "m-menu__link-icon fa fa-chart-pie", to: "/app/laporanpenjualan", visible:true},
                {label: "Laporan Pembelian", icon: "m-menu__link-icon flaticon-pie-chart", to: "/app/laporanpembelian", visible:true},
                {label: "Laporan Mutasi KasBank", icon: "m-menu__link-icon flaticon-pie-chart", to: "/app/laporanmutasikasbank", visible:true},
            ],
            Profile : {label: "My Profile", icon: "tag", to: "/app/profile"},
            Username: this.$store.state.user_username,
            Email: this.$store.state.user_email,
            Role: this.$store.state.user_role,
            isSideMenuOpen: false
         };
    },
    methods: {
        logout: function() {
            this.$store.dispatch('logout');
            this.$router.push('/');
        }
    },
    async mounted() {
        // mLayout.initAside();
        const ps = new PerfectScrollbar('#m_ver_menu');
        console.log("Moutned Init Aside");
        // $('[data-scrollable="true"]').each(function() {
            // var t = $('#m_ver_menu');
            // mUtil.scrollerDestroy(t);
            // mUtil.scrollerInit(t, {
            //     disableForMobile: !0,
            //     handleWindowResize: !0,
            //     height: function() {
            //         return mUtil.isInResponsiveRange("tablet-and-mobile") && t.data("mobile-height") ? t.data("mobile-height") : t.data("height")
            //     }
            // })
        // });
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
            path: "supplier",
            component: SupplierComponent,
            children: SupplierComponent.routes
        }, 
        {
            path: "customer",
            component: CustomerComponent,
            children: CustomerComponent.routes
        },
        {
            path: "product",
            component: ProductComponent,
            children: ProductComponent.routes
        },
                {
            path: "kasbank",
            component: KasBankComponent,
            children: KasBankComponent.routes
        },
        {
            path: "profile",
            component: ProfileComponent,
            children: ProfileComponent.routes
        },
        {
            path: "mutasi",
            component: MutasiComponent,
            children: MutasiComponent.routes
        },
        {
            path: "pembelian",
            component: PembelianComponent,
            children: PembelianComponent.routes
        },   
        {
            path: "pembelianretur",
            component: PembelianReturComponent,
            children: PembelianReturComponent.routes
        },   
        {
            path: "pembelianreceive",
            component: PembelianReceiveComponent,
            children: PembelianReceiveComponent.routes
        },   
       {
            path: "penjualan",
            component: PenjualanComponent,
            children: PenjualanComponent.routes
        },   
        {
            path: "penjualanretur",
            component: PenjualanReturComponent,
            children: PenjualanReturComponent.routes
        },   
        {
            path: "penjualansend",
            component: PenjualanSendComponent,
            children: PenjualanSendComponent.routes
        },       
        {
            path: "mutasikasbank",
            component: MutasiKasBankComponent,
            children: MutasiKasBankComponent.routes
        },     
        {
            path: "laporankartustock",
            component: LaporanKartuStockComponent,
            children: LaporanKartuStockComponent.routes
        },   
        {
            path: "laporanhutang",
            component: LaporanHutangComponent,
            children: LaporanHutangComponent.routes
        },   
        {
            path: "laporanpiutang",
            component: LaporanPiutangComponent,
            children: LaporanPiutangComponent.routes
        },   
        {
            path: "laporanpenjualan",
            component: LaporanPenjualanComponent,
            children: LaporanPenjualanComponent.routes
        },   
        {
            path: "laporanpembelian",
            component: LaporanPembelianComponent,
            children: LaporanPembelianComponent.routes
        },   
        {
            path: "laporanmutasikasbank",
            component: LaporanMutasiKasBankComponent,
            children: LaporanMutasiKasBankComponent.routes
        },  
    ]
};
</script>

<style lang="scss">

#close_menu_btn {
    position: fixed;
    bottom: 10px;
    left: 10px; 
    width:40px;
    height: 40px; 
    z-index: 1000;
    color: white;;
}

#m_aside_left_close_btn {
    position:absolute;
    right: 10px; 
    top: 10px; 
}
.m-aside-menu .m-menu__nav {
    padding-top: 0px; 
}

@media (min-width: 1025px) {
    #close_menu_btn {
        display: none;
    }
    .m-grid.m-grid--ver-desktop.m-grid--desktop {
        height: 423px;
    }
    .m-menu__link-title {
        text-align: left;
    }
    .m-portlet__nav-link {
        margin-top: 10px;
    }
    .m-t-md {
        margin-top: 20px;
        margin-right: 50px;
    }
    .m-menu__section-text {
        color: #5867dd;
        text-align: left;
    }
}
</style>

