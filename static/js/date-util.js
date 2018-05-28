;(function () {
  function getLastDay(year,month) {
    var new_year = year;    //取当前的年份
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
    if(month>12) {
      new_month -=12;        //月份减
      new_year++;            //年份增
    }
    var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天
    return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
  }
  // export
  if(typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = {
      getLastDay : getLastDay
    }
  } else {
    window.getLastDay = getLastDay;
  }
})();
