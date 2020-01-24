const axios = require("axios");
const queryString = require('query-string');

var api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000
});

var apiService = {
    token: null,

    getOptions: function(isMultipart = false) {
        var options = {
            headers: {
                "BZ-API-KEY": process.env.VUE_APP_API_KEY
            }
        };

        if (this.token) {
            options.headers["BZ-AUTH"] = this.token;
        }
        if (isMultipart) {
            options.headers['Content-Type'] = 'multipart/form-data';
        }
        console.log("OPTIONS", options);
        return options;
    },

    handleError: function(error) {
        console.log("handleError = ", error);
        if (error.response) {
            return Promise.reject(this.handleResponse(error.response));
        } else return Promise.reject(error);
    },

    handleDataTableResponse: function(response) {
        var result = {
            page: 0,
            rows: [],
            total: 0
        };

        if (response.status >= 200 && response.status < 300) {
            var content = response.headers["content-range"];
            result.total = 1;
            if (content) result.total = content.split('/')[1];

            result.rows = response.data;
        }
        return result;

    },
    handleResponse: function(response) {
        //status: 500, statusText: "Internal Server Error"
        if (response.status >= 500) {
            var errors = {};
            if (response.data && Array.isArray(response.data.errors)) {
                let e = [];
                response.data.errors.forEach(err => {
                    e.push(err);
                });
                errors = { 
                        message: response.data.message, 
                        errors: e,
                        status:response.status,
                        statusText:response.statusText
                }
            }
            console.log("ERROR RESPONSE", response);
            return errors;            
        }
        else if (response.status >= 400) {
            var errors = {};
            if (response.data && Array.isArray(response.data.errors)) {
                response.data.errors.forEach(err => {
                    var e = errors[err.field];
                    if (!e) e = [];

                    if (err.message.includes('cannot be null')) {
                        err.message = "this field is required";
                    }
                    e.push(err.message);
                    errors[err.field] = e;
                });
            }
            console.log("ERROR RESPONSE", response);
            return errors;
        } else if (response.status >= 300) {
            return response.status + "-" + response.statusText;
        } else if (response.status >= 200) {
            return response.data;
        } else {
            return response.status + "-" + response.statusText;
        }
    },

    getDataTable: function(endpoint, data = { page: 1, count: 10 }) {
        for (var key in data) {
            if (!data[key]) delete data[key];
        }
        data.t = +new Date();
        endpoint += "?" + queryString.stringify(data);
        var options = this.getOptions();
        return api
            .get(endpoint, options)
            .then(response => {
                return this.handleDataTableResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    getSchema: function(endpoint) {
        return this.get(endpoint + "?rawmodel=1");
    },

    toFormData: function(data) {
        var formData = new FormData();
        for (var key in data) {
            // console.log("FORMDATA", key, typeof data[key].name);
            // if (typeof data[key].name == 'string') {
            formData.append(key, data[key]);
            // }   
            // else
            // formData.append(key, data[key]);
        }
        return formData;
    },

    get: function(endpoint, params = {}) {
        for (var key in params) {
            if (!params[key]) delete params[key];
        }
        endpoint = this.formatUrl(endpoint, params);
        var options = this.getOptions();
        return api
            .get(endpoint, options)
            .then(response => {
                return this.handleResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    post: function(endpoint, data, isMultipart = false) {
        console.log("POST", endpoint, isMultipart);
        if (isMultipart) data = this.toFormData(data);
        var options = this.getOptions(isMultipart);
        return api
            .post(endpoint, data, options)
            .then(response => {
                return this.handleResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    put: function(endpoint, data, isMultipart = false) {
        console.log("PUT", endpoint, isMultipart);
        if (isMultipart) data = this.toFormData(data);
        var options = this.getOptions(isMultipart);
        return api
            .put(endpoint, data, options)
            .then(response => {
                return this.handleResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    delete: function(endpoint) {
        var options = this.getOptions();
        return api
            .delete(endpoint, options)
            .then(response => {
                return this.handleResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    patch: function(endpoint, data) {
        var options = this.getOptions();
        return api
            .patch(endpoint, data, options)
            .then(response => {
                return this.handleResponse(response);
            })
            .catch(err => {
                return this.handleError(err);
            });
    },

    getFile: function(filename) {
        return process.env.VUE_APP_API_URL + '/files/' + filename;
    },

    getImage: function(filename, w = 100, h = 100, fitStrategy = "inside") {
        return process.env.VUE_APP_API_URL + `/images/${w}.${h}.${fitStrategy}/${filename}`;
    },

    formatUrl: function(endpoint, params={}) {
        endpoint += "?" + queryString.stringify(params);
        return endpoint;
    }
};

// This is your plugin object. It can be exported to be used anywhere.
export default function(Vue) {
    Vue.api = apiService;
    Vue.prototype.$api = Vue.api;
}