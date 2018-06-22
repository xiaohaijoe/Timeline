<template>
  <div id="index">
    <!--这是首页-->
    <!--<router-link id="href" to="/account/login">跳转啊啊啊啊啊</router-link>-->
    <img id="logo" src="static/images/ic-logo-lg.png" />
  </div>
</template>

<script>

  export default {
    name: "Index",
    data() {
      return {

      }
    },

    mounted() {
      this.start();
    },
    methods: {
      start(){
        setTimeout(()=>{
          this.$router.push('/account/login');
        },1000)
      }
    },
    components: {

    }
  }
</script>

<style scoped>
  #logo{
    width:12rem;
    height:auto;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:-6rem;
    margin-top:-6rem;
  }
</style>
