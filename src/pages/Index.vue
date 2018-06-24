<template>
  <div id="index">
    <!--这是首页-->
    <img id="logo" src="@/assets/images/ic-logo-lg.png" />
  </div>
</template>

<script>
  import Token from "@/util/token"
  import Request from "@/request"
  import '@/assets/css/app.scss'

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
        Request.checkToken(Token.getToken(),(data)=>{
          setTimeout(()=>{
            this.$router.push('/home');
          },1000)
        },()=>{
          setTimeout(()=>{
            this.$router.push('/account/login');
          },1000)
        });

      }
    },
    components: {
    }
  }
</script>

<style>
  body {
    background: #fdfbf4;
  }
</style>
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
