//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {a: 1}
    
    try {
      const screenConfig = {};
      const res = wx.getSystemInfoSync();
      const { windowWidth, windowHeight, platform, statusBarHeight, model } = res;
    
      screenConfig.pixelRate = windowWidth / 750;
      screenConfig.platform = platform; // 运行平台
      screenConfig.statusBarHeight = statusBarHeight; // 状态高度
      if (platform.toLowerCase() === "devtools") {
        screenConfig.capsuleHeight = 44;
      }
      if (platform.toLowerCase() === "android") {
        screenConfig.capsuleHeight = 48;
      }
      screenConfig.headHeight = (screenConfig.capsuleHeight + screenConfig.statusBarHeight) //包括状态及标题内容整个paddingtop hack
      if (statusBarHeight >= 44) {
        screenConfig.isHighHead = true; //刘海
      }
      if (windowHeight > 750) screenConfig.isAllScreen = true; // 屏幕比例 >16:9
      screenConfig.systemHeight = windowHeight;
      this.globalData.isIphoneX = model.indexOf("iPhone X") > -1;
      this.globalData.screenConfig = screenConfig;
      this.globalData.headHeight = screenConfig.headHeight;
    } catch (e) {}

  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  }
})
