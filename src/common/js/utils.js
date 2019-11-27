function formatDate(date, fmt) {
  fmt = fmt || "YYYY-MM-DD HH:mm:ss";
  if (!date) {
    return "";
  }
  if (typeof date === "string") {
    date = new Date(date.replace(/-/g, "/"));
  }
  if (typeof date === "number") {
    date = new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1,
    "D+": date.getDate(),
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  var week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? "\u661f\u671f"
          : "\u5468"
        : "") + week[date.getDay() + ""]
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

const subscribe = ({message, taskId = "", isNotice = true}) => {
  const tplId = 'lpT7pYMb_irS75lxytdtb1JbhyTR75noRtbFST-DZwk' // 暂时就这一种模板消息 后期如有需求改为可配置
  
  /* const tplMsg = {
    thing5: {value: '任务标题'},
    date1: {value: '2019-10-22'},
    thing3: {value: '今晚打老虎222'}
  } */

  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [tplId],
      fail(err) {
        console.log(err)
      },
      success(res) {
        // 申请订阅成功
        console.log(res)
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          // 这里将订阅的课程信息调用云函数存入云开发数据
          wx.cloud
            .callFunction({
              name: 'subscribe',
              data: {
                message: message,
                isNotice: isNotice,
                taskId: taskId,
                templateId: tplId,
              },
            })
            .then(() => {
              wx.showToast({
                title: '订阅成功',
                icon: 'success',
                duration: 2000,
              });
              resolve()
            })
            .catch(() => {
              wx.showToast({
                title: '订阅失败',
                icon: 'none',
                duration: 2000,
              });
            });
        }
      },
    });
  })
}

module.exports = {
  formatDate: formatDate,
  subscribe: subscribe
}