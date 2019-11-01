import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取楼层信息列表
 * @Date: 2019/6/28
 **/
export function getFloorInfoList(Params) {
  return request({
    url: '/floors/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取指定建筑的楼层列表(下拉菜单)
 * @Date: 2019/6/28
 **/
export function getFloorList(Params) {
  return request({
    url: '/floors/index2',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加楼层
 * @Date: 2019/6/28
 **/
export function addFloor(Params) {
  return request({
    url: '/floors/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的楼层
 * @Date: 2019/6/28
 **/
export function deleteFloor(Params) {
  return request({
    url: '/floors/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的楼层信息
 * @Date: 2019/6/28
 **/
export function updateFloor(Params) {
  return request({
    url: '/floors/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
