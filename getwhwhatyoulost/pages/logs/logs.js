//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    nameInput: '',
    ageInput: '',
    loading: [false, false, false, false], //增删改查
    logs: [],
    curId: ''
  },
  cloudInit() {
    // 页面初始化时，确保云环境已初始化（在 app.js 中）
    // 如果还没初始化，在 app.js 的 onLaunch 中添加：
    wx.cloud.init({
      env: 'cloud1-0gf20vi35a83c542' // 在云开发控制台可查看
    })
  },
  handelDel() {
    let {
      curId
    } = this.data
    if (!curId) {
      wx.showToast({
        title: '请选中一条数据',
        icon: 'none'
      });
      return;
    }

    this.setData({
      'loading[1]': true
    })
    // 调用云函数
    let id = curId || this.data.logs[0]?._id
    console.log('handelDel', id)
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        id,
        TYPE: "delete", //add update delete 默认''查询
      },
      success: (res) => {
        this.setData({
          'loading[1]': false
        })
        this.handleQuery()
      },
      fail: (err) => {
        this.setData({
          'loading[1]': false
        })
        console.error('调用失败：', err)
      }
    })
  },
  handleUpdate() {
    let {
      curId
    } = this.data
    if (!curId) {
      wx.showToast({
        title: '请选中一条数据',
        icon: 'none'
      });
      return;
    }
    let {
      nameInput,
      ageInput
    } = this.data
    this.setData({
      'loading[2]': true
    })
    // 调用云函数
    let id = curId || this.data.logs[0]?._id
    console.log('更新', id)
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        id,
        name: nameInput || '测试更新',
        age: ageInput || 25,
        createTime: new Date().toISOString(),
        TYPE: "update", //add update delete 默认''查询
      },
      success: (res) => {
        this.setData({
          'loading[2]': false
        })
        this.handleQuery()
      },
      fail: (err) => {
        this.setData({
          'loading[2]': false
        })
        console.error('调用失败：', err)
      }
    })
  },
  handleQuery() {
    this.setData({
      'loading[3]': true
    })
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
          logs: arr.map(o => ({
            ...o,
            createTimeFormat: new Date(o.createTime).toISOString().slice(0, 16).replace('T', ' ')
          }))
        })
        this.setData({
          'loading[3]': false
        })
      },
      fail: (err) => {
        this.setData({
          'loading[3]': false
        })
        console.error('调用失败：', err)
      }
    })
  },
  handleAdd() {
    this.setData({
      'loading[0]': true
    })
    let {
      nameInput,
      ageInput
    } = this.data
    // 调用云函数
    wx.cloud.callFunction({
      name: 'helloWorld', // 云函数名称
      data: { // 传递给云函数的参数
        name: nameInput||'测试数据',
        age: ageInput || 25,
        TYPE: "add", //add update delete
      },
      success: (res) => {
        // console.log('云函数返回结果：', res.result)
        this.setData({
          'loading[0]': false
        })
        this.handleQuery()
        // res.result 就是云函数 return 的数据
      },
      fail: (err) => {
        this.setData({
          'loading[0]': false
        })
        console.error('调用失败：', err)
      }
    })
  },
  onRowTap(ev) {
    let {
      field
    } = ev.currentTarget.dataset || {}
    let {
      curId
    } = this.data
    this.setData({
      curId: curId === field ? '' : field || ''
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