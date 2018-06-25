<template>
  <div id="Home">
    <mt-header fixed title="年鱼">
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="tl-container">
      <div class="pg-menu tl-cf">
        <mt-button type="primary" class="tl-button-shadow tl-button-round tl-fl">创建+</mt-button>
        <tl-search class="tl-fr"></tl-search>
      </div>
      <div class="pg-list"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <div class="pg-item" v-for="item in albumList" to="">
          <router-link :to="{ name: 'Album', params: { albumId: item.albumId }}">
            <div class="pg-content tl-shadow-1">
              <img class="pg-img" v-lazy="item.image">
              <div class="pg-main">
                <div class="pg-title-field tl-cf">
                  <div class="pg-title tl-truncate tl-grey-1 tl-fl" v-text="item.title"></div>
                  <div class="pg-add-time tl-truncate tl-grey-2 tl-fr" v-text="parseTime(item.addTime)"></div>
                </div>
                <div class="pg-desc tl-truncate tl-grey-3" v-text="item.desc">
                </div>
              </div>
            </div>
          </router-link>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Moment from 'moment'
  import Token from '@/util/token'
  import Request from '@/request'
  import {Lazyload} from 'mint-ui';
  import Search from "@/components/Search"

  Vue.use(Lazyload);

  export default {
    name: "Home",
    data() {
      return {
        albumList: []
      }
    },
    mounted() {
      this.loadAlbumList();
    },
    methods: {
      loadAlbumList() {
        Request.getUserAlbums(Token.getToken(), (data) => {
          this.albumList = data.albumList;
          console.log(data.albumList[0]);
        });
      },
      loadMore() {
        console.log('loadMore')
      },
      parseTime(time) {
        return Moment(time * 1000).fromNow();
      }
    },
    components: {
      'tl-search': Search
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

  .pg-menu {
    padding: 1rem;
  }

  .mint-search {
    margin-top: 1rem;
    /deep/ .mint-searchbar {
      background-color: initial;
    }
  }

  .pg-list {
    .pg-item:not(:first-child) {
      margin-top: 0.5rem;
    }
    .pg-item {
      padding: 0 0.5rem;
      .pg-content {
        background: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        .pg-img {
          width: 100%;
          height: 7rem;
          object-fit: cover;
          border-radius: 0.5rem;
        }
        .pg-main {
          .pg-title-field {
            line-height: 1rem;
            .pg-title {
              font-size: 0.9rem;
              width: 50%;
            }
            .pg-add-time {
              font-size: 0.8rem;
              width: 50%;
              text-align: right;
            }
          }
          .pg-desc {
            font-size: 0.8rem;
          }
        }
      }

    }
  }
</style>
