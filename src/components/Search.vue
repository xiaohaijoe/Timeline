<template>
  <div class="tl-search tl-shadow-1 tl-cf">
    <i class="mintui mintui-search tl-fl"></i>
    <input type="text" class="tl-fl" placeholder="搜索" v-model="value"/>
    <i v-on:click="onCloseClick" class="mintui mintui-field-error tl-fr" v-bind:style="value == '' ? 'display:none' : ''"></i>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: "Search",
    data() {
      return {
        value : "",
        showClose : true,
      }
    },
    methods:{
      onCloseClick : function(){
        this.$nextTick(() => {
          this.value = '';
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tl-search {
    background: white;
    border-radius: 2rem;
    padding: 0 1rem;
    height: 2rem;
    line-height: 2rem;
    width: 9rem;
    input {
      line-height: 2rem;
      margin-left: 0.8rem;
      height: 2rem;
      width: 5rem;
      border: none;
      padding: 0 0.5rem;
      box-shadow: none;
      outline-style: none;
    }
  }
</style>
