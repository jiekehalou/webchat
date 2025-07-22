// pages/map/map.js
import {
  KEY
} from "../../config/index.js"
const bg = 'https://pic.616pic.com/bg_w1180/00/00/02/zGDDPXuN2S.jpg'

const headImg = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fd064be90-6b8c-4a6d-9721-837206fbb4a7%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1696759051&t=b90e0bf861e41c30214fc739ae66343f'
const {
  windowHeight
} = wx.getSystemInfoSync()
const menuRect = wx.getMenuButtonBoundingClientRect()
const sheetHeight = (windowHeight - menuRect.height) * 0.5
console.log('KEY', KEY)
Page({

      /**
       * 页面的初始数据
       */
      data: {
        latitude: 39.9,
        longitude: 116.38,
        menuRect,
        sheetHeight,
        minSize: 0.3,
        maxSize: 0.5,
        headImg,
        weatherInfo: {

        }
      },

      /**
       * 生命周期函数--监听页面加载
       */
      async onLoad(options) {
        await this.getPosition()
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady() {
        // this.createSelectorQuery()
        // .select(".sheet")
        // .node()
        // .exec(res => {
        //   const sheetContext = res[0].node
        //   sheetContext.scrollTo({
        //     size: 0.7,
        //     animated: true,
        //     duration: 300,
        //     easingFunction: 'ease'
        //   })
        // })
      },

      getWeather() {
        let self = this;
        wx.request({
          url: 'https://apis.map.qq.com/ws/weather/v1/',
          method: 'GET',
          data: {
            key: KEY,
            location: `${this.data.latitude},${this.data.longitude}`,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            let {
              result
            } = res.data
            let {
              realtime = []
            } = result
            let d = (realtime || [])[0] || {}
            self.setData({
              weatherInfo: d
            })
          }
        })
      },
      async getPosition() {
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
              var latitude = res.latitude // 纬度
              var longitude = res.longitude // 经度
              // console.log("positionInfo",res)
              this.setData({
                    longitude,
                    latitude
                  }, () => {
                    this.getWeather()
                  })
                },
                fail: () => {
                  this.setData({
                    longitude: null,
                    latitude: null,
                  })
                }
            })
        }
      })