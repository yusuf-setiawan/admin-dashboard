<template>
    <div class="m--skin- m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--fixed m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default">
        <div class="m-grid m-grid--hor m-grid--root m-page">
            <div class="m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--signin m-login--2 m-login-2--skin-1" id="m_login" style="background-image: url(./assets/app/media/img/bg/bg-1.jpg); height:100vh;">
                <div class="m-grid__item m-grid__item--fluid m-login__wrapper">
                    <div class="m-login__container">
                        <div class="m-login__logo">
                            <a href="#">
                                <img src="assets/demo/default/media/img/logo/logo_compact.png">  	
                            </a>
                        </div>
                        <div class="m-login__signin">
                            <div class="m-login__head">
                                <h3 class="m-login__title">Sign In To Admin</h3>
                            </div>
                            <form @submit.prevent="onSubmit" class="m-login__form m-form">
                                <div class="form-group m-form__group">
                                    <input class="form-control m-input"  v-model="username"  type="text" placeholder="Username" name="email" autocomplete="off" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAPhJREFUOBHlU70KgzAQPlMhEvoQTg6OPoOjT+JWOnRqkUKHgqWP4OQbOPokTk6OTkVULNSLVc62oJmbIdzd95NcuGjX2/3YVI/Ts+t0WLE2ut5xsQ0O+90F6UxFjAI8qNcEGONia08e6MNONYwCS7EQAizLmtGUDEzTBNd1fxsYhjEBnHPQNG3KKTYV34F8ec/zwHEciOMYyrIE3/ehKAqIoggo9inGXKmFXwbyBkmSQJqmUNe15IRhCG3byphitm1/eUzDM4qR0TTNjEixGdAnSi3keS5vSk2UDKqqgizLqB4YzvassiKhGtZ/jDMtLOnHz7TE+yf8BaDZXA509yeBAAAAAElFTkSuQmCC&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;">
                                </div>
                                <div class="form-group m-form__group">
                                    <input  v-model="password"  class="form-control m-input m-login__form-input--last" type="password" placeholder="Password" name="password" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAPhJREFUOBHlU70KgzAQPlMhEvoQTg6OPoOjT+JWOnRqkUKHgqWP4OQbOPokTk6OTkVULNSLVc62oJmbIdzd95NcuGjX2/3YVI/Ts+t0WLE2ut5xsQ0O+90F6UxFjAI8qNcEGONia08e6MNONYwCS7EQAizLmtGUDEzTBNd1fxsYhjEBnHPQNG3KKTYV34F8ec/zwHEciOMYyrIE3/ehKAqIoggo9inGXKmFXwbyBkmSQJqmUNe15IRhCG3byphitm1/eUzDM4qR0TTNjEixGdAnSi3keS5vSk2UDKqqgizLqB4YzvassiKhGtZ/jDMtLOnHz7TE+yf8BaDZXA509yeBAAAAAElFTkSuQmCC&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;">
                                </div>
                                <!-- <div class="row m-login__form-sub">
                                    <div class="col m--align-left m-login__form-left">
                                        <label class="m-checkbox  m-checkbox--light">
                                        <input type="checkbox" name="remember"> Remember me
                                        <span></span>
                                        </label>
                                    </div>
                                    <div class="col m--align-right m-login__form-right">
                                        <a href="javascript:;" id="m_login_forget_password" class="m-link">Forget Password ?</a>
                                    </div>
                                </div> -->
                                <div class="m-login__form-action">
                                    <button id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air  m-login__btn m-login__btn--primary">Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>	
                </div>
            </div>				
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: "login",
    components: {
    },

    methods: {
        onSubmit() {
            console.log("onSubmit");
            this.$api.patch('user/login', {username: this.username, password:this.password})
            .then((data)=> {
                console.log('updateToken', data);
                return this.$store.dispatch('updateToken', data.token);
            })
            .then((data)=> {
               console.log("updateUser", data);
               return this.$store.dispatch('updateUser');
            })
            .then((data)=> {
                console.log("redirect", data);
                if (data)
                    this.$router.push('/app');
            })
            .catch((err)=> {
                alert(err);
            })

            //for try -> bypass
            //this.$store.dispatch('updateToken', 'dgdgdgdgBJHGGJBGJhghgfhgfhgFHGFHFHG46547ffhgfhvhghg');
            //this.$store.dispatch('updateUser')
            //this.$router.push('/app')
        }
    },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    // computed: {
    //     ...mapState(['is_login'])
    // },
    mounted () {
        // console.log("Login Mounted", this.is_login);
        // if (this.is_login) {
        //     this.$router.replace({name:"kasir"})
        // }
    }
};
</script>
