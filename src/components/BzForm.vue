<template>
    <b-form v-if="isReady" @submit="onSubmit" >
        <template v-for="(item, index) in arrField">
            <b-form-group horizontal 
                :label-cols="2" 
                :label="item.key|humanize" 
                :label-for="item.key"
                :key=item.key
                :class="{ 'has-danger': errors[item.key] }"
            >   

                <b-form-textarea v-if="item.type=='textarea'" :id="item.key" v-model="item.value" :rows="3"></b-form-textarea>
                
                <b-form-select v-else-if="item.type=='select'" :id="item.key" v-model="item.value" :options="item.options"></b-form-select>

                <!-- <multiselect v-else-if="item.type=='multiselect'" :id="item.key" v-model="item.value" :options="item.options" :multiple="true" track-by="value" :searchable="true" ></multiselect> -->
                <template v-else-if="item.type=='multicheckbox'">
                    <b-form-checkbox-group class='multicheckbox' :id="item.key" v-model="item.value" :options="item.options"></b-form-checkbox-group>
                </template>

                <template v-else-if="item.type=='image'" >
                    <b-form-file accept="image/jpeg, image/png, image/gif" :id="item.key" v-model="item.value"></b-form-file>
                    <b-img style="max-height:200px"  fluid v-if="item.value && typeof item.value!='string'" :src="previewFile(item.value)"/>
                    <b-img style="max-height:200px"  fluid v-else-if="model && model[item.key]" :src="$api.getImage(model[item.key])"/>
                </template>

                <flat-pickr v-else-if="item.type=='date'" :id="item.key" class="form-control" 
                    :config="{altInput:true, altFormat:'d M Y'}" 
                    v-model="item.value"
                ></flat-pickr>

                <b-form-input v-else :id="item.key" v-model="item.value" :type="item.type?item.type:'text'"></b-form-input>
                
                <div v-if="errors[item.key]" class="text-left form-control-feedback">{{errors[item.key].join(' ')}}</div>
            </b-form-group>
        </template>

        <!-- <b-button type="submit" variant="primary">Submit</b-button> -->
    </b-form>
</template>


<script>
import Vue from 'vue';

export default {
    props: {
        fields: Array,
        model: Object
    },
    data() {
        return {
            form: {},
            formType: {},
            formOptions: {},
            errors: {},
            isReady: false,
            fieldList: [],
            arrField: []
        }
    },
    computed:  {
        values: function() {
            var result = {};
            this.arrField.forEach(item => {
                if (item.type == 'multicheckbox') {
                    if (Array.isArray(item.value))
                        result[item.key] = item.value.join(',');
                    else result[item.key] = item.value;
                }
                else 
                    result[item.key] = item.value;

            });
            return result;
        }
    },
    methods: {
        previewFile(file) {
            console.log("PREVIEW FILE", file);
            var myURL = window.URL || window.webkitURL
            return myURL.createObjectURL(file);
        },
        async onSubmit() {
            // console.log("onSubmit", this.form);
            // var values = {};
            // this.fieldList.forEach(item => {
            //     values[item.key] = item.value;
            // });
            this.$emit('onSubmit', this.values);
        },
        async initFields() {
            return await new Promise(async (resolve, reject)=> {
                var arr = [];
                this.fields.forEach((key)=> {
                    var f = { key: key, value:'', type: 'text', options:[], selectOptions:null }
                    var fieldSelect = {
                        value: 'id',
                        text: 'name',
                        endpoint: f.key
                    }

                    if (typeof key == "string" && key.indexOf(":")>-1) {
                        var parts = key.split(":");
                        f.key = parts[0];
                        f.type = parts[1];
                        if (f.type == 'select' || f.type == 'multiselect' || f.type == 'multicheckbox') {
                            //console.log("parts[2] ", parts[2]);
                            //console.log("parts[3] ", parts[3]);
                            //console.log("parts[4] ", parts[4]);
                            if (parts[2]) fieldSelect.endpoint = parts[2];
                            if (parts[3]) fieldSelect.value = parts[3];
                            if (parts[4]) fieldSelect.text = parts[4];
                            f.selectOptions = fieldSelect;
                        }
                    }
                    else if (typeof key == "object") {
                        f.key = key.key;
                        f.type = key.type || 'text';
                        if (f.type == "select" && key.options) {
                            f.options = key.options;
                        }
                        if (f.type == "multiselect" && key.options) {
                            f.options = key.options;
                        }
                        if (f.type == "multicheckbox" && key.options) {
                            f.options = key.options;
                        }
                    }



                    // set value
                    if (this.model && typeof this.model[f.key] !== "undefined") {
                        f.value = this.model[f.key];
                        if (f.type == 'number') f.value *= 1;
                        if (f.type == 'multicheckbox') {
                            if (f.value) f.value = f.value.split(',');
                            else f.value = [];
                        }
                    }

                    arr.push(f);
                })

                for (var i = 0; i< arr.length ; i++) {
                    if (arr[i].selectOptions) {
                        var o = await this.$api.get(arr[i].selectOptions.endpoint, {_ovalue:arr[i].selectOptions.value, _otext:arr[i].selectOptions.text});
                        o = o.map((item)=> {return {value: item[0], text: item[1], label: item[1]}});
                        arr[i].options = o
                    }
                }

                console.log("ARR", arr);
                resolve(arr);
            })
        }
    },
    async created() {

        this.arrField = await this.initFields();
        //console.log("MODEL", this.model);
        // console.log("Created Bz Vue", this.fields, this.model);
        // this.fieldList = [];
        // await this.fields.forEach(async (key) => {
        //     var f = { key: key, value:'', type: 'text', options:[] }
        //     var fieldName = key;
        //     var fieldType = "text";
        //     var fieldSelect = {
        //         value: 'id',
        //         text: 'name',
        //         endpoint: fieldName
        //     }
        //     if (typeof key == "string" && key.indexOf(":")>-1) {
        //         var parts = key.split(":");
        //         fieldName = parts[0];
        //         fieldType = parts[1];
        //         if (fieldType == 'select') {
        //             if (parts[2]) fieldSelect.endpoint = parts[2];
        //             if (parts[3]) fieldSelect.value = parts[3];
        //             if (parts[4]) fieldSelect.text = parts[4];
        //         }
        //         try {
        //             var options = await this.$api.get(fieldSelect.endpoint, {_ovalue:fieldSelect.value, _otext:fieldSelect.text});
        //             options = options.map((item)=> {return {value: item[0], text: item[1]}});
        //             Vue.set(this.formOptions, fieldName, options);
        //             f.options = options;
        //         } catch (error) {
                    
        //         }
        //     }
        //     else if (typeof key == "object") {
        //         fieldName = key.key || fieldName;
        //         fieldType = key.type || fieldType;
        //         if (fieldType == "select" && key.options) {
        //             Vue.set(this.formOptions, fieldName, key.options);
        //             f.options = key.options;
        //         }
        //     }

        //     f.key = fieldName; f.type = fieldType;
        //     if (this.model && this.model[fieldName]) {
        //         Vue.set(this.form, fieldName, this.model[fieldName])
        //         f.value = this.model[fieldName];
        //     }
        //     else {
        //         Vue.set(this.form, fieldName, '')
        //     }

        //     Vue.set(this.formType, fieldName, fieldType);
        //     console.log("PUSH", f);
        //     this.fieldList.push(f);
        // });

        // console.log("FIELDLIST", this.fieldList)
        this.isReady = true;
    }
};
</script>


<style lang="scss">
.col-form-label {
    text-align: left;
}
.multicheckbox {
    text-align: left;
    padding-top: 12px;
}
</style>
