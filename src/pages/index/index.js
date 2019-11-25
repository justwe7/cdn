//index.js
const app = getApp()

Page({
  data: {
    checked: false,
    expand: [false, false, false],
    newtask: '',
    taskGroup: [
      {
        title: '今日',
        expan: false,
        taskList: [
          {
            task: '今晚打老虎',
            finsh: true
          },
          {
            task: '今晚打产品',
            finsh: false
          }
        ]
      },
      {
        title: '明日',
        expan: false,
        taskList: [
          {
            task: '今晚打老虎',
            finsh: false
          }
        ]
      },
      {
        title: '以后的事',
        expan: false,
        taskList: []
      }
    ],
    // todayTaskList: ,
    /* taskList: [
      {
        task: '今晚打老虎',
        finsh: false
      },
      {
        task: '今晚打产品',
        finsh: true
      }
    ], */
    tipTimeIdx: -1,
    quickTip: [
      '明早08:00',
      '下周',
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
  handleSetTipTime(e) {
    const {currentTarget: {dataset: { idx }}} = e
    this.setData({
      tipTimeIdx: idx
    })
  },
  handleAddTask() {
    this.setData({
      taskList: [...this.data.taskList, {
        task: this.data.newtask,
        finsh: false
      }],
      tipTimeIdx: -1,
      newtask: ""
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
    const {currentTarget: {dataset: { idx, group }}, detail} = e
    const curState = `taskGroup[${group}].taskList[${idx}].finsh`
    // this.data.taskList[idx].finsh = detail
    this.setData({
      [curState]: detail
    })
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
