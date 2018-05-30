<template>
  <div class="card-layout">
    <template v-for="card in cardList">
      <div v-bind:id="'card'+card.cardId" class="card-box"
           v-bind:style="{left:card.left+'px',top:card.top+'px'}"
           v-finger:press-move="pressMove.bind(this,'card'+card.cardId)"
           v-finger:touch-end="pressEnd.bind(this)">
        {{card.title}}
      </div>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  import AlloyFinger from 'alloyfinger'
  import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
  Vue.use(AlloyFingerPlugin, {
    AlloyFinger
  });


  export default {
    name: "Card",
    props: ['cardList'],

    mounted (){
      for (let i = 0; i < this.cardList.length; i++) {
        let card = this.cardList[i]
        let el = document.getElementById("card" + card.cardId);
        Transform(el);
      }
    },
    methods:{
      pressMove: function (id, evt) {
        let obj = document.getElementById(id);
        let left = obj.offsetLeft + evt.deltaX;
        let top = obj.offsetTop + evt.deltaY;
        obj.style.left = left + "px";
        obj.style.top = top + "px";
        let data = {
          isMoving : true,
          id : id
        }
        this.$emit("setMoving", data)
        evt.preventDefault();
      },
      pressEnd : function(evt){
        this.$emit("setMoving", false)
      },
    }
  }
</script>

<style scoped>

  .card-box {
    position: absolute;
    width: 50px;
    height: 50px;
    background: blue;
    color: white;
    z-index:10;
  }
</style>
