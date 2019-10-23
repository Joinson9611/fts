export function getNowFormatDate() {
  const date = new Date()
  const seperator1 = '-'
  const seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
  return currentdate
}

export function FormatDateTime(time, format = 'yyyy-MM-dd HH:mm:ss') {
  let fmt = format
  time = new Date(time)
  const o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'H+': time.getHours(), // 小时
    'h+': time.getHours() % 12, // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function FormatTime(time) {
  let fmt = 'HH:mm:ss'
  time = new Date(time)
  const o = {
    'H+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds() // 秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function add0(m) { return m < 10 ? '0' + m : m }

/**
 * @Description: 时间戳转yyyy-MM-dd HH:mm:ss
 * @Date: 2019/5/24
 **/
export function Formattimestamp(timestamp) {
// shijianchuo是整数，否则要parseInt转换
  const time = new Date(timestamp * 1000)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  const h = time.getHours()
  const mm = time.getMinutes()
  const s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

/**
 * @Description: 时间戳转yyyy-MM-dd
 * @Date: 2019/5/24
 **/
export function Formattimestamp2(timestamp) {
  // shijianchuo是整数，否则要parseInt转换
  const time = new Date(timestamp * 1000)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  return y + '-' + add0(m) + '-' + add0(d)
}

/**
 * @Description: 时间戳转yyyy-MM-dd HH:mm
 * @Date: 2019/5/31
 **/
export function Formattimestamp3(timestamp) {
  // shijianchuo是整数，否则要parseInt转换
  const time = new Date(timestamp * 1000)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  const h = time.getHours()
  const mm = time.getMinutes()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
}
