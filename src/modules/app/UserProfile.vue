<template>
    <div class="page-profile">
        <bz-topbar title="Change Password" icon="fa fa-user">
            <template slot="tools">
                <ul class="m-portlet__nav">
					
                </ul>
            </template>
        </bz-topbar>
        <div class="container-fluid contentwithtopbar">
            <div class="m-portlet">
                        <div class="m-portlet__body ">
                             <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                                <label id="usernamelbl" for="usernamelbl" class="col-sm-3 col-form-label">Username</label>
                                <b-form-input id="username" class="col-sm-9" v-model="username"  readonly></b-form-input>
                            </div>

                            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                                <label id="emaillbl" for="emaillbl" class="col-sm-3 col-form-label">Email</label>
                                <b-form-input id="email" class="col-sm-9" v-model="email"  readonly></b-form-input>
                            </div>

                            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                                <label id="password" for="password" class="col-sm-3 col-form-label">Current Password</label>
                                <b-form-input class="col-sm-9" type="password" v-model="model.password"></b-form-input>
                                   
                            </div>

                            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                                <label id="new_password" for="new_password" class="col-sm-3 col-form-label">New Password</label>
                                <b-form-input class="col-sm-9" type="password" v-model="model.new_password"></b-form-input>
                            </div>
                            
                            <div class="row m-row--no-padding m-row--col-separator-xl form-group">
                                <label id="verify_password" for="verify_password" class="col-sm-3 col-form-label">Verify New Password</label>
                                <b-form-input class="col-sm-9" type="password" v-model="model.verify_password"></b-form-input>
                            </div>
                        </div>

                        <div class="m-portlet__foot">
                            <div class="row align-items-center text-left">
                                <div class="col-lg-12">
                                    <b-button type="button" :to="$options.successRoute" class="btn m-btn m-btn--gradient-from-focus m-btn--gradient-to-danger text-white mr-3">Cancel</b-button>
                                    <b-button type="button" @click="onSubmit()" class="btn m-btn m-btn--gradient-from-brand m-btn--gradient-to-info">Submit</b-button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!--End::Section-->
                </div>
                
            </div>
        </div>
    </div>
</template>


<script>
import BaseFormComponent from './base/Form.vue'
export default {
    extends:BaseFormComponent,
    name: "profile-form",
    endpoint: "user/change-password",
    successRoute: '/app/user',
    async mounted() {
        console.log("mounted form  profile-form ");
        this.email= this.$store.state.user_email;
        this.username= this.$store.state.user_username;
        this.model.username=this.username;
        this.model.email=this.email;
        }, 
    data() {
        return {
            errors: {},
            email:this.$store.state.user_email,
            username: this.$store.state.user_username,
            model: {
                'password': '',
                'new_password': '',
                'verify_password':''
            },
        }
    },
    methods: {
         async onSubmit() {
            if (this.model.new_password!=this.model.verify_password)
                this.$snotify.error("New Password not match!!");
            else
            {
                try {
                    await this.$api.patch(this.$options.endpoint, this.model);
                    this.$snotify.success('Change password success');
                    this.$router.push(this.$options.successRoute);
                } catch (error) {
                    console.log("ERR message", error.message);
                    this.$snotify.error(error.message);
                }
            }

        },       
    },

};
</script>


<style lang="scss">
</style>
