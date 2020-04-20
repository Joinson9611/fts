import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取楼层信息列表
 * @Date: 2020/4/10
 **/
export function getFloorInfoList(Params) {
  return request({
    url: '/floor1s/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取指定建筑的楼层列表(下拉菜单)
 * @Date: 2020/4/10
 **/
export function getFloorList(Params) {
  return request({
    url: '/floor1s/index2',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加楼层
 * @Date: 2020/4/10
 **/
export function addFloor(Params) {
  return request({
    url: '/floor1s/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加楼层
 * @Date: 2020/3/30
 **/
export function batchAddFloor(Params) {
  return request({
    url: '/floor1s/save2',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的楼层
 * @Date: 2020/4/10
 **/
export function deleteFloor(Params) {
  return request({
    url: '/floor1s/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的楼层信息
 * @Date: 2020/4/10
 **/
export function updateFloor(Params) {
  return request({
    url: '/floor1s/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
