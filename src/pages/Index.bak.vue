<template>
  <div id="index">
    <div ref="container" class="container"
         v-finger:press-move="pressMoveContainer.bind(this)"
         v-finger:multipoint-start="multipointStart"
         v-finger:touch-end="touchEnd"
         v-finger:pinch="pinch">

      <div class="scaleBox" ref="scaleBox" style="position:relative">
        <timeline
          ref="eventLayout1"
          @setMoving="setMoving"
          v-bind:timeline="eventInfo.timeline"></timeline>
        <card @setMoving="setMoving" v-bind:cardList="eventInfo.cardList"></card>
        <pointer ref="pointer"></pointer>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import AlloyFinger from 'alloyfinger'
  import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
  import Transform from '../../static/js/transform.js'

  import Album from '../components/Album'
  import Timeline from '../components/Timeline'
  import Card from '../components/Card'
  import Pointer from '../components/Pointer'
  import data from 'static/json/timeline.json'

  import Request from '../request'

  Vue.use(AlloyFingerPlugin, {
    AlloyFinger
  });

  export default {
    name: "Index",
    data() {
      return {
        initScale: 1,
        isMoving: false,
        // pointerList: [],
        eventInfo: {
          timeline:
            {
              eventId: 1,
              left: 50,
              top: 200,
              info: data
            },
          cardList: [
            {
              cardId: 1,
              title: "我是卡片1",
              left: 50,
              top: 50,
            },
            {
              cardId: 2,
              title: "我是卡片2",
              left: 150,
              top: 60,
            },
            {
              cardId: 3,
              title: "我是卡片3",
              left: 50,
              top: 600,
            },
            {
              cardId: 4,
              title: "我是卡片4",
              left: 320,
              top: 600,
            },
          ],
        }
      }
    },

    mounted() {
      Transform(this.$refs.scaleBox)

      this.initPointer();

      this.initAlbumInfo();
    },
    methods: {
      initAlbumInfo : async function(){
        let a = await Request.getAlbumInfo(1);
        console.log(a);
      },
      initPointer: function () {
        this.$nextTick(() => {
          let pointerList = this.$refs.eventLayout1.getNodePositionList();
          this.$refs.pointer.init(pointerList)
        })
      },
      setMoving: function(data){
        this.isMoving = data.isMoving;
        let pointerList = this.$refs.eventLayout1.getNodePositionList();
        this.$refs.pointer.refreshPointer(data.id,pointerList);
      },
      pressEnd: function (evt) {
        this.isMoving = false;
      },
      touchEnd : function(){
        let pointerList = this.$refs.eventLayout1.getNodePositionList();
        this.$refs.pointer.init(pointerList);
      },
      pressMoveContainer: function (evt) {
        if (this.isMoving) {
          return
        }
        this.$refs.pointer.hidePointer();
        for (let i = 0; i < this.eventInfo.cardList.length; i++) {
          let card = this.eventInfo.cardList[i]
          let el = document.getElementById("card" + card.cardId);
          let left = el.offsetLeft + evt.deltaX;
          let top = el.offsetTop + evt.deltaY;
          el.style.left = left + "px";
          el.style.top = top + "px";
          evt.preventDefault();
        }
        let el = document.getElementById("eventLayout")
        let left = el.offsetLeft + evt.deltaX;
        let top = el.offsetTop + evt.deltaY;
        el.style.left = left + "px";
        el.style.top = top + "px";
        evt.preventDefault();

      },
      multipointStart: function () {
        this.initScale = this.$refs.scaleBox.scaleX;
      },
      pinch: function (evt) {
        this.$refs.scaleBox.scaleX = this.$refs.scaleBox.scaleY = this.initScale * evt.zoom;
      }
    },
    components: {
      'Timeline': Timeline,
      'Card': Card,
      'Pointer': Pointer,
      'Album' : Album
    }
  }
</script>

<style scoped>
  .container {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .container .event-layout {
    position: relative;
  }

  .container .card-layout {
    position: relative;
  }
</style>
