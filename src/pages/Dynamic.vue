<template>
  <div id="dynamics">
    <div class="point1" id="point1" v-finger:long-tap="onLongTap"></div>
    <div class="point2" id="point2" v-finger:long-tap="onLongTap" v-finger:tap="onTap"></div>
    <div class="point3" id="point3" v-finger:long-tap="onLongTap" v-finger:tap="onTap"></div>
    <div class="line-layer">
      <div class="line-box" v-for="line in lineList" v-bind:style="line.boxStyle">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path v-bind:d="line.d" stroke-width="1.5" stroke="black" fill="none"/>
          </g>
        </svg>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import dynamics from 'dynamics.js'
  import AlloyFinger from 'alloyfinger'
  import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'

  Vue.use(AlloyFingerPlugin, {
    AlloyFinger
  });

  export default {
    name: "Dynamic",
    data() {
      return {
        isLongTap: false,
        startElem: null,
        lineList: [],
      }
    },
    mounted() {

    },
    methods: {
      onTap: function (event) {
        if (this.isLongTap) {
          console.log("connect");
          // 如果是长按时间，则用svg path将两个节点连接起来
          let startElem = this.startElem;
          let endElem = event.target;
          this.connectByLine(startElem, endElem);
          // this.pointerStyle = {
          //     display:"block",
          //     left:this.startX + "px",
          //     top:this.startY + "px"
          // };
          // let endX = event.target.offsetLeft + event.target.clientWidth; // 起始x坐标
          // let endY = event.target.offsetTop + event.target.clientHeight/2; // 起始y坐标
          // this.d = "M20 20 C0 0, 0 0, 120 120";
          this.isLongTap = false;
        }
      },
      getLinePointerSize: function (e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h) {
        let direction = 'none';
        let b1x, b1y, b2x, b2y = 0;
        let left, top = 0;
        if (e1x > e2x){
          // e2 在 e1 左边边
          if(e1x - e1w/2 < e2x + e2w/2){
            // e1左边界 < e2右边界
            if(e1y > e2y){
              // e2 在 e1 下方偏左
              direction = 'bottomLeft';
            }else{
              // e2 在 e1 上方偏左
              direction = 'topLeft';
            }
          }else{
            // e1左边界 > e2 右边界
            if(e1y > e2y){
              // e2 在 e1 左边偏下
              direction = 'leftBottom';
            }else{
              // e2 在 e1 左边偏上
            }
          }
        }else{
          // e2 在 e1 右边
          if(e1x + e1w/2 > e2x - e2w/2){
            // e1 右边界 > e2 左边界
            if(e1y > e2y){
              // e2 在 e1 上方偏右
              direction = 'topRight'
            }else{
              // e2 在 e1 下方偏右
              direction = 'bottomRight'
            }
          }else{
            // e1 右边界 < e2 左边界
            if(e1y > e2y){
              // e2 在 e1 右方偏上
              direction = 'rightTop';
            }else{
              // e2 在 e1 右方偏下
              direction = 'rightBottom';
              b1x = e1x + e1w/2 - 20;
              b1y = e1y - 20;
              b2x = e2x - e2w/2 + 20;
              b2y = e2y - e2h/2 + 20;
              left = b1x;
              top = b1y;
            }
          }
        }
        // if (e1x > e2x) {
        //   if (e2x + e2w / 2 > e1x - e1w / 2) {
        //     if (e2y > e1y) {
        //       direction = 'topRight'; // elem1 in the top right of elem2
        //       b1x = e1x + 20;
        //       b1y = e1y + e1h / 2 - 20;
        //       b2x = e2x - 20;
        //       b2y = e2y - e2h / 2 + 20;
        //       left = b2x;
        //       top = b1y;
        //     } else {
        //       direction = 'bottomRight';
        //       b1x = e1x + 20;
        //       b1y = e1y - e1h / 2 + 20;
        //       b2x = e2x - 20;
        //       b2y = e2y + e2h / 2 - 20;
        //       left = b2x;
        //       top = b1y;
        //     }
        //   } else {
        //     if (e2y > e1y) {
        //       direction = 'rightBottom';
        //       b1x = e1x - e1w / 2 + 20;
        //       b1y = e2y + 20;
        //       b2x = e2x + e2w / 2 - 20;
        //       b2y = e2y - 20;
        //       left = b2x;
        //       top = b2y;
        //     } else {
        //       direction = 'rightTop'
        //       b1x = e1x - e1w / 2 - 20;
        //       b1y = e1y - 20;
        //       b2x = e2x + e2w / 2 - 20;
        //       b2y = e2y + 20;
        //       left = b2x;
        //       top = b1y;
        //     }
        //   }
        // } else {
        //   if (e1x + e1w / 2 > e2x - e2w / 2) {
        //     if (e2y > e1y) {
        //       direction = 'topLeft';
        //       b1x = e1x - 20;
        //       b1y = e1y + e1h / 2 - 20;
        //       b2x = e2x + 20;
        //       b2y = e2y - e2h / 2 + 20;
        //       left = b1x;
        //       top = b1y;
        //     } else {
        //       direction = 'bottomLeft';
        //       b1x = e1x - 20;
        //       b1y = e1y - e1h / 2 + 20;
        //       b2x = e2x + 20;
        //       b2y = e2y + e2h / 2 - 20;
        //       left = b1x;
        //       top = b2y;
        //     }
        //   } else {
        //     if (e2y > e1y) {
        //       direction = 'leftBottom';
        //       b1x = e1x + e1w / 2 - 20;
        //       b1y = e1y + 20;
        //       b2x = e2x - e2w / 2 + 20;
        //       b2y = e2y - 20;
        //       left = b1x;
        //       top = b2y;
        //     } else {
        //       direction = 'leftTop';
        //       b1x = e1x + e1w / 2 - 20;
        //       b1y = e1y - 20;
        //       b2x = e2x - e2w / 2 + 20;
        //       b2y = e2y + 20;
        //       left = b1x;
        //       top = b1y;
        //     }
        //   }
        // }
        return {
          direction: direction,
          b1x: b1x,
          b1y: b1y,
          b2x: b2x,
          b2y: b2y,
          left: left,
          top: top
        }
      },
      connectByLine: function (elem1, elem2) {
        // 计算中心点距离
        let e1x = elem1.offsetLeft + elem1.clientWidth / 2;
        let e1y = elem1.offsetTop + elem1.clientHeight / 2;
        let e1w = elem1.clientWidth;
        let e1h = elem1.clientHeight;
        let e2x = elem2.offsetLeft + elem2.clientWidth / 2;
        let e2y = elem2.offsetTop + elem2.clientHeight / 2;
        let e2w = elem2.clientWidth;
        let e2h = elem2.clientHeight;
        // 获取两个元素之间的关系
        let pointer = this.getLinePointerSize(e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h);

        let boxStyle = {
          width: Math.abs(pointer.b1x - pointer.b2x) + "px",
          height: Math.abs(pointer.b1y - pointer.b2y) + "px",
          display: "absolute",
          left: pointer.left + "px",
          top: pointer.top + "px",
          background :"rgba(0,0,0,0.5)",
        };
        console.log("pointer1","x:",e1x,"y:",e1y,"w",e1w,"h",e1h);
        console.log("pointer2","x:",e2x,"y:",e2y,"w",e2w,"h",e2h);
        console.log(pointer);
        console.log(boxStyle);

        let line = {
          boxStyle: boxStyle
        };
        // let boxWidth = Math.abs(e1x - e2x) - e1w/2 - e2w/2 + 40

        // let boxWidth = elem2x - elem1x + 40;
        // let boxHeight = elem2y - elem1y + 40;
        // let boxStyle = {
        //   width : boxWidth + "px",
        //   height : boxHeight + "px",
        //   display:"absolute",
        //   left : elem1x - 20 + "px",
        //   top : elem1y - 20 + "px"
        // };
        // let curve2 = (elem2x - elem1x)*0.67 + " " + (elem2y - elem1y)/3;
        // let curve1 = (elem2x - elem1x)/3 + " " + (elem2y - elem1y)*0.67;
        // console.log(elem2.offsetTop);
        // console.log(elem2.clientHeight);
        // let d = "M20 20 C" + curve1 + "," + curve2 + "," + elem2x  + " " + elem2y;
        // let line = {
        //   boxStyle : boxStyle,
        //   d : d
        // };
        // console.log(line);
        this.lineList.push(line);
      },
      onLongTap: function (event) {
        // console.log(event.target.offsetTop)
        // console.log(event.target.clientWidth)
        console.log("click");
        // console.log("longtap");
        this.startElem = event.target;
        // this.startX = event.target.offsetLeft + event.target.clientWidth; // 起始x坐标
        // this.startY = event.target.offsetTop + event.target.clientHeight/2; // 起始y坐标
        this.isLongTap = true;
        //
        // this.pointerStyle = {
        //   display:"block",
        //   left:this.startX + "px",
        //   top:this.startY + "px"
        // }
        // window.onmousewheel=document.onmousewheel=this.mouseScroll;
        // console.log(event);
      },
      aaa: function () {
        var path = document.querySelector("path")
        dynamics.animate(path, {
          d: "M20 20 C40 100, 100 40, 120 120 ",

        }, {
          type: dynamics.easeInOut,
          duration: 1,
        })
      }
    }

  }
</script>

<style scoped>
  svg {
    /*position: absolute;*/
  }

  .point1 {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 100px;
    top: 100px;
    background: red;
  }

  .point2 {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 200px;
    top: 100px;
    background: red;
  }
  .point3 {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 200px;
    top: 200px;
    background: red;
  }

  /*path {*/
  /*marker-end: url(#Triangle);*/
  /*}*/

  .line-box {
    position: absolute;
  }

  .line-box path {
    stroke-width: 3px;
    stroke: #acacac;
    marker-end: url(#Triangle);
  }
</style>
