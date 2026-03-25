//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  cloudInit() {
    // 页面初始化时，确保云环境已初始化（在 app.js 中）
    // 如果还没初始化，在 app.js 的 onLaunch 中添加：
    wx.cloud.init({
      env: 'cloud1-0gf20vi35a83c542' // 在云开发控制台可查看
    })
  },
  handelDel() {
    // 调用云函数
    let id = this.data.logs[0]?._id
    console.log('handelDel', id)
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        id,
        TYPE: "delete", //add update delete 默认''查询
      },
      success: (res) => {
        this.handleQuery()
      },
      fail: (err) => {
        console.error('调用失败：', err)
      }
    })
  },
  handleUpdate() {
    // 调用云函数
    let id = this.data.logs[0]?._id
    console.log('更新', id)
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        id,
        name: '测试更新',
        age: Math.floor(Math.random() * 100),
        TYPE: "update", //add update delete 默认''查询
      },
      success: (res) => {
        this.handleQuery()
      },
      fail: (err) => {
        console.error('调用失败：', err)
      }
    })
  },
  handleQuery() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        TYPE: "", //add update delete 默认''查询
      },
      success: (res) => {
        // res.result 就是云函数 return 的数据
        let arr = res.result?.data || []
        this.setData({
          logs: arr
        })
      },
      fail: (err) => {
        console.error('调用失败：', err)
      }
    })
  },
  handleAdd() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        name: '张三',
        age: 25,
        TYPE: "add", //add update delete
      },
      success: (res) => {
        // console.log('云函数返回结果：', res.result)
        this.handleQuery()
        // res.result 就是云函数 return 的数据
      },
      fail: (err) => {
        console.error('调用失败：', err)
      }
    })
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return {name:util.formatTime(new Date(log))}
    //   })
    // })
    this.cloudInit()
    this.handleQuery()




  }
})