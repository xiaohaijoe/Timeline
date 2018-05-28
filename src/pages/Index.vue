<template>
  <div id="index">

    <div class="line-box" style="top: 0px; left: 0px; width: 86.26px; height: 46.5697px;">
      <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" class="line-svg">
        <g class="line-svg-path  selected">
          <path d="M20 20 C 66.25996016546014 20, 20 26.56973987839956, 66.25996016546014 26.56973987839956 "
                stroke="black" fill="none" class="line-body"></path>
          <path d="M20 20 C 66.25996016546014 20, 20 26.56973987839956, 66.25996016546014 26.56973987839956 "
                stroke="black" fill="none" class="line-body-ghost"></path>
        </g>
      </svg>
    </div>
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
  });

  export default {
    name: "Index",
    data() {
      return {
        initScale: 1,
        isMoving: false,
        eventInfo: {
          eventList: [
            {
              eventId: 1,
              left: 100,
              top: 100
            },
            // {
            //   eventId : 2,
            //   left : 100,
            //   top:100
            // }
          ]
        }
      }
    },

    mounted() {

      // Transform(this.$refs.myDiv)
      Transform(this.$refs.scalebox)
      for (let i = 0; i < this.eventInfo.eventList.length; i++) {
        let event = this.eventInfo.eventList[i]
        let el = document.getElementById("event" + event.eventId);
        Transform(el);
      }
    },
    methods: {

      pressMove: function (eventId, evt) {
        let obj = document.getElementById("event" + eventId);
        obj.translateX += evt.deltaX;
        obj.translateY += evt.deltaY;
        this.isMoving = true
        evt.preventDefault();
      },
      pressEnd: function (evt) {
        this.isMoving = false
      },
      pressMoveContainer: function (evt) {
        if (this.isMoving) {
          return
        }
        for (let i = 0; i < this.eventInfo.eventList.length; i++) {
          let event = this.eventInfo.eventList[i]
          let el = document.getElementById("event" + event.eventId);
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
    components: {
      'Timeline': Timeline
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


  .line-box {
    position: absolute;
    pointer-events: none;
    transition: all .3s;
    outline: 2px dashed rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.9);
  }
  .line-box svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .line-box:not(.ghost) .line-body-ghost, .line-box:not(.ghost) .line-body {
    pointer-events: auto;
  }

  .line-box path.line-body {
    stroke-width: 3px;
    stroke: #acacac;
    marker-end: url(#Triangle);
    /* marker-start: url(#markerCircle); */
  }
  .line-box path.line-body-ghost {
    stroke-width: 40px;
    stroke: transparent;
  }
</style>
