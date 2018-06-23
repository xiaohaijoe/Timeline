<template>
  <div id="Register">
    <mt-header title="注册">
      <router-link to="/account/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="register-frame">
      <div class="register-text">注册</div>
      <mt-field placeholder="用户名" v-model="username"></mt-field>
      <mt-field placeholder="昵称" v-model="nickname"></mt-field>
      <mt-field placeholder="密码" type="password" v-model="password"></mt-field>
      <mt-field placeholder="确认密码" type="password" v-model="confirmPass"></mt-field>
      <mt-button type="primary" class="tl-button-shadow">注册</mt-button>
    </div>

  </div>
</template>

<script>
  import Token from "@/util/token"

  export default {
    name: "Register",

    data (){
      return {
        username : "",
        nickname : "",
        password : "",
        confirmPass : "",
      }
    },


    mounted () {
      // let a = Token.getToken();
    },
    onLoginClick(){

    }
  }
</script>


<style lang="scss">
  @import '@/assets/css/app.scss';
  body{
    background:#fdfbf4;
  }
  .register-frame{
    position:absolute;
    top:50%;
    margin-top:-10rem;
    width: 70%;
    margin-left:10%;
    padding:5% 5% 10% 5%;
    box-shadow:0 6px 20px 5px rgba(255, 202, 40, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
    background:white;
    border-radius:0.5rem;
    .register-text{
      font-size:1.2rem;
      margin-bottom:2rem;
    }
    .mint-cell .mint-cell-wrapper {
      font-size:0.9rem;
    }
    .mint-button{
      margin-top:1rem;
      width:90%;
    }
  }

</style>
