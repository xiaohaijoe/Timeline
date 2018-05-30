<template>
  <div id="pointerLayout" class="pointer-layout">
    <!--<div class="box1" id="box1" v-finger:press-move="pressMove.bind(this)">-->
    <!--<div class="point1" id="point1" v-finger:long-tap="onLongTap" v-finger:tap="onTap"-->
    <!--&gt;</div>-->
    <!--</div>-->
    <!--<div class="point2" id="point2" v-finger:long-tap="onLongTap" v-finger:tap="onTap"-->
    <!--v-finger:press-move="pressMove.bind(this)"></div>-->
    <!--<div class="point3" id="point3" v-finger:long-tap="onLongTap" v-finger:tap="onTap"-->
    <!--v-finger:press-move="pressMove.bind(this)"></div>-->
    <!--<div class="point4" id="point4" v-finger:long-tap="onLongTap" v-finger:tap="onTap"-->
    <!--v-finger:press-move="pressMove.bind(this)"></div>-->
    <div v-bind:id="line.id" class="pointer-box" v-for="line in lineList" v-bind:style="line.boxStyle">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path v-bind:d="line.d" stroke-width="1.5" stroke="black" fill="none"/>
        </g>
      </svg>
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
    name: "Pointer",
    data() {
      return {
        isLongTap: false,
        startElem: null,
        lineList: [],
      }
    },
    mounted() {
      // let el = document.getElementById("point1");
      // Transform(el);
      // this.lineList = this.pointerList
      // console.log(this.pointerList);

    },
    watch: {},
    methods: {
      init: function (pointerList) {
        // console.log(33213213);
        this.lineList.splice(0);
        // this.pointerList.splice(0);
        this.pointerList = pointerList
        for (let i = 0; i < this.pointerList.length; i++) {
          let pointer = this.pointerList[i];
          let line = this.makeLine(pointer.elem1, pointer.elem2)
          this.lineList.push(line)
        }
      },
      refreshPointer: function (id, pointerList) {
        this.pointerList = pointerList;
        if (id === "eventLayout") {
          // 刷新所有连接线
          for (let i = 0; i < this.pointerList.length; i++) {
            let pointer = this.pointerList[i];
            this.moveByLine(pointer.elem1, pointer.elem2, i)
          }
        } else {
          // 刷新nodeId关联的线
          for (let i = 0; i < this.pointerList.length; i++) {
            let pointer = this.pointerList[i];
            let tags = pointer.tag.split("_");
            if (tags[1] === id) {
              this.moveByLine(pointer.elem1, pointer.elem2, i)
            }
          }
        }
      },
      hidePointer: function () {
        this.lineList.splice(0)
        this.pointerList.splice(0)
      },
      pressMove: function (evt) {
        let obj = evt.target;
        // console.log(obj.id)
        let left = obj.offsetLeft + evt.deltaX;
        let top = obj.offsetTop + evt.deltaY;
        obj.style.left = left + "px";
        obj.style.top = top + "px";

        let elem1 = null;
        let elem2 = null;
        for (let i = 0; i < this.lineList.length; i++) {
          let line = this.lineList[i];
          let ids = line.id.split("_")
          if (obj.id === ids[0]) {
            elem1 = obj;
            elem2 = document.getElementById(ids[1]);
            this.moveByLine(elem1, elem2, i)
          } else if (obj.id === ids[1]) {
            elem1 = document.getElementById(ids[0]);
            elem2 = obj;
            this.moveByLine(elem1, elem2, i)
          }
        }
        evt.preventDefault();
      },
      onTap: function (event) {
        console.log("tap")
        if (this.isLongTap) {
          console.log("connect");
          // 如果是长按时间，则用svg path将两个节点连接起来
          let startElem = this.startElem;
          let endElem = event.target;
          this.connectByLine(startElem, endElem);
          this.isLongTap = false;
        }
      },
      countBezierPoint: function (sx, sy, ex, ey, direction) {
        let p1x, p1y, p2x, p2y = 0;
        if (direction === 'topLeft' || direction === 'topRight') {
          p1x = sx;
          p1y = ey + Math.abs(sy - ey) / 3;
          p2x = ex;
          p2y = sy - Math.abs(sy - ey) / 3;
        } else if (direction === 'rightBottom' || direction === 'rightTop') {
          p1x = ex - Math.abs(sx - sy) / 3;
          p1y = sy;
          p2x = sx + Math.abs(sx - sy) / 3;
          p2y = ey;
        } else if (direction === 'bottomRight' || direction === 'bottomLeft') {
          p1x = sx;
          p1y = ey - Math.abs(sy - ey) / 3;
          p2x = ex;
          p2y = sy + Math.abs(sy - ey) / 3;
        } else if (direction === 'leftTop' || direction === 'leftBottom') {
          p1x = ex + Math.abs(sx - ex) / 3;
          p1y = sy;
          p2x = sx - Math.abs(sx - ex) / 3;
          p2y = ey;
        }

        return {
          p1x: p1x,
          p1y: p1y,
          p2x: p2x,
          p2y: p2y,
        }
      },
      getLinePointerSize: function (e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h) {
        let direction = 'none';
        let b1x, b1y, b2x, b2y = 0;
        let left, top = 0;
        let sx, sy, ex, ey = 0;
        if (e1x > e2x) {
          // e2 在 e1 左边界
          if (e1y - e1h / 2 > e2y + e2h / 2) {
            // e1上边界 > e2下边界
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
          } else if (e1y + e1h / 2 < e2y - e2h / 2) {
            // e1下边界 < e2上边界
            // e2 在 e1 下方偏左
            direction = 'bottomLeft';
            b1x = e1x + 20;
            b1y = e1y + e1h / 2 - 20;
            b2x = e2x - 20;
            b2y = e2y - e2h / 2 + 20;
            left = b2x;
            top = b1y;
            sx = b1x - b2x - 20;
            sy = 20;
            ex = 20;
            ey = b2y - b1y - 20;
          } else if (e1y > e2y) {
            // e2 在 e1 上方
            // e2 在 e1 左边偏上
            direction = 'leftTop';
            b1x = e1x - e1w / 2 + 20;
            b1y = e1y + 20;
            b2x = e2x + e2w / 2 - 20;
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
            b1x = e1x - e1w / 2 + 20;
            b1y = e1y - 20;
            b2x = e2x + e2w / 2 - 20;
            b2y = e2y + 20;
            left = b2x;
            top = b1y;
            sx = b1x - b2x - 20;
            sy = 20;
            ex = 20;
            ey = b2y - b1y - 20;
          }
        } else {
          // e2 在 e1右边
          if (e1y - e1h / 2 > e2y + e2h / 2) {
            // e1 右边界 > e2 左边界
            // e2 在 e1 上方偏右
            direction = 'topRight'
            b1x = e1x - 20;
            b1y = e1y - e1h / 2 + 20;
            b2x = e2x + 20;
            b2y = e2y + e2h / 2 - 20;
            left = b1x;
            top = b2y;
            sx = 20;
            sy = b1y - b2y - 20;
            ex = b2x - b1x - 20;
            ey = 20;
          }else if(e1y + e1h/2 < e2y - e2h/2){
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
          }else if(e1y > e2y){
            // e2 在 e1 右方偏上
            direction = 'rightTop';
            b1x = e1x + e1w / 2 - 20;
            b1y = e1y + 20;
            b2x = e2x - e2w / 2 + 20;
            b2y = e2y - 20;
            left = b1x;
            top = b2y;
            sx = 20;
            sy = b1y - b2y - 20;
            ex = b2x - b1x - 20;
            ey = 20;
          }else{
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
        // if (e1x > e2x) {
        //   // e2 在 e1 左边边
        //   if (e1x - e1w / 2 < e2x + e2w / 2) {
        //     // e1左边界 < e2右边界
        //     if (e1y > e2y) {
        //       // e1 下边界 > e2 上边界
        //       // e2 在 e1 上方偏左
        //       direction = 'topLeft';
        //       b1x = e1x + 20;
        //       b1y = e1y - e1h / 2 + 20;
        //       b2x = e2x - 20;
        //       b2y = e2y + e2h / 2 - 20;
        //       left = b2x;
        //       top = b2y;
        //       sx = b1x - b2x - 20;
        //       sy = b1y - b2y - 20;
        //       ex = 20;
        //       ey = 20;
        //     } else {
        //       // e2 在 e1 下方偏左
        //       direction = 'bottomLeft';
        //       b1x = e1x + 20;
        //       b1y = e1y + e1h / 2 - 20;
        //       b2x = e2x - 20;
        //       b2y = e2y - e2h / 2 + 20;
        //       left = b2x;
        //       top = b1y;
        //       sx = b1x - b2x - 20;
        //       sy = 20;
        //       ex = 20;
        //       ey = b2y - b1y - 20;
        //     }
        //   } else {
        //     // e1左边界 > e2 右边界
        //     if (e1y > e2y) {
        //       // e2 在 e1 左边偏上
        //       direction = 'leftTop';
        //       b1x = e1x - e1w / 2 + 20;
        //       b1y = e1y + 20;
        //       b2x = e2x + e2w / 2 - 20;
        //       b2y = e2y - 20;
        //       left = b2x;
        //       top = b2y;
        //       sx = b1x - b2x - 20;
        //       sy = b1y - b2y - 20;
        //       ex = 20;
        //       ey = 20;
        //     } else {
        //       // e2 在 e1 左边偏下
        //       direction = 'leftBottom'
        //       b1x = e1x - e1w / 2 + 20;
        //       b1y = e1y - 20;
        //       b2x = e2x + e2w / 2 - 20;
        //       b2y = e2y + 20;
        //       left = b2x;
        //       top = b1y;
        //       sx = b1x - b2x - 20;
        //       sy = 20;
        //       ex = 20;
        //       ey = b2y - b1y - 20;
        //     }
        //   }
        // } else {
        //   // e2 在 e1 右边
        //   if (e1x + e1w / 2 > e2x - e2w / 2) {
        //     // e1 右边界 > e2 左边界
        //     if (e1y > e2y) {
        //       // e2 在 e1 上方偏右
        //       direction = 'topRight'
        //       b1x = e1x - 20;
        //       b1y = e1y - e1h / 2 + 20;
        //       b2x = e2x + 20;
        //       b2y = e2y + e2h / 2 - 20;
        //       left = b1x;
        //       top = b2y;
        //       sx = 20;
        //       sy = b1y - b2y - 20;
        //       ex = b2x - b1x - 20;
        //       ey = 20;
        //     } else {
        //       // e2 在 e1 下方偏右
        //       direction = 'bottomRight'
        //       b1x = e1x - 20;
        //       b1y = e1y + e1h / 2 - 20;
        //       b2x = e2x + 20;
        //       b2y = e2y - e2h / 2 + 20;
        //       left = b1x;
        //       top = b1y;
        //       sx = 20;
        //       sy = 20;
        //       ex = b2x - b1x - 20;
        //       ey = b2y - b1y - 20;
        //     }
        //   } else {
        //     // e1 右边界 < e2 左边界
        //     if (e1y > e2y) {
        //       // e2 在 e1 右方偏上
        //       direction = 'rightTop';
        //       b1x = e1x + e1w / 2 - 20;
        //       b1y = e1y + 20;
        //       b2x = e2x - e2w / 2 + 20;
        //       b2y = e2y - 20;
        //       left = b1x;
        //       top = b2y;
        //       sx = 20;
        //       sy = b1y - b2y - 20;
        //       ex = b2x - b1x - 20;
        //       ey = 20;
        //     } else {
        //       // e2 在 e1 右方偏下
        //       direction = 'rightBottom';
        //       b1x = e1x + e1w / 2 - 20;
        //       b1y = e1y - 20;
        //       b2x = e2x - e2w / 2 + 20;
        //       b2y = e2y + 20;
        //       left = b1x;
        //       top = b1y;
        //       sx = 20;
        //       sy = 20;
        //       ex = b2x - b1x - 20;
        //       ey = b2y - b1y - 20;
        //     }
        //   }
        // }
        let pb = this.countBezierPoint(sx, sy, ex, ey, direction)
        return {
          direction: direction,
          b1x: b1x,
          b1y: b1y,
          b2x: b2x,
          b2y: b2y,
          left: left,
          top: top,
          sx: sx,
          sy: sy,
          ex: ex,
          ey: ey,
          pb: pb,
        }
      },
      moveByLine: function (elem1, elem2, index) {
        let line = this.makeLine(elem1, elem2);
        this.lineList.splice(index, 1, line)
      },
      connectByLine: function (elem1, elem2) {
        let line = this.makeLine(elem1, elem2);
        this.lineList.push(line);
      },
      makeLine: function (elem1, elem2) {
        // 计算中心点距离
        // console.log(elem1)
        // console.log(elem1.offsetLeft);
        // console.log(elem1.offsetTop);
        let eLeft1 = elem1.offsetLeft;
        let eTop1 = elem1.offsetTop;
        let eLeft2 = elem2.offsetLeft;
        let eTop2 = elem2.offsetTop;
        let elem11 = elem1;
        let elem22 = elem2;
        while (elem11 = elem11.offsetParent) {
          eLeft1 += elem11.offsetLeft;
          eTop1 += elem11.offsetTop;
        }
        while (elem22 = elem22.offsetParent) {
          eLeft2 += elem22.offsetLeft;
          eTop2 += elem22.offsetTop;
        }
        let e1x = eLeft1 + elem1.clientWidth / 2;
        let e1y = eTop1 + elem1.clientHeight / 2;
        let e1w = elem1.clientWidth;
        let e1h = elem1.clientHeight;
        let e2x = eLeft2 + elem2.clientWidth / 2;
        let e2y = eTop2 + elem2.clientHeight / 2;
        let e2w = elem2.clientWidth;
        let e2h = elem2.clientHeight;
        // console.log(e1x,e1y,e1w,e1h);
        // console.log(e2x,e2y,e2w,e2h);
        // 获取两个元素之间的关系
        let p = this.getLinePointerSize(e1x, e1y, e1w, e1h, e2x, e2y, e2w, e2h);

        let boxStyle = {
          width: Math.abs(p.b1x - p.b2x) + "px",
          height: Math.abs(p.b1y - p.b2y) + "px",
          left: p.left + "px",
          top: p.top + "px",
        };
        // console.log("pointer1", "x:", e1x, "y:", e1y, "w", e1w, "h", e1h);
        // console.log("pointer2", "x:", e2x, "y:", e2y, "w", e2w, "h", e2h);
        // console.log(p);
        // console.log(boxStyle);

        let d = 'M' + p.sx + " " + p.sy + " C" + p.pb.p1x + " " + p.pb.p1y + "," + p.pb.p2x + " " + p.pb.p2y + "," + p.ex + " " + p.ey
        let line = {
          boxStyle: boxStyle,
          d: d,
          id: elem1.id + "_" + elem2.id,
        };
        return line
      },
      onLongTap: function (event) {
        this.startElem = event.target;
        this.isLongTap = true;
      },
    }

  }
</script>

<style scoped>
  .pointer-box {
    position: absolute;
    z-index: 5;
    pointer-events: none;
  }

  .pointer-layout path {
    stroke-width: 3px;
    stroke: #acacac;
    marker-end: url(#Triangle);
  }
</style>
