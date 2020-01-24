<template>
    <div class="page-category">
        <bz-topbar title="Category" icon="flaticon-layers" @click="test()">
            <template slot="tools">
                <ul class="m-portlet__nav">
                    <li class="m-portlet__nav-item">
                        <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                        <b-button type="button" @click="onSubmit()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">Submit</b-button>
                    </li>						
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
                <div class="m-portlet__body ">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col">   
                            <bz-form ref="form" v-if="isReady" @onSubmit="onSubmit" :fields="$options.fields" :model="model"></bz-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
          <!--End::Section-->
</template>


<script>
import BaseFormComponent from '../base/Form.vue'
export default {
    extends:BaseFormComponent,
    name: "category-form",
    endpoint: "category",
    fields: [
        'name', 
        'type',
        'code', 
        'description:textarea', 
        {
            key:'status', 
            type:"select", 
            options:['enabled','disabled']
        }, 
        "parentId:select:category:id:name",
        'image:image', 
    ],
    successRoute: '/app/category',
    methods: {
        test() {
            console.log("masuk pak eko");
        },

        async onSubmit(model) {
            console.log("OnSUbmit", model, this.$refs.form.values);
            if (!model) {
                if (this.$refs.form)
                    model = this.$refs.form.values;
            }
            model = Object.assign(this.model, model);
            model = await this.filterModelBeforePost(model);
            console.log("MODEL", model);
            try {
                if (this.mode == 'create')
                {
                    await this.$api.post(this.$options.endpoint, model, true);
                    this.$snotify.success('Data Saved');
                    this.$router.push(this.$options.successRoute);
                }
                else 
                {
                    if (this.model.parentId==null)
                        this.$snotify.error('Please select parent category!!');
                    else
                    {
                        await this.$api.put(this.$options.endpoint+'/'+model.id, model, true);
                        this.$snotify.success('Data Saved');
                        this.$router.push(this.$options.successRoute);
                    }
                }

            } catch (error) {
                console.log("ERR", error);
                var errorDetail='';
                this.$refs.form.errors = error;
                /*if (error.status=='500')
                {
                    error.errors.forEach(err => {
                        errorDetail = errorDetail + ' ' + err 
                    });
                    this.$snotify.error(errorDetail)
                }
                else*/
                    this.$snotify.error('Validation Error');
            }
        },
    }
};
</script>


<style lang="scss">
</style>
