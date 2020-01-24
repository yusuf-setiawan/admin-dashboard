<template>
  <div id="app">
    <router-view/>
    <vue-snotify></vue-snotify>
  </div>
</template>


<script>
export default {
    name: 'app',
    components: {
    },
    mounted() {
        console.log("MOUNTED APP", process.env.VUE_APP_API_KEY);
    }
}
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,700,700i');
@import './app.scss';
// @import '../node_modules/bootstrap/scss/bootstrap.scss';
// @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
@import "~vue-snotify/styles/material";

body {  
  width:100vw;
  margin: 0px;
}
#app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
table { word-break: break-all; }
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.fa-icon {
  width: auto;
  height: 1em; /* or any other relative font sizes */

  /* You would have to include the following two lines to make this work in Safari */
  max-width: 100%;
  max-height: 100%;
}
</style>
