<template>
    <div class="m-page--boxed m-body--fixed m-header--static m-aside--offcanvas-default">
        <!-- begin:: Page -->
        <div class="m-grid m-grid--hor m-grid--root m-page">

            <!-- begin::Header -->
            <header id="m_header" class="m-grid__item	m-grid m-grid--desktop m-grid--hor-desktop  m-header ">
                <div class="m-grid__item m-grid__item--fluid m-grid m-grid--desktop m-grid--hor-desktop m-container m-container--responsive m-container--xxl">
                    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--desktop m-grid--ver-desktop m-header__wrapper">

                        <!-- begin::Brand -->
                        <div class="m-grid__item m-brand">
                            <div class="m-stack m-stack--ver m-stack--general m-stack--inline">
                                <div class="m-stack__item m-stack__item--middle m-brand__logo">
                                    <a href="index.html" class="m-brand__logo-wrapper">
                                        <img alt="" src="assets/demo/demo4/media/img/logo/logo.png" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- end::Brand -->

                        <!-- begin::Topbar -->
                        <div class="m-grid__item m-grid__item--fluid m-header-head" id="m_header_nav">
                            <div id="m_header_topbar" class="m-topbar  m-stack m-stack--ver m-stack--general">
                                <div class="m-stack__item m-topbar__nav-wrapper">
                                    <ul class="m-topbar__nav m-nav m-nav--inline">
                                        <li class="m-nav__item m-topbar__notifications m-topbar__notifications--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-center 	m-dropdown--mobile-full-width" m-dropdown-toggle="click" m-dropdown-persistent="1">
											<a @click="logout()" class="m-nav__link m-dropdown__toggle" id="m_topbar_notification_icon">
												<span class="m-nav__link-icon">
													<span class="m-nav__link-icon-wrapper">
														<i class="flaticon-logout"> </i>
													</span>
												</span>
											</a>
										</li>
                                        <!-- <li class="m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light"
                                            m-dropdown-toggle="click">
                                            <a href="#" class="m-nav__link m-dropdown__toggle">
                                                <span class="m-topbar__welcome m--hidden-tablet m--hidden-mobile">Hello,&nbsp;</span>
                                                <span class="m-topbar__username m--hidden-tablet m--hidden-mobile m--padding-right-15"><span class="m-link">Nick</span></span>
                                                <span class="m-topbar__userpic">
                                                    <img src="assets/app/media/img/users/user4.jpg" class="m--img-rounded m--marginless m--img-centered" alt="" />
                                                </span>
                                            </a>
                                            <div class="m-dropdown__wrapper">
                                                <span class="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust"></span>
                                                <div class="m-dropdown__inner">
                                                    <div class="m-dropdown__header m--align-center" style="background: url(assets/app/media/img/misc/user_profile_bg.jpg); background-size: cover;">
                                                        <div class="m-card-user m-card-user--skin-dark">
                                                            <div class="m-card-user__pic">
                                                                <img src="assets/app/media/img/users/user4.jpg" class="m--img-rounded m--marginless" alt="" />
                                                            </div>
                                                            <div class="m-card-user__details">
                                                                <span class="m-card-user__name m--font-weight-500">Mark Andre</span>
                                                                <a href="" class="m-card-user__email m--font-weight-300 m-link">mark.andre@gmail.com</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="m-dropdown__body">
                                                        <div class="m-dropdown__content">
                                                            <ul class="m-nav m-nav--skin-light">
                                                                <li class="m-nav__section m--hide">
                                                                    <span class="m-nav__section-text">Section</span>
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="profile.html" class="m-nav__link">
                                                                        <i class="m-nav__link-icon flaticon-profile-1"></i>
                                                                        <span class="m-nav__link-title">
                                                                            <span class="m-nav__link-wrap">
                                                                                <span class="m-nav__link-text">My Profile</span>
                                                                                <span class="m-nav__link-badge"><span class="m-badge m-badge--success">2</span></span>
                                                                            </span>
                                                                        </span>
                                                                    </a>
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="profile.html" class="m-nav__link">
                                                                        <i class="m-nav__link-icon flaticon-share"></i>
                                                                        <span class="m-nav__link-text">Activity</span>
                                                                    </a>
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="profile.html" class="m-nav__link">
                                                                        <i class="m-nav__link-icon flaticon-chat-1"></i>
                                                                        <span class="m-nav__link-text">Messages</span>
                                                                    </a>
                                                                </li>
                                                                <li class="m-nav__separator m-nav__separator--fit">
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="profile.html" class="m-nav__link">
                                                                        <i class="m-nav__link-icon flaticon-info"></i>
                                                                        <span class="m-nav__link-text">FAQ</span>
                                                                    </a>
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="profile.html" class="m-nav__link">
                                                                        <i class="m-nav__link-icon flaticon-lifebuoy"></i>
                                                                        <span class="m-nav__link-text">Support</span>
                                                                    </a>
                                                                </li>
                                                                <li class="m-nav__separator m-nav__separator--fit">
                                                                </li>
                                                                <li class="m-nav__item">
                                                                    <a href="snippets/pages/user/login-1.html" class="btn m-btn--pill btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder">Logout</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> -->
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- end::Topbar -->
                    </div>
                </div>
            </header>

            <!-- end::Header -->

            <!-- begin::Body -->
            <div class="m-grid__item m-grid__item--fluid m-grid m-grid m-grid--hor m-container m-container--responsive m-container--xxl">
                <div class="m-grid__item m-grid__item--fluid m-grid m-grid--hor-desktop m-grid--desktop m-body">
                    <div class="m-grid__item m-body__nav">
                        <div class="m-stack m-stack--ver m-stack--desktop">

                            <!-- begin::Horizontal Menu -->
                            <div class="m-stack__item m-stack__item--middle m-stack__item--fluid">
                                <button class="m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-light " id="m_aside_header_menu_mobile_close_btn"><i class="la la-close"></i></button>
                                <div id="m_header_menu" class="m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-light m-aside-header-menu-mobile--submenu-skin-light ">
                                    <ul class="m-menu__nav  m-menu__nav--submenu-arrow ">
                                        <template v-for="(item, index) in menu" >
                                            <router-link tag="li" :to="item.to" :key="item.label" active-class="m-menu__item--active" class="m-menu__item" aria-haspopup="true">
                                                <a  class="m-menu__link ">
                                                    <span class="m-menu__item-here"></span>
                                                    <span class="m-menu__link-text">{{item.label}}</span>
                                                </a>
                                            </router-link>
                                        </template>
                                    </ul>
                                </div>
                            </div>

                            <!-- end::Horizontal Menu -->

                        </div>
                    </div>
                    
                    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--desktop m-grid--ver-desktop m-body__content">
						<div class="m-grid__item m-grid__item--fluid m-wrapper">

                            <router-view></router-view>                            
                            
						</div>
                    </div>

                </div>
            </div>
            <!-- begin::Body -->

            <!-- begin::Footer -->
            <footer class="m-grid__item		m-footer ">
                <div class="m-container m-container--responsive m-container--xxl">
                    <div class="m-footer__wrapper">
                        <div class="m-stack m-stack--flex-tablet-and-mobile m-stack--ver m-stack--desktop">
                            <div class="m-stack__item m-stack__item--left m-stack__item--middle m-stack__item--last">
                                <span class="m-footer__copyright">
                                    2017 &copy; Metronic theme by <a href="https://keenthemes.com" class="m-link">Keenthemes</a>
                                </span>
                            </div>
                            <div class="m-stack__item m-stack__item--right m-stack__item--middle m-stack__item--first">
                                <ul class="m-footer__nav m-nav m-nav--skin-dark m-nav--inline m--pull-right">
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
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
                {label: "Category", icon: "tag", to: "/app/category"},
                {label: "Setting", icon: "cog", to: "/app/setting"},
                {label: "Tenant", icon: "home", to: "/app/tenant"},
                {label: "Voucher", icon: "sale", to: "/app/voucher"},
            ]
        };
    },
    methods: {
        logout: function() {
            this.$store.dispatch('logout');
            this.$router.push('/');
        }
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
@media (min-width: 1025px) {
    .m-grid.m-grid--ver-desktop.m-grid--desktop {
        height: 423px;
    }
}
</style>

