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
              <th colspan="2" v-bind:id="m.tag" v-bind:startYear="m.startYear" v-bind:startDate="m.startDate" v-bind:endYear="m.endYear" v-bind:endDate="m.endDate" class="scale-medium">{{m.tagName}}</th>
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
            <div v-for="node in item.line" v-bind:id="'node'+node.historyId" v-bind:year="node.year" v-bind:date="node.date"  class="timeline-node timeline-event-pointer"  v-bind:tag="node.title"></div>
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

  import DateUtil from 'static/js/date-util.js'
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
      // let time = {year:-4388,date:0};
      // console.log(this.calculateRange(time));
      // time = {year:-2388,date:0};
      // console.log(this.calculateRange(time));
      // time = {year:2388,date:0};
      // console.log(this.calculateRange(time));
      // time = {year:-2378,date:0};
      // console.log(this.calculateRange(time));
      // time = {year:-2378,date:40000};
      // console.log(this.calculateRange(time));
      // time = {year:2378,date:40000};
      // console.log(this.calculateRange(time));
      // time = {year:-2378,date:10100};
      // console.log(this.calculateRange(time));
      // time = {year:221,date:123000};
      // console.log(this.calculateRange(time));
      // time = {year:-221,date:112013};
      // console.log(this.calculateRange(time));
      // time = {year:221,date:112023};
      // console.log(this.calculateRange(time));
    },
    computed: {},
    methods: {
      calculateNode : function(node){
        // this.$refs.
        for(let i = 0 ; i < this.dateList.length ; i++){
          for(let j = 0 ; j < this.dateList[i].medium.length ; j++){
            let item = this.dateList[i].medium[j]
            if(node.year >= item.startYear && node.year <= item.endYear && node.date >= item.startDate && node.date <= item.endDate){
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
        // let year = Math.pow(10, 6);
        // console.log(time);
        let rangeYear = 0;
        let rangeDate = 0;
        let startYear = 0;
        let startDate = 0;
        let endYear = 0;
        let endDate = 0;
        if (time.year >= -5000 && time.year < -3001) {
          // -5000年到-3001年，200年一个单位
          // let n = time.year / 100;
          rangeYear = -5000;
          startYear = -5000 + Math.floor((time.year - rangeYear)/200) * 200;
          endYear = startYear + 199
        }else if (time.year > -3000){
          if (time.date === 0) {
            // -3000年以后，如果精确到年，则10年一个单位，100年一个组
            rangeYear = Math.floor(time.year/100) * 100;
            startYear = Math.floor(time.year/10) * 10;
            endYear = startYear + 9;
          }else if(time.date%10000 === 0){
            // 如果精确到月，则1月一个单位，12个月一个组
            rangeYear = time.year;
            rangeDate = 10000;
            startYear = time.year;
            startDate = 10000;
            endYear = time.year;
            endDate = 120000;
          }else if(time.date%100 === 0){
            // 如果精确到日，则2天一个单位，31天一个组，
            let month = Math.floor(time.date/10000);
            rangeYear = time.year;
            rangeDate = Math.floor(time.date/10000) * 10000 + 100;

            startYear = time.year;
            startDate = time.date%200 === 0 ? time.date - 100 : time.date;
            endYear = time.year;
            endDate = startDate + 100;
            let lastDate =  month * 10000 + DateUtil.getLastDay(time.year,month) * 100;
            if(endDate > lastDate){
              endDate = lastDate
            }
          }else{
            // 如果精确到时，则2小时一个单位，24小时一个组
            rangeYear = time.year;
            rangeDate = Math.floor(time.date/100) * 100;
            startYear = time.year;
            startDate = time.date%2 === 0 ? time.date : time.date - 1
            endYear = time.year;
            endDate = startDate + 1
          }
        }
        return {
          rangeYear : rangeYear,
          rangeDate : rangeDate,
          startYear : startYear,
          startDate : startDate,
          endYear : endYear,
          endDate : endDate,
        }
      },
      compareDate: function (x, y) {
        if(x.year > y.year){
          return 1
        }else if(x.year < y.year){
          return -1
        }else{
          if(x.date > y.date){
            return 1
          }else if(x.date < y.date){
            return -1
          }else{
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
            dateList.push({
              year : hl[i].line[j].year,
              date : hl[i].line[j].date
            })
          }
        }
        console.log(dateList)
        // 排序
        let that = this;
        dateList.sort(function (x, y) {
          return that.compareDate(x, y)
        });
        console.log("sort",dateList)
        let list = []
        // 开始计算时间轴
        for (let i = 0; i < dateList.length; i++) {
          let time = dateList[i];
          let medium = this.calculateRange(time); // 要插入的数据
          let isMajorExist = false;
          for (let j = 0; j < list.length; j++) {
            let major = list[j];    // 范围Item
            // 如果再同一年同一个日期范围内，则插入到列表中
            if (major.rangeYear === medium.rangeYear && major.rangeDate === medium.rangeDate) {
              isMajorExist = true;
              let isMediumExist = false;
              for(let j = 0 ; j < major.medium.length ; j++){
                let m = major.medium[j];
                if(m.startYear === medium.startYear && m.startDate === medium.startDate){
                  isMediumExist = true;
                  break;
                }
              }
              if(!isMediumExist){
                medium.tag = this.getTag(medium);
                medium.tagName = this.getMediumTagName(medium)
                major.medium.push(medium);
                // 更改范围tagName
                major.endYear = medium.endYear;
                major.endDate = medium.endDate;
                major.tagName = this.getMajorTagName(major)
                break
              }
            }
          }
          // 如果找不到，则插入到新建major
          if (!isMajorExist) {
            let major = {
              tagName: this.getMajorTagName(medium),
              rangeYear: medium.rangeYear,
              rangeDate: medium.rangeDate,
              startYear: medium.startYear,
              startDate: medium.startDate,
              endYear: medium.endYear,
              endDate: medium.endDate,
              medium : [],
            };
            medium.tag = this.getTag(medium);
            medium.tagName = this.getMediumTagName(medium)
            major.medium.push(medium)
            list.push(major)
          }
        }
        console.log(list)
        return list;

      },
      getTag(time){
        let year = time.startYear;
        let date = time.startDate;
        let len = date.toString().length;
        while(len < 6){
          date = "0" + date;
          len++;
        }
        return year + date;
      },
      getMajorTagName(major){
        let startStr = "";
        let endStr = ""
        startStr = this.getMajorTagNameByTime(major.startYear,major.startDate);
        endStr = this.getMajorTagNameByTime(major.endYear,major.endDate);
        if(startStr === endStr){
          return startStr
        }else{
          return startStr + "至" + endStr
        }
      },
      getMediumTagName(medium){
        return this.getMediumTagNameByTime(medium.startYear,medium.startDate)
        // return this.getTagName(medium.startYear,1) + this.getTagName(medium.startDate,3,1)
      },
      getMediumTagNameByTime(year,date){
        if(date === 0){
          if(year < 0){
            return "BC" + (-year) + "年"
          }else{
            return year + "年"
          }
        }else{
          let month = Math.floor(date/10000);
          date = date - month * 10000;
          let day = Math.floor(date/100);
          date = date - day * 100;
          let hour = date
          if(hour !== 0){
            return hour + ":00"
          }else if(day !== 0){
            return day + "日"
          }else if(month !== 0){
            return month + "月"
          }
        }
      },
      getMajorTagNameByTime(year,date){
        let str = ""
        if(year < 0){
          str += "BC" + (-year)
        }else{
          str += year
        }
        let month = Math.floor(date/10000);
        date = date - month * 10000;
        let day = Math.floor(date/100);
        date = date - day * 100;
        let hour = date
        if(hour !== 0 && day !== 0 && month !== 0) {
          str += "/"+month + "/" + day
        }else if(hour === 0 && day !== 0 && month !== 0){
          str += "/"+month
        }
        return str
      },
    }
  }
</script>

<style scoped>
  @import '../../static/css/timeline.css';

</style>
