<template>
  <div id="index">

    <div ref="container" class="container"
         v-finger:press-move="pressMoveContainer.bind(this)"
         v-finger:multipoint-start="multipointStart"
         v-finger:pinch="pinch">

      <!--<div id="myDiv" ref="myDiv" class="box"-->
           <!--v-finger:press-move="pressMove.bind(this)">-->
        <!--the element that you want to bind event-->
      <!--</div>-->
      <div ref="scalebox" style="position:relative">


        <template v-for="event in eventInfo.eventList">
            <timeline
              v-bind:id="'event'+event.eventId"
              v-bind:style="{left:event.left+'px',top:event.top+'px'}"
              v-finger:press-move="pressMove.bind(this,event.eventId)"
              v-finger:touch-end="pressEnd.bind(this)"></timeline>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import AlloyFinger from 'alloyfinger'
  import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
  import Transform from '../../static/js/transform.js'

  import Timeline from '../components/Timeline'

  Vue.use(AlloyFingerPlugin, {
    AlloyFinger
  })

  export default {
    name: "Index",
    data() {
      return {
        initScale: 1,
        isMoving : false,
        eventInfo : {
          eventList : [
            {
              eventId : 1,
              left : 100,
              top:100
            },
            {
              eventId : 2,
              left : 100,
              top:100
            }
          ]
        }
      }
    },

    mounted() {

      // Transform(this.$refs.myDiv)
      Transform(this.$refs.scalebox)
      for(let i = 0 ; i < this.eventInfo.eventList.length ; i++){
        let event = this.eventInfo.eventList[i]
        let el = document.getElementById("event"+event.eventId);
        Transform(el);
      }
    },
    methods: {

      pressMove: function (eventId,evt) {
        let obj = document.getElementById("event"+eventId);
        obj.translateX += evt.deltaX;
        obj.translateY += evt.deltaY;
        this.isMoving = true
        evt.preventDefault();
      },
      pressEnd : function(evt){
        this.isMoving = false
      },
      pressMoveContainer: function (evt) {
        if(this.isMoving){
          return
        }
        for(let i = 0 ; i < this.eventInfo.eventList.length ; i++){
          let event = this.eventInfo.eventList[i]
          let el = document.getElementById("event"+event.eventId);
          el.translateX += evt.deltaX;
          el.translateY += evt.deltaY;
          evt.preventDefault();
        }

      },
      multipointStart: function () {
        this.initScale = this.$refs.scalebox.scaleX;
      },
      pinch: function (evt) {
        // for(let i = 0 ; i < this.eventInfo.eventList.length ; i++){
        //   let event = this.eventInfo.eventList[i]
        //   let el = document.getElementById("event"+event.eventId);
          // el.translateX += evt.deltaX;
          // el.translateY += evt.deltaY;
        this.$refs.scalebox.scaleX = this.$refs.scalebox.scaleY = this.initScale * evt.zoom;
          // evt.preventDefault();
        // }

      }
    },
    components:{
      'Timeline':Timeline
    }
  }
</script>

<style scoped>
  .box {
    position: absolute;
    top: 100px;
    /*background: blue;*/
    height: 100px
  }

  .container {
    position: fixed;
    width: 100%;
    height: 100%;
    /*background: red;*/
  }
</style>
