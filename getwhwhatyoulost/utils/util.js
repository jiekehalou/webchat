const dayjs = require('dayjs')
const formatTime = (date,type='YYYY-MM-DD HH:mm:ss') => {
 return  dayjs(date).format(type) //2019-03-06T08:00:00+08:00
}



module.exports = {
  formatTime: formatTime
}