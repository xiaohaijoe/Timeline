<template>
  <div id="Home">
    <mt-header fixed title="年鱼">
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="tl-container">
      <div class="pg-menu tl-cf">
        <mt-button type="primary" class="tl-button-shadow tl-button-round tl-fl" >创建+</mt-button>
        <tl-search class="tl-fr"></tl-search>
      </div>
      <div class="pg-list">
        <div class=pg-item v-for="item in albumList">
          <div v-text="item.album_title"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Token from '@/util/token'
  import Request from '@/request'
  import Search from "@/components/Search"

  export default {
    name: "Home",
    data() {
      return{
        albumList : []
      }
    },
    mounted(){
      this.loadAlbumList();
    },
    methods:{
      loadAlbumList(){
        Request.getUserAlbums(Token.getToken(),(data) => {
          this.albumList = data.albumList;
        });
      }
    },
    components:{
      'tl-search' : Search
    }
  }
</script>

<style>
  body {
    background: #f5f5f5;
  }
</style>
<style lang="scss" scoped>
  @import '@/assets/css/app.scss';

  .pg-menu{
    padding:1rem;
  }
  .mint-search{
    margin-top:1rem;
    /deep/ .mint-searchbar{
      background-color:initial;
    }
  }
  /*.mint-search .mint-searchbar{*/
    /*background:red;*/
  /*}*/
  /*.tl-container .mint-searchbar{*/
    /*background-color:initial;*/
  /*}*/
</style>
