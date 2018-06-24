<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  body {
    margin: 0;
    background: #f5f5f5;
  }

  a:link {
    text-decoration: none;
  }

  a:active {
    text-decoration: none
  }

  a:hover {
    text-decoration: none;
  }

  a:visited {
    text-decoration: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
