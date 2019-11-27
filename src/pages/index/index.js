//index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { formatDate, subscribe } = require('../../common/js/utils.js')


Page({
  data: {
    checked: false,
    isFocus: false,
    newtask: '',
    inputBottom: 0,
    taskGroup: [
      {
        title: '今日',
        expand: true,
        taskList: []
      },
      {
        title: '明日',
        expand: false,
        taskList: [
          {
            task: '今晚打老虎',
            done: false
          }
        ]
      },
      {
        title: '以后的事',
        expand: false,
        taskList: []
      }
    ],
    // todayTaskList: ,
    /* taskList: [
      {
        task: '今晚打老虎',
        done: false
      },
      {
        task: '今晚打产品',
        done: true
      }
    ], */
    tipTimeIdx: -1,
    headHeight: app.globalData.headHeight,
    capsuleHeight: app.globalData.screenConfig.capsuleHeight,
    statusBarHeight: app.globalData.screenConfig.statusBarHeight,
    quickTip: [
      '睡前22:00',
      '明早08:00',
      '以后再说'
    ],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.fetchList()
    app.getUserOpenIdViaCloud()
      .then(openid => {
        console.log(openid)
      })
      .catch(err => {
        console.error(err)
      })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getOpenId() {
    wx.login({
      success: res => {
        // Vue.prototype.$openid = res.code;
        wx.request({
          url: `${self.baseUrl}/applet/getOpenId`,
          data: { jsCode: res.code },
          success(res) {
            /* if (data.result != 200 ) {
            } */
            const openid = JSON.parse(res.data.data).openid
            self.setKxUserInfo(openid)
            Vue.prototype.$openid = openid
            getApp().globalData.openid = openid
            if (getApp().globalData.userOpenIDReadyCallback) {
              getApp().globalData.userOpenIDReadyCallback(openid)
            }
            self.initClubInfo(option)
            self.setUserAuthState()
          },
          fail(err) {
            wx.showToast({ title: '接口请求出错', icon: 'none' })
          }
        })
      },
      fail: err => {}
    })
  },
  handleAddItemTask(e) {
    this.setData({
      isFocus: true
    })
  },
  openFn(e) {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: e.detail.formId,
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '发送成功',
          content: '请返回微信主界面查看',
          showCancel: false,
        })
        wx.showToast({
          title: '发送成功，请返回微信主界面查看',
        })
        this.setData({
          templateMessageResult: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },
  handleSetTipTime(e) {
    const {currentTarget: {dataset: { idx }}} = e
    this.setData({
      tipTimeIdx: idx
    })
  },
  onfocus: function(e) {
    e.detail.height && this.setData({
      inputBottom: e.detail.height
    })
  },
  onblur() {
    // this.isFocus = false;
    // this.inputBottom = 0;
    this.setData({
      inputBottom: 0
    })
  },
  fetchList() {
    const groups = {
      list1: +new Date(`${GetDateStr()} 23:59:59`),
      list2: +new Date(`${GetDateStr(1)} 23:59:59`),
    }
    console.log(`${GetDateStr()} 23:59:59`, `${GetDateStr(1)} 23:59:59`)
    db.collection('demo').where({
      remindDate: _.lt(groups.list1)
    })
    .get({
      success: (res) => {
        console.log(res.data)
        const list = `taskGroup[0].taskList`
        this.setData({
          [list]: res.data
        })
      }
    })
    db.collection('demo').where({
      remindDate: _.lt(groups.list2).and(_.gte(groups.list2))
    })
    .get({
      success: (res) => {
        const list = `taskGroup[1].taskList`
        this.setData({
          [list]: res.data
        })
      }
    })
    db.collection('demo').where({
      remindDate: _.gte(groups.list2).or(_.eq(''))
    })
    .get({
      success: (res) => {
        const list = `taskGroup[2].taskList`
        this.setData({
          [list]: res.data
        })
      }
    })
    db.collection('demo').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res.data)
    })
  },
  handleAddTask() {
    const date = new Date()
    const quickTime = [
      +new Date(`${GetDateStr()} 22:00:00`),
      +new Date(`${GetDateStr(1)} 08:00:00`),
      ''
    ]
    const taskDateIdx = this.data.tipTimeIdx > -1 ? this.data.tipTimeIdx : this.data.taskGroup.length-1
    const curTaskList = `taskGroup[${taskDateIdx}].taskList`
    db.collection('demo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        task: this.data.newtask,
        createDate: +date,
        remindDate: quickTime[taskDateIdx],
        content: '',
        // notice: this.data.tipTimeIdx>1, // 是否小程序提醒
        done: false
      },
      success: (res) => {
        console.log(res._id)
        const tplMsg = {
          thing5: {value: this.data.newtask},
          date1: {value: formatDate(quickTime[taskDateIdx])},
          thing3: {value: '未设置详情'}
        }
        subscribe({message: tplMsg, isNotice: this.data.tipTimeIdx>1, taskId: res._id})
        this.setData({
          [curTaskList]: [...this.data.taskGroup[taskDateIdx].taskList, {
            task: this.data.newtask,
            _id: res._id,
            done: false
          }],
          tipTimeIdx: -1,
          newtask: ""
        })
      }
    })
  },
  onInput(e) {
    this.setData({
      newtask: e.detail
    })
  },
  handleExpand(e) {
    const {currentTarget: {dataset: { idx }}} = e
    const curList = `taskGroup[${idx}].expand`
    this.setData({
      [curList]: !this.data.taskGroup[idx].expand
    })
  },
  onChange(e) {
    // target 触发事件的源组件。
// currentTarget 事件绑定的当前组件。
    const {currentTarget: {dataset: { idx, group, id }}, detail} = e
    const curState = `taskGroup[${group}].taskList[${idx}].done`
    console.log(id)
    db.collection('demo').doc(id).update({
      data: {
        done: detail
      },
      success: (res) => {
        console.log(res)
        this.setData({
          [curState]: detail
        })
      }
    })
    // this.data.taskList[idx].done = detail
    
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})


function GetDateStr(AddDayCount = 0) {
  const dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  const y = dd.getFullYear();
  const m = dd.getMonth()+1;//获取当前月份的日期
  const d = dd.getDate();
  return `${y}/${m}/${d}`;
}