<template>
    <div class="m-portlet" :class="cls">
        <div v-if="!hasSlot('head') && (title || icon)" class="m-portlet__head">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <span v-if="icon" class="m-portlet__head-icon">
                        <i :class="icon"/>
                    </span>
                    <h3 class="m-portlet__head-text">
                        {{title}}
                        <small v-if="subtitle">{{subtitle}}</small>
                    </h3>
                </div>
            </div>
            <div v-if="hasSlot('tools')" class="m-portlet__head-tools">
                <slot name="tools"></slot>
            </div>
        </div>
        <div v-else-if="hasSlot('head')" class="m-portlet__head">
            <slot name="head"></slot>
        </div>

        <div class="m-portlet__body">
            <div class="row m-row--no-padding m-row--col-separator-xl">
                <div class="col">  
                     <slot name="body"></slot>
                </div>
            </div>
        </div>


        <div v-if="hasSlot('foot')" class="m-portlet__foot">
            <div class="row align-items-center text-left">
                <slot name="foot"></slot>
            </div>
        </div>
    </div>
</template>



<script>
import Vue from 'vue';

export default {
    name: "bz-portlet",
    props: {
        title: { type:String, default:null },
        cls: { type:String, default:'' },
        subtitle: { type:String, default:null },
        icon: { type:String, default:null },
    },
    methods: {
        hasSlot (name = 'default') {
            return !!this.$slots[ name ] || !!this.$scopedSlots[ name ];
        }
    },
    data() {
        return {};
    },
    created() {
    }
}
</script>

<style lang="scss">
</style>
