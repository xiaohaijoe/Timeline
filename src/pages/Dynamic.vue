<template>
  <div id="dynamics">
    <div class="point1" id="point1" v-finger:long-tap="onLongTap" v-finger:tap="onTap"  v-finger:press-move="pressMove.bind(this)"></div>
    <div class="point2" id="point2" v-finger:long-tap="onLongTap" v-finger:tap="onTap"></div>
    <div class="point3" id="point3" v-finger:long-tap="onLongTap" v-finger:tap="onTap"></div>
    <div class="point4" id="point4" v-finger:long-tap="onLongTap" v-finger:tap="onTap"></div>
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
  import Transform from '../../static/js/transform.js'

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
      let el = document.getElementById("point1");
      Transform(el);

    },
    methods: {
      pressMove : function(evt){
        let obj = evt.target;
        let left = obj.offsetLeft + evt.deltaX;
        let top = obj.offsetTop + evt.deltaY;
        obj.style.left = left + "px";
        obj.style.top = top + "px";

        let p2 = document.getElementById("point2");
        this.connectByLine(obj,p2)
        // this.isMoving = true
        // evt.preventDefault();
      },
      onTap: function (event) {
        console.log("tap")
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
      countBezierPoint : function(sx,sy,ex,ey,direction){
        let p1x,p1y,p2x,p2y = 0;
        if(direction === 'topLeft' || direction === 'topRight') {
          p1x = sx;
          p1y = ey + Math.abs(sy - ey) / 3;
          p2x = ex;
          p2y = sy - Math.abs(sy - ey) / 3;
        }else if(direction === 'rightBottom' || direction === 'rightTop'){
          p1x = ex - Math.abs(sx - sy) / 3;
          p1y = sy;
          p2x = sx + Math.abs(sx - sy) / 3;
          p2y = ey;
        }else if(direction === 'bottomRight' || direction === 'bottomLeft'){
          p1x = sx;
          p1y = ey - Math.abs(sy - ey)/3;
          p2x = ex;
          p2y = sy + Math.abs(sy - ey)/3;
        }else if(direction === 'leftTop' || direction === 'leftBottom'){
          p1x = ex + Math.abs(sx - ex)/3;
          p1y = sy;
          p2x = sx - Math.abs(sx - ex)/3;
          p2y = ey;
        }

        return {
          p1x : p1x,
          p1y : p1y,
          p2x : p2x,
          p2y : p2y,
        }
      },
      getLinePointerSize: function (e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h) {
        let direction = 'none';
        let b1x, b1y, b2x, b2y = 0;
        let left, top = 0;
        let sx,sy,ex,ey = 0;
        if (e1x > e2x) {
          // e2 在 e1 左边边
          if (e1x - e1w / 2 < e2x + e2w / 2) {
            // e1左边界 < e2右边界
            if (e1y > e2y) {
              // e2 在 e1 上方偏左
              direction = 'topLeft';
              b1x = e1x + 20;
              b1y = e1y - e1h / 2 + 20;
              b2x = e2x - 20;
              b2y = e2y + e2h / 2 - 20;
              left = b2x;
              top = b2y;
              sx = b1x - b2x - 20;
              sy = b1y - b2y - 20;
              ex = 20;
              ey = 20;
            } else {
              // e2 在 e1 下方偏左
              direction = 'bottomLeft';
              b1x = e1x + 20;
              b1y = e1y + e1h/2 - 20;
              b2x = e2x - 20;
              b2y = e2y - e2h/2 + 20;
              left = b2x;
              top = b1y;
              sx = b1x - b2x - 20;
              sy = 20;
              ex = 20;
              ey = b2y - b1y - 20;
            }
          } else {
            // e1左边界 > e2 右边界
            if (e1y > e2y) {
              // e2 在 e1 左边偏上
              direction = 'leftTop';
              b1x = e1x - e1w/2 + 20;
              b1y = e1y + 20;
              b2x = e2x + e2w/2 - 20;
              b2y = e2y - 20;
              left = b2x;
              top = b2y;
              sx = b1x - b2x - 20;
              sy = b1y - b2y - 20;
              ex = 20;
              ey = 20;
            } else {
              // e2 在 e1 左边偏下
              direction = 'leftBottom'
              b1x = e1x - e1w/2 +20;
              b1y = e1y - 20;
              b2x = e2x + e2w/2 - 20;
              b2y = e2y + 20;
              left = b2x;
              top = b1y;
            }
          }
        } else {
          // e2 在 e1 右边
          if (e1x + e1w / 2 > e2x - e2w / 2) {
            // e1 右边界 > e2 左边界
            if (e1y > e2y) {
              // e2 在 e1 上方偏右
              direction = 'topRight'
              b1x = e1x - 20;
              b1y = e1y - e1h/2 + 20;
              b2x = e2x + 20;
              b2y = e2y + e2h/2 - 20;
              left = b1x;
              top = b2y;
              sx = 20;
              sy = b1y - b2y - 20;
              ex = b2x - b1x - 20;
              ey = 20;
            } else {
              // e2 在 e1 下方偏右
              direction = 'bottomRight'
              b1x = e1x - 20;
              b1y = e1y + e1h / 2 - 20;
              b2x = e2x + 20;
              b2y = e2y - e2h / 2 + 20;
              left = b1x;
              top = b1y;
              sx = 20;
              sy = 20;
              ex = b2x - b1x - 20;
              ey = b2y - b1y - 20;
            }
          } else {
            // e1 右边界 < e2 左边界
            if (e1y > e2y) {
              // e2 在 e1 右方偏上
              direction = 'rightTop';
              b1x = e1x + e1w/2 - 20;
              b1y = e1y + 20;
              b2x = e2x - e2w/2 + 20;
              b2y = e2y - 20;
              left = b1x;
              top = b2y;
              sx = 20;
              sy = b1y - b2y - 20;
              ex = b2x - b1x - 20;
              ey = 20;
            } else {
              // e2 在 e1 右方偏下
              direction = 'rightBottom';
              b1x = e1x + e1w / 2 - 20;
              b1y = e1y - 20;
              b2x = e2x - e2w / 2 + 20;
              b2y = e2y + 20;
              left = b1x;
              top = b1y;
              sx = 20;
              sy = 20;
              ex = b2x - b1x - 20;
              ey = b2y - b1y - 20;
            }
          }
        }
        let pb = this.countBezierPoint(sx,sy,ex,ey,direction)
        return {
          direction: direction,
          b1x: b1x,
          b1y: b1y,
          b2x: b2x,
          b2y: b2y,
          left: left,
          top: top,
          sx : sx,
          sy : sy,
          ex : ex,
          ey : ey,
          pb : pb,
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
        let p = this.getLinePointerSize(e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h);

        let boxStyle = {
          width: Math.abs(p.b1x - p.b2x) + "px",
          height: Math.abs(p.b1y - p.b2y) + "px",
          display: "absolute",
          left: p.left + "px",
          top: p.top + "px",
          zIndex:-1,
          // background: "rgba(0,0,0,0.5)",
        };
        console.log("pointer1", "x:", e1x, "y:", e1y, "w", e1w, "h", e1h);
        console.log("pointer2", "x:", e2x, "y:", e2y, "w", e2w, "h", e2h);
        console.log(p);
        console.log(boxStyle);

        let d = 'M' + p.sx + " " + p.sy + " C" + p.pb.p1x + " " + p.pb.p1y + "," + p.pb.p2x + " " + p.pb.p2y + "," + p.ex + " " + p.ey
        let line = {
          boxStyle: boxStyle,
          d:d,
        };
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
    left: 220px;
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

  .point4 {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 120px;
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
