// pages/index/index.js
Page({
  data: {
    mouseX: 0,
    mouseY: 0
  },

  onLoad() {
    console.log('页面加载');
  },

  onReady() {
    console.log('页面渲染完成');
  },

  onShow() {
    console.log('页面显示');
  },

  onHide() {
    console.log('页面隐藏');
  },

  onUnload() {
    console.log('页面卸载');
  },

  // 触摸移动事件（替代鼠标移动）
  onTouchMove(e) {
    const touch = e.touches[0];
    const windowInfo = wx.getWindowInfo();
    const mouseX = touch.clientX / windowInfo.windowWidth - 0.5;
    const mouseY = touch.clientY / windowInfo.windowHeight - 0.5;
    
    this.setData({
      mouseX: mouseX,
      mouseY: mouseY
    });
  }
});
