import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getUserID } from '@/utils/auth'
import { getNowFormatDate } from '@/utils/time'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['term_type'] = '0'
    config.headers['request_time'] = getNowFormatDate()
    if (store.getters.token) {
      config.headers['token'] = getToken()
      config.headers['user_id'] = getUserID()
    } else {
      config.headers['token'] = ''
      config.headers['user_id'] = ''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // 返回类型为Blob时，不处理直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    const res = response.data

    // 服务端返回的响应码不等于1的时候显示错误提示
    if (res.code !== '1') {
      if (res.code !== '10001' && res.code !== '10002') {
        Message({
          message: res.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
      // 用户未登录或者token已过期或者token错误等情况
      if (res.code === '10001' || res.code === '10002' || res.code === '10004') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('logout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

