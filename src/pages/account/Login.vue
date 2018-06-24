<template>
  <div id="Login">
    <div class="logo">
      <img src="@/assets/images/ic-logo-lg.png">
    </div>
    <div class="login-frame tl-center">
      <div class="login-text">登录</div>
      <mt-field placeholder="用户名" v-model="username"></mt-field>
      <mt-field placeholder="密码" type="password" v-model="password"></mt-field>
      <mt-button type="primary" class="tl-button-shadow" v-on:click="onLoginClick">登录</mt-button>
      <div class="tl-cf">
        <div class="tl-fl register-text">
          <router-link class="tl-yellow" to="/account/register">立即注册</router-link>
        </div>
        <div class="tl-fr forget-pass tl-grey-3">忘记密码</div>
      </div>
    </div>

  </div>
</template>

<script>
  import Token from "@/util/token"
  import Request from "@/request"
  import {Toast} from "mint-ui"


  export default {
    name: "Login",

    data() {
      return {
        username: "",
        password: "",
      }
    },


    mounted() {
      // let a = Token.getToken();
    },
    methods: {
      onLoginClick() {
        Request.accountLogin(this.username, this.password, (data) => {
          console.log(data)
          Token.setToken(data.token)
          this.$router.push({path:'/home'})
        }, (data) => {
          Toast(data.msg);
        })
      }
    }

  }
</script>


<style lang="scss">
  body {
    background: #fdfbf4;
  }
</style>
<style lang="scss" scoped>

  @import '@/assets/css/app.scss';
  .logo {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 6px 20px 5px rgba(255, 202, 40, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
    position: absolute;
    width: 5rem;
    height: 5rem;
    top: 50%;
    margin-top: -13.5rem;
    left: 50%;
    margin-left: -2.5rem;
    img {
      width: 5rem;
      height: auto;
    }
  }

  .login-frame {
    position: absolute;
    top: 50%;
    margin-top: -7rem;
    width: 70%;
    margin-left: 10%;
    padding: 5%;
    /*box-shadow:0 0 1rem 0.5rem #eaeaea;*/
    box-shadow: 0 6px 20px 5px rgba(255, 202, 40, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
    background: white;
    border-radius: 0.5rem;
    .login-text {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    .mint-cell .mint-cell-wrapper {
      font-size: 0.9rem;
    }
    .mint-button {
      margin-top: 1rem;
      width: 90%;
    }
    .register-text, .forget-pass {
      font-size: 0.9rem;
      margin: 0.5rem;
    }
  }

</style>
