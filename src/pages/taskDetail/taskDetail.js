//index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

var that
Page({
  data: {
    taskDetail: {},
    taskId: null,
    moreTools: false,
    formats: {},
    bottom: 0,
    readOnly: false,
    showCalendar: false,
    currentDate: '12:00',
    showTime: false,
    taskDate: '2019-11-22 09:11',
    showDialog: false,
    _taskDate: '',
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    demo1_days_style: [],
    placeholder: '开始输入...',
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onShow(option) {
    
  },
  onLoad(option) {
    this.fetchTaskDetail(option.id)
    const days_count = new Date(this.data.year, this.data.month, 0).getDate();
    let demo1_days_style = new Array;
    for (let i = 1; i <= days_count; i++) {
      if (i == 12) {
          demo1_days_style.push({
              month: 'current', day: i, color: '#314580', background: '#ffed09'
          });
      } else if (i == 16) {
          demo1_days_style.push({
              month: 'current', day: i , background: '#30558c'
          });
      } else if (i == 21) {
          demo1_days_style.push({
              month: 'current', day: i , background: '#3c5281'
          });
      } else {
          demo1_days_style.push({
              month: 'current', day: i 
          });
      }
  }
    this.setData({
        demo1_days_style
    });
    
    this.canUse = true
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })
    /* const {SDKVersion} = wx.getSystemInfoSync()

    if (compareVersion(SDKVersion, '2.7.0') >= 0) {
      //
    } else {
      this.canUse = false
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    } */
  },
  fetchTaskDetail(taskId) {
    this.setData({
      taskId
    })
    db.collection('demo').where({
      _id: (_.eq(taskId))
    })
    .get({
      success: (res) => {
        this.setData({
          taskDetail: res.data[0]
        })
        this.editorCtx.setContents({
          html: res.data[0].content
        })
        console.log(res.data[0])
      }
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  handleDelete() {
    console.log('删除任务')
  },
  handleShowDialog() {
    this.setData({
      showDialog: true
    });
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  dateChange (event) {
    console.log(event);
  },
  onConfirm(e) {
    this.data._taskDate = `${this.data._taskDate} ${e.detail}`
    this.setData({
      taskDate: this.data._taskDate
    })
    db.collection('demo').doc(this.data.taskId).update({
      // data 传入需要局部更新的数据
      data: {
        remindDate: +new Date(this.data._taskDate)
      },
      success: function(res) {
        console.log(res)
      }
    })
    this.handleCheckDate()
    this.onCancel()
  },
  onCancel(e) {
    this.setData({
      showTime: false
    })
  },
  dayClick (e) {
    const {year, month, day} = e.detail
    this.data._taskDate = `${year}-${month}-${day}`
    this.setData({
      showTime: !this.data.showTime
    })
    console.log(e.detail);
  },
  onClose() {
    this.handleCheckDate()
  },
  handleCheckDate() {
    this.setData({
      showCalendar: !this.data.showCalendar
    })
  },
  handleShowTools() {
    this.setData({
      moreTools: !this.data.moreTools
    })
  },
  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    if (!this.canUse) return
    const {name, value} = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({formats})
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success() {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success() {
        console.log('clear success')
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success() {
        that.editorCtx.insertImage({
          src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543767268337&di=5a3bbfaeb30149b2afd33a3c7aaa4ead&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20151031%2Ftooopen_sy_147004931368.jpg',
          data: {
            id: 'abcd',
            role: 'god'
          },
          success() {
            console.log('insert image success')
          }
        })
      }
    })
  },
  // 获取内容
  clickLogText(e) {
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res.html)
        console.log(this.data.taskId)
        db.collection('demo').doc(this.data.taskId).update({
          // data 传入需要局部更新的数据
          data: {
            content: res.html
          },
          success: function(res) {
            console.log(res)
          }
        })
        wx.setStorageSync("content", res.html); // 缓存本地
        // < p > 备注说明：</p > <p>1、评分规则</p> <p>2、注意事项</p> <p>3、哈哈呵呵</p> <p><br></p><p><br></p>
      }
    })
  }
})
