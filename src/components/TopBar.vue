<template>
    <!--Begin::TopBar-->
    <div class="topbar-container">
        <div class="topbar-content">
            <div class="m-portlet">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <a @click="$router.go(-1)" class="btn" style="background-color: transparent;">
                            <div class="m-portlet__head-title">
                                <span class="m-portlet__head-icon">
                                    <i :class="icon"/>
                                </span>
                                <h3 class="m-portlet__head-text">
                                    {{title}}
                                </h3>
                            </div>
                        </a>
                        <div class="m-portlet__head-tools">
                            <slot name="tools"></slot>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--End::TopBar-->
</template>



<script>
import Vue from 'vue';

export default {
    name: "bz-topbar",
    props: {
        title: { type:String, default:'Title' },
        icon: { type:String, default:'flaticon-layers' },
    },
    data() {
        return {};
    },
    created() {
        console.log("CREATED", this.title, this.icon);
    }
}
</script>

<style lang="scss">

.topbar-container {
    .topbar-content {
        width: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 10;
    }

    .m-portlet .m-portlet__head .m-portlet__head-caption {
        width: 100%;
        justify-content: space-between;
    }

    @media (min-width: 1025px) {
        .m-portlet .m-portlet__head .m-portlet__head-caption {
            padding-left: 255px;
        }
    }
}

.contentwithtopbar {
    margin-top: 80px;
}
</style>
