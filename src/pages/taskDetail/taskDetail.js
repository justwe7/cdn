//index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { formatDate, subscribe } = require('../../common/js/utils.js');

const tplMsg = {
  thing5: {value: '任务标题'},
  date1: {value: '2019-10-22'},
  thing3: {value: '今晚打老虎222'}
}
const tplId = 'lpT7pYMb_irS75lxytdtb1JbhyTR75noRtbFST-DZwk'

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
    year: new Date().getFullYear(), // 年份
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    demo1_days_style: [],
    placeholder: '开始输入...'
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onShow(option) {},
  onLoad(option) {
    this.fetchTaskDetail(option.id)
    /* const days_count = new Date(this.data.year, this.data.month, 0).getDate()
    let demo1_days_style = new Array()
    for (let i = 1; i <= days_count; i++) {
      if (i == 12) {
        demo1_days_style.push({
          month: 'current',
          day: i,
          color: '#314580',
          background: '#ffed09'
        })
      } else if (i == 16) {
        demo1_days_style.push({
          month: 'current',
          day: i,
          background: '#30558c'
        })
      } else if (i == 21) {
        demo1_days_style.push({
          month: 'current',
          day: i,
          background: '#3c5281'
        })
      } else {
        demo1_days_style.push({
          month: 'current',
          day: i
        })
      }
    }
    this.setData({
      demo1_days_style
    }) */

    // this.canUse = true
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")'
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
  onSubscribe(e) {
    const isNotice = !this.data.taskDetail.notice
    const tplMsg = {
      thing5: {value: this.data.taskDetail.task},
      date1: {value: formatDate(this.data.taskDetail.remindDate)},
      thing3: {value: this.data.taskDetail.content || '未设置详情'}
    }
    console.log(tplMsg)
    if (isNotice) {
      subscribe({message: tplMsg, isNotice: true, taskId: this.data.taskId}).then(() => {
        this.setData({
          [`taskDetail.notice`]: isNotice
        })
      })
    } else {
      // subscribe({message: tplMsg, taskId: this.data.taskId})
      subscribe({message: tplMsg, taskId: this.data.taskId, isNotice: false}).then(() => {
        this.setData({
          [`taskDetail.notice`]: isNotice
        })
      })
    }
    
    // 调用微信 API 申请发送订阅消息
    /* wx.requestSubscribeMessage({
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
    }); */
  },
  handleChangeTitle(e) {
    const key = `taskDetail.task`
    db.collection('demo')
      .doc(this.data.taskId)
      .update({
        // data 传入需要局部更新的数据
        data: {
          task: e.detail.value
        },
        success: function(res) {
          console.log(res)
          this.setData({
            [key]: e.detail.value
          })
        }
      })
  },
  handleDelTask(e) {
    db.collection('demo')
      .doc(this.data.taskId)
      .remove({
        success: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '删除成功',
            duration: 1500
          })
          try {
            var pages = getCurrentPages() // 获取当前页面的页桢
            if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2]
              prePage.fetchList() // 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数，或者changeData不传形参，直接调用
              wx.navigateBack({
                delta: 1 // 返回上一页
              })
            }
          } catch (err) {}
          /* wx.redirectTo({
          url: '/pages/index/index'
        }) */
          // wx.navigateBack()
        }
      })
  },
  onChangeDetail() {
    /* const key = `taskDetail.task`
    db.collection('demo').doc(this.data.taskId).update({
      // data 传入需要局部更新的数据
      data: {
        task: e.detail.value
      },
      success: function(res) {
        console.log(res)
        this.setData({
          [key]: e.detail.value
        })
      }
    }) */
    this.editorCtx.getContents({
      success: res => {
        console.log(res.html)
        console.log(this.data.taskId)
        db.collection('demo')
          .doc(this.data.taskId)
          .update({
            // data 传入需要局部更新的数据
            data: {
              content: res.html
            },
            success: function(res) {
              console.log(res)
            },
            fail(err) {
              console.log(err)
            }
          })
      }
    })
  },
  fetchTaskDetail(taskId) {
    console.log(taskId)
    this.setData({
      taskId
    })
    db.collection('demo')
      .where({
        _id: _.eq(taskId)
      })
      .get({
        success: res => {
          this.setData({
            taskDetail: res.data[0]
          })
          setTimeout(() => {
            this.editorCtx.setContents({
              html: res.data[0].content
            })
          }, 500)
        },
        fail(err) {
          console.log(err)
        }
      })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery()
      .select('#editor')
      .context(function(res) {
        that.editorCtx = res.context
      })
      .exec()
  },
  handleDelete() {
    console.log('删除任务')
  },
  handleShowDialog() {
    this.setData({
      showDialog: true
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail
    })
  },
  dateChange(event) {
    console.log(event)
  },
  onConfirm(e) {
    this.data._taskDate = `${this.data._taskDate} ${e.detail}`
    this.setData({
      taskDate: this.data._taskDate
    })
    db.collection('demo')
      .doc(this.data.taskId)
      .update({
        // data 传入需要局部更新的数据
        data: {
          remindDate: +new Date(this.data._taskDate)
        },
        success: (res) => {
          console.log(res)
          const tplMsg = {
            thing5: {value: this.data.taskDetail.task},
            date1: {value: formatDate(this.data.taskDetail.remindDate)},
            thing3: {value: this.data.taskDetail.content || '未设置详情'}
          }
          this.setData({
            [`taskDetail.remindDate`]: +new Date(this.data._taskDate)
          })
          subscribe({message: tplMsg, isNotice: this.data.taskDetail.notice, taskId: this.data.taskId})
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
  dayClick(e) {
    const { year, month, day } = e.detail
    this.data._taskDate = `${year}-${month}-${day}`
    this.setData({
      showTime: !this.data.showTime
    })
    console.log(e.detail)
  },
  handleCloseCalendar() {
    this.handleCheckDate()
  },
  onClose() {
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
    const { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
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
    const formatDate = `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()}`
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
          src:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543767268337&di=5a3bbfaeb30149b2afd33a3c7aaa4ead&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20151031%2Ftooopen_sy_147004931368.jpg',
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
      success: res => {
        console.log(res.html)
        console.log(this.data.taskId)
        db.collection('demo')
          .doc(this.data.taskId)
          .update({
            // data 传入需要局部更新的数据
            data: {
              content: res.html
            },
            success: function(res) {
              console.log(res)
            },
            fail(err) {
              console.log(err)
            }
          })
        wx.setStorageSync('content', res.html) // 缓存本地
        // < p > 备注说明：</p > <p>1、评分规则</p> <p>2、注意事项</p> <p>3、哈哈呵呵</p> <p><br></p><p><br></p>
      }
    })
  }
})
