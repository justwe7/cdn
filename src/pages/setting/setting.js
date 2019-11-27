const app = getApp()
const db = wx.cloud.database()
const _ = db.command

const tplMsg = {
  thing5: {value: '任务标题'},
  date1: {value: '2019-10-22'},
  thing3: {value: '今晚打老虎'}
}
const tplId = 'lpT7pYMb_irS75lxytdtb1JbhyTR75noRtbFST-DZwk'

Page({
  data: {
    taskDetail: {},
    isPush: false
  },
  onShow(option) {},
  onLoad(option) {
  },
  onChange({ detail }) {
    this.setData({ isPush: detail })
  },
  onSubscribe: function(e) {
    // 调用微信 API 申请发送订阅消息
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
                data: tplMsg,
                templateId: tplId,
              },
            })
            .then(() => {
              wx.showToast({
                title: '订阅成功',
                icon: 'success',
                duration: 2000,
              });
            })
            .catch(() => {
              wx.showToast({
                title: '订阅失败',
                icon: 'success',
                duration: 2000,
              });
            });
        }
      },
    });
  }
})
