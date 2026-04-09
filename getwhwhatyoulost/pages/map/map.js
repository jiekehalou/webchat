// pages/map/map.js
import {
  KEY,BAIDUKEY
} from "../../config/index.js"

const {
  windowHeight
} = wx.getDeviceInfo()
const menuRect = wx.getMenuButtonBoundingClientRect()
const sheetHeight = (windowHeight - menuRect.height) * 0.5
console.log('KEY', KEY)
console.log('BAIDUKEY', BAIDUKEY)
// console.log('menuRect:', menuRect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: "",
    latitude: 39.9,
    longitude: 116.38,
    menuRect,
    sheetHeight,
    minSize: 0.3,
    maxSize: 0.5,
    tarPosition: {
      latitude: 33.62,
      longitude: 113.37,
    },
    weatherInfo: {

    },
    markers: [

    ],
    polylines: [{
      points: [{
        longitude: 113.67739,
        latitude: 34.75381,
      }, {
        longitude: 112.67739,
        latitude: 34.75381,
      }],
      color: '#58c16c',
      width: 6,
      borderColor: '#2f693c',
      borderWidth: 1
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log('onLoad')
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
  //小程序调用返回的数据格式不一样，使用的是差值结果
  drawCarLines(res) {
    let {tarPosition} = this.data
    var _this = this
    wx.request({
      // url: 'https://api.map.baidu.com/direction/v2/driving',//百度
      url: 'https://apis.map.qq.com/ws/direction/v1/driving',//腾讯
      method: 'GET',
      data: {
        // ak: BAIDUKEY,
        // origin: `${this.data.latitude},${this.data.longitude}`,
        // destination:`${tarPosition.latitude},${tarPosition.longitude}`,
        key: KEY,
        from: `${this.data.latitude},${this.data.longitude}`,
        to:`${tarPosition.latitude},${tarPosition.longitude}`,
        // waypoints=39.111,116.112;39.112,116.113 //途经点
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let {
          result:{routes}
        } = res.data
        let route = routes[0]
        // console.log('routes:',routes)
        // console.log('polyline:',route.polyline)

        var coors = route.polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        _this.setData({
          // 将路线的起点设置为地图中心点
          // latitude:pl[0].latitude,
          // longitude:pl[0].longitude,
          // 绘制路线
          polylines: [{
            points: pl,
            color: '#58c16c',
            width: 6,
            borderColor: '#2f693c',
            borderWidth: 1
          }]
        })
        // let {
        //   realtime = []
        // } = result
        // let d = (realtime || [])[0] || {}
        // self.setData({
        //   weatherInfo: d
        // })
      }
    })


  },
  addMark(res) {
    let {
      longitude: lon,
      latitude: lat
    } = res
    console.log('lon', lon)
    console.log('lat', lat)

    let markers = [{
        id: Date.now(),
        latitude: lat,
        longitude: lon,
        iconPath: "/images/pin.png",
        width: 48,
        height: 48,
        callout: {
          content: `当前位置`,
          display: 'ALWAYS',
          color: '#333',
          fontSize: 14,
          borderWidth: 2,
          borderRadius: 10,
          bgColor: '#fff',
          padding: 5,
        }
      },
      {
        id: Date.now(),
        ...this.data.tarPosition,
        iconPath: "/images/pin.png",
        width: 48,
        height: 48,
        callout: {
          content: `目的地`,
          display: 'ALWAYS',
          color: '#333',
          fontSize: 14,
          borderWidth: 2,
          borderRadius: 10,
          bgColor: '#fff',
          padding: 5,
        }
      }
    ]
    console.log('markers', markers)
    this.setData({
      markers: markers
    }, () => {
      console.log(this.data)
    })
  },
  onMapClick(e) {
    const {
      latitude,
      longitude
    } = e.detail;
    // his.reverseGeocode(latitude, longitude); // 调用逆地理编码
    console.log(longitude, latitude, )
    console.log('onMapClick', e)
  },
  reverseGeocode(lat, lng) {
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=您的KEY`,
      success: (res) => {
        console.log('详细地址:', res.data.result.address);
      },
      fail:(res)=>{
        wx.showToast({
          title: res.message|| '规划失败',
          icon: 'error'
        });
      }
    });
  },

  async getPosition() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('res', res)
        var latitude = res.latitude // 纬度
        var longitude = res.longitude // 经度
        console.log("positionInfo", res)
        this.setData({
          longitude,
          latitude
        }, () => {
          this.addMark(res)
          this.getWeather()
          this.drawCarLines(res)
        })
      },
      fail: (err) => {
        console.error('获取位置失败', err);
        this.setData({
          longitude: null,
          latitude: null,
        })
      }
    })
  },
  onSearch(e) {
    let {
      searchInput
    } = this.data;
    console.log('onSearch', searchInput)
  }
})