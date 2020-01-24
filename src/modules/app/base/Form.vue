<template>
    <div class="user-form">
        <b-container fluid class="pt-3">
            <h3>{{mode|humanize}} User</h3>

            <div class="mt-5"> 
                <b-form v-if="isReady" @submit="onSubmit" >
                    <template v-for="(item, index) in fieldList">
                        <b-form-group horizontal 
                            :label-cols="2" 
                            :label="item.keyy|humanize" 
                            :label-for="item.key"
                            :key=item.keykey
                        >
                            <b-form-textarea v-if="item.type=='textarea'" :id="item.key" v-model="item.value"></b-form-textarea>
                            <b-form-input v-else :id="item.key" v-model="item.value" :type="item.type?item.type:'text'"></b-form-input>

                        </b-form-group>
                    </template>
                    <b-button type="submit" variant="primary">Submit</b-button>
                </b-form>
            </div>
        </b-container>
    </div>
</template>


<script>
import Vue from 'vue';

export default {
    name: "user-form",
    endpoint: "users",
    fields: ['username', 'email:email', 'newpass:password'],    
    successRoute: '/app/user',
    data() {
        return {
            schema: {},
            model: {},
            show: true,
            form: {},
            formType: {},
            isReady: false,
            errors: {},
            fieldList: []
        };
    },
    methods: {
        async filterModelBeforePost(model) {
            return model;
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
                    await this.$api.post(this.$options.endpoint, model, true);
                else 
                    await this.$api.put(this.$options.endpoint+'/'+model.id, model, true);
                this.$snotify.success('Data Saved');
                this.$router.push(this.$options.successRoute);
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
        async getModel(id) {
            return await this.$api.get(this.$options.endpoint+'/'+id, {_build:true});
        },
        async getDefaultModel() {
            return await this.$api.get(this.$options.endpoint, {_build:true});
        }
    },
    computed:  {
        mode: function() {
            return this.$route.params.id?'update':'create';
        }
    },
    async created() {
        // this.schema = await this.$api.getSchema(this.$options.endpoint);
        this.model = {};
        if (this.$route.params.id) {
            this.model = await this.getModel(this.$route.params.id);
        }
        // else this.model = await this.getDefaultModel();

        this.isReady = true;
        // TODO: automatic field validation based on schema scope=detail
    }
};
</script>


<style lang="scss">
</style>
