import Vue from 'vue'
import Vuex from 'vuex'
const LocalForage = require("localforage");
const BZ_TOKEN = "cJfToX0LyZrMbrTj1Sl1eMleHLMIx5eg";
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: null,
        user_id: null,
        user_name: "",
        user_email: "",
        user_username: "",
        user_role: "guest",
        is_login: false,
        penjualan_id: "",
        pembelian_id: "",
        product_id: "",
        mutasi_id: "",
    },
    mutations: {
        updateValue(state, payload) {
            if (payload) {
                for (var key in payload) {
                    state[key] = payload[key];
                }
            }
        },
        updateToken(state, token) {
            state.token = token;
        },
        updatePenjualanId(state, penjualan_id) {
            state.penjualan_id = penjualan_id;
        },
        updatePembelianId(state, pembelian_id) {
            state.pembelian_id = pembelian_id;
        },
        updateProductId(state, product_id) {
            state.product_id = product_id;
        },
        updateMutasiId(state, mutasi_id) {
            state.mutasi_id = mutasi_id;
        },
        updateLogin(state, isLogin) {
            state.is_login = isLogin;
        },
        updateUser(state, user) {
            if (user) {
                state.user_id = user.id;
                state.user_name = user.name;
                state.user_role = user.role;
                state.user_username = user.username;
                state.user_email = user.email;
            } else {
                state.user_id = null;
                state.user_name = "";
                state.user_role = "guest";
                state.user_username = "";
                state.user_email = "";
            }
        }
    },
    actions: {
        updateToken(context, value) {
            context.commit("updateToken", value);
            return LocalForage.setItem(BZ_TOKEN, value);
        },
        updatePenjualanId(context, value) {
            context.commit("updatePenjualanId", value);
        },
        updatePembelianId(context, value) {
            context.commit("updatePembelianId", value);
        },
        updateMutasiId(context, value) {
            context.commit("updateMutasiId", value);
        },
        updateProductId(context, value) {
            context.commit("updateProductId", value);
        },
        logout(context) {
            context.commit("updateToken", null);
            context.commit("updateLogin", false);
            context.commit("updateUser", null);
            return LocalForage.removeItem(BZ_TOKEN);
        },

        async initApp(context) {
            console.log("INITAPP");
            return context.dispatch('loadToken')
                .then((token) => {
                    return context.dispatch('updateUser');
                })
        },

        updateUser(context) {
            return new Promise((resolve, reject) => {
                if (!context.state.token) {
                    resolve(null);
                } else {
                    Vue.api.token = context.state.token;
                    Vue.api
                        .patch("user/check-session")
                        .then(function(data) {
                            resolve(data);
                        })
                        .catch(function() {
                            resolve(null);
                        });
                }
            }).then(data => {
                context.commit("updateUser", data);
                if (!data) {
                    context.commit("updateToken", null);
                    context.commit("updateLogin", false);
                } else {
                    context.commit("updateLogin", true);
                }
                return Promise.resolve(data);
            });
        },

        loadToken(context) {
            return new Promise((resolve, reject) => {
                LocalForage.getItem(BZ_TOKEN)
                    .then(data => {
                        if (data) {
                            context.commit("updateToken", data);
                        } else {
                            context.commit("updateToken", null);
                        }
                        resolve(data);
                    })
                    .catch(() => {
                        context.commit("updateToken", null);
                        resolve(null);
                    });
            });
        },
    }
})