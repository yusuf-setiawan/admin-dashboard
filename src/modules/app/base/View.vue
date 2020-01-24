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
            model: {},
            isReady: false,
        };
    },
    methods: {
    },
    
    async created() {
        // this.schema = await this.$api.getSchema(this.$options.endpoint);
        this.model = null;
        if (this.$route.params.id) {
            this.model = await this.$api.get(this.$options.endpoint+'/'+this.$route.params.id);
        }

        this.isReady = true;
    }
};
</script>


<style lang="scss">
</style>
