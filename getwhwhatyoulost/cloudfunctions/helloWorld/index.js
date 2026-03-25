// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
// 获取数据库引用
const db = cloud.database({
  env: 'cloud1-0gf20vi35a83c542'
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 查询数据
  let response = {}
  let {
    TYPE,
    id,
    ...other
  } = event || {};
  switch (TYPE) {
    case 'add':
      // 新增数据
      response = await db.collection('logs').add({
        data: {
          name: event.name,
          age: event.age,
          createTime: db.serverDate() // 服务器时间
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        }
      })


      break;
    case 'update':
      // 更新数据
      try {
        // 使用 await，结果通过返回值获取
        const response = await db.collection('logs')
          .doc(id)
          .update({
            data: {
              ...other
            }
          })
        // response 结构：{ stats: { updated: 1 } }
        if (response.stats.updated > 0) {
          // console.log('更新成功')
        }
      } catch (err) {
        // console.error('更新失败', err)
      }
      break
    case 'delete':
      // 更新数据
      try {
        // 使用 await，结果通过返回值获取
        const response = await db.collection('logs')
          .doc(id)
          .remove()
        if (response.stats.updated > 0) {
          // console.log('删除成功')
        }
      } catch (err) {
        console.error('删除失败', err)
      }
      break
    default:
      response = await db.collection('logs')
        .get()
      break;
  }






  return response

  // const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}