<template>
  <div id="timeline" ref="container" class="timeline-container">
    <div class="timeline-header">{{lineInfo.title}}</div>
    <div class="timeline-body">
      <!-- 时间轴-横向 -->
      <table class="timeline-timetable timeline-horizontal">
        <thead>
        <tr>
          <th colspan="2" class="scale-major">\时间</th>
          <template v-for="item in dateList">
            <th v-bind:colspan="item.medium.length * 2" class="scale-major">{{item.tagName}}</th>
          </template>
        </tr>
        <tr>
          <th colspan="2" class="scale-medium">分类\</th>
          <template v-for="item in dateList">
            <template v-for="m in item.medium">
              <th colspan="2" v-bind:id="m.tag" v-bind:start="m.start" v-bind:end="m.end" class="scale-medium">{{m.tagName}}</th>
            </template>
          </template>
        </tr>
        </thead>
      </table>
      <!-- 事件 -->
      <div class="timeline-events">
        <!-- 事件节点 -->
        <template v-for="item in lineInfo.historyList">
          <div class="timeline-cate" v-bind:tag="item.cateId">
            <div v-for="node in item.line" v-bind:id="'node'+node.historyId"  class="timeline-node timeline-event-pointer" v-bind:time="node.time" v-bind:tag="node.title"></div>
          </div>
        </template>
        <!--<div class="timeline-node timeline-event-pointer"></div>-->
        <!--<div class="timeline-node timeline-event-pointer"></div>-->
        <!--<div class="timeline-node timeline-event-pointer"></div>-->
      </div>
      <!-- 事件连线 -->
      <canvas class="timeline-line-canvas"></canvas>
      <!-- 时间轴-纵向 -->
      <table class="timeline-timetable timeline-vertical">
        <tbody>
        <tr>
          <th class="scale-small scale-cate">
            <div v-for="cate in lineInfo.cateList">
              {{cate.cateName}}
            </div>
          </th>
          <template v-for="item in dateList">
            <template v-for="m in item.medium">
              <th colspan="2" class="scale-small"><span class="spacer-cell"></span></th>
            </template>
          </template>
          <!--<td class="scale-small">-->
          <!--<span class="spacer-cell"></span>-->
          <!--</td>-->
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>

  // import axios from 'axios'

  import data from 'static/json/timeline.json'

  var initScale = 1
  export default {
    name: "Timeline",
    data() {
      return {
        initScale: 1,

        lineInfo: data,
        dateList :[],
      }
    },

    mounted() {
      this.dateList = this.calculateDateLineByHistoryList(this.lineInfo.historyList)
      this.$nextTick(function(){
        let that = this
        for(let i = 0 ; i < that.lineInfo.historyList.length ; i++){
          for(let j = 0 ; j < that.lineInfo.historyList[i].line.length ; j++){
            that.calculateNode(that.lineInfo.historyList[i].line[j])
          }

        }
      })

      // console.log(this.$refs)
      // console.log(this.dateList)
      // let time = -4388000000
      // console.log(this.calculateRange(time))
      // time = -2388000000
      // console.log(this.calculateRange(time))
      // time = 2388000000
      // console.log(this.calculateRange(time))
      // time = -2378000000
      // console.log(this.calculateRange(time))
      // time = -2378040000
      // console.log(this.calculateRange(time))
      // time = 2378040000
      // console.log(this.calculateRange(time))
      // time = -2378010100
      // console.log(this.calculateRange(time))
      // time = 221011200
      // console.log(this.calculateRange(time))
      // time = -2210112013;
      // console.log(this.calculateRange(time));
      // time = 2210112023;
      // console.log(this.calculateRange(time));
    },
    computed: {},
    methods: {
      calculateNode : function(node){
        // this.$refs.
        for(let i = 0 ; i < this.dateList.length ; i++){
          for(let j = 0 ; j < this.dateList[i].medium.length ; j++){
            let item = this.dateList[i].medium[j]
            if(parseInt(node.time) === item.tag){
              let timeTag = document.getElementById(""+item.tag)
              let nodeTag = document.getElementById("node"+node.historyId)
              nodeTag.style.left = timeTag.offsetLeft + 23 + "px"
            }
          }
        }
        // console.log(node)
      },
      calculateRange: function (time) {
        // 四舍五入方案
        // -999亿到-100亿，100亿一个单位
        // -100亿到-1亿，10亿一个单位
        // -1亿到到-1000万，1000万一个单位
        // -1000万到-100万，100万一个单位
        // -100万到-10万，10万一个单位
        // -10万到-1万，1万一个单位
        // -1万到-5001年，500年一个单位
        // -5000年到-3001年，200年一个单位
        // -3000年以后，如果精确到年，则10年一个单位，100年一个组
        // 如果精确到月，则1月一个单位，12个月一个组
        // 如果精确到日，则2天一个单位，31天一个组，
        // 如果精确到时，则2小时一个单位，24小时一个组
        let year = Math.pow(10, 6);
        if (time > -5000 * year && time < -3001 * year) {
          // 计算上下区间，200年一个单位
          let n = time / year;
          let obj = this.calStartAndEnd(-5000, 200, n);
          return {
            start: obj.start * year,
            end: (obj.end - 1) * year,
            range: -5000 * year
          }
        }
        if (time > -3000 * year) {
          if (this.jingquezhi(time) === 1) {
            // -3000年以后，如果精确到年，则10年一个单位，100年一个组
            let range = time > 0 ? Math.floor(time/(year*100)) * year * 100
              : Math.ceil(time/(year * 100) - 1) * year * 100;
            let start = Math.floor((time - range)/(year * 10)) * year * 10 + range
            let end = start + 9*year
            return {
              start : start,
              end : end,
              range : range
            }
          } else if (this.jingquezhi(time) === 2) {
            // 如果精确到月，则1月一个单位，12个月一个组
            let range = time > 0 ? Math.floor(time / year) * year + 10000 : Math.ceil(time / year) * year - 10000
            return {
              start: time,
              end: time,
              range: range
            }
          } else if (this.jingquezhi(time) === 3) {
            // 如果精确到日，则2天一个单位，31天一个组，
            let range = time > 0 ? Math.floor(time / 10000) * 10000 + 100 : Math.ceil(time / 10000) * 10000 - 100
            // let range = Math.ceil(time/10000) * 10000 + (time > 0 ? 100 : -100);
            let start = 0
            let end = 0
            if (time > 0) {
              start = time % 200 === 0 ? time - 100 : time;
              end = time % 200 === 0 ? time : time + 100;
            } else {
              start = time % 200 === 0 ? time + 100 : time;
              end = time % 200 === 0 ? time : time - 100
            }
            return {
              start: start,
              end: end,
              range: range
            }
          } else if (this.jingquezhi(time) === 4) {
            // 如果精确到时，则2小时一个单位，24小时一个组
            let range = time > 0 ? Math.floor(time / 100) * 100 + 1 : Math.ceil(time / 100) * 100 - 1
            let start = 0
            let end = 0
            if (time > 0) {
              start = time % 2 === 0 ? time - 1 : time;
              end = time % 2 === 0 ? time : time + 1;
            } else {
              start = time % 2 === 0 ? time + 1 : time;
              end = time % 2 === 0 ? time : time - 1
            }
            return {
              start: start,
              end: end,
              range: range
            }
          }
        }

      },
      calStartAndEnd: function (range, delta, time) {
        let start = Math.floor((time - range) / delta) * delta + range;
        let end = start + delta;
        return {
          start: start,
          end: end,
        }
      },
      compareDate: function (x, y) {
        if (x < 0 && y < 0) {
          let dx = x + Math.ceil(x / 100000) * 100000;
          let dy = y + Math.ceil(y / 100000) * 100000;
          if (x + dx > y + dy) {
            return 1  // 年份较大
          } else if (x + dx < y + dy) {
            return -1
          } else {
            // 年份相同，则比较月份
            if (dx > dy) {
              return -1
            } else if (dx < dy) {
              return 1
            } else {
              return 0
            }
          }
        } else {
          if (x > y) {
            return 1
          } else if (x < y) {
            return -1
          } else {
            return 0
          }
        }
      },
      calculateDateLineByHistoryList: function (hl) {
        let dateList = []
        // let hl = this.lineInfo.historyList
        // 将数据插入到dateList
        for (let i = 0; i < hl.length; i++) {
          for (let j = 0; j < hl[i].line.length; j++) {
            dateList.push(hl[i].line[j].time)
          }
        }
        // console.log(dateList)
        // 排序
        let that = this;
        dateList.sort(function (x, y) {
          x = parseInt(x);
          y = parseInt(y);
          return that.compareDate(x, y)
        });

        let list = []
        // 开始计算时间轴
        for (let i = 0; i < dateList.length; i++) {
          let date = parseInt(dateList[i]);
          let obj = this.calculateRange(date)
          let isExist = false;
          for (let j = 0; j < list.length; j++) {
            let tmp = list[j];
            if (tmp.range === obj.range) {
              isExist = true;
              tmp.medium.push({
                start: obj.start,
                end: obj.end,
                tag: date,
                tagName : this.getTagName(date),
              });
              tmp.end = obj.end;
              let name = this.getFullName(obj.end)
              if(name !== tmp.tagName){
                tmp.tagName = this.getFullName(obj.start)+ "至"+this.getFullName(obj.end)
              }


              break
            }
          }
          if (!isExist) {
            let n = {
              tagName: this.getFullName(obj.range),
              start: obj.start,
              end: obj.end,
              range: obj.range,
              medium: [
                {
                  start: obj.start,
                  end: obj.end,
                  tag: date,
                  tagName : this.getTagName(date)
                }
              ]
            };
            list.push(n)
          }
        }
        return list
        // console.log(list)
      },
      jingquezhi: function (date) {
        let d = date % 1000000;
        if (d === 0) {
          return 1    // 年
        }
        d = d % 10000;
        if (d === 0) {
          return 2  // 月
        }
        d = d % 100;
        if (d === 0) {
          return 3  // 日
        }
        return 4 // 时
      },
      getTagName : function(time){
        var j = this.jingquezhi(time)
        if(j === 1){
          // 年
          let year = time > 0 ? Math.floor(time / Math.pow(10,6)) : Math.ceil(time/Math.pow(10,6))
          if(year < 0) {
            year = "BC"+(-year)
          }
          return year+"年"
        }else if(j === 2){
          // 月
          let str = String(time)
          let res =  str.substring(str.length - 6,str.length - 4)
          return res + "月";
        }else if(j === 3){
          // 日
          let str = String(time)
          let res =  str.substring(str.length - 4,str.length - 2)
          return res + "日";
        }else if(j === 4){
          let str = String(time)
          let res =  str.substring(str.length - 2,str.length)
          return res + "时";
        }
      },
      getFullName : function(time){
        // return time
        var j = this.jingquezhi(time)
        if(j === 1 || j === 2){
          let year = time > 0 ? Math.floor(time / Math.pow(10,6)) : Math.ceil(time/Math.pow(10,6))
          if(year < 0) {
            year = "BC"+(-year)
          }
          return year+"年"
        }else if(j === 3){
          let str = String(time)
          let year = str.substring(0, str.length - 6)
          let res =  str.substring(str.length - 6,str.length - 4)
          return year + "年"+res + "月";
        }else if(j === 4){
          let str = String(time)
          let year = str.substring(0, str.length - 6)
          let month = str.substring(str.length - 6, str.length - 4)
          let res =  str.substring(str.length - 4,str.length - 2)
          return year+"年"+month+"月"+res + "日";
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../static/css/timeline.css';

</style>
