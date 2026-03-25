//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })

    // 页面初始化时，确保云环境已初始化（在 app.js 中）
// 如果还没初始化，在 app.js 的 onLaunch 中添加：
wx.cloud.init({
  env: 'cloud1-0gf20vi35a83c542'  // 在云开发控制台可查看
})

// 调用云函数
wx.cloud.callFunction({
  name: 'helloWorld',  // 云函数名称
  data: {              // 传递给云函数的参数
    name: '张三',
    age: 25
  },
  success: (res) => {
    console.log('云函数返回结果：', res.result)
    // res.result 就是云函数 return 的数据
  },
  fail: (err) => {
    console.error('调用失败：', err)
  }
})
  }
})
