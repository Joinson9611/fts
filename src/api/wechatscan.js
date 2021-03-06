import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export function getReportInfo(params) {
  return request({
    url: '/projects/wechatscan',
    method: 'post',
    data: qs.stringify(params)
  })
}
