import request from '@/utils/request'
import { headers } from '@/utils/ruoyi'

// 查询应用列表列表
export function listSpider(query) {
  return request({
    url: '/spider/list',
    method: 'get',
    params: query
  })
}

// 查询应用列表详细
export function getSpider(id) {
  return request({
    url: '/spider/get',
    method: 'get',
    params: {'id': id}
  })
}

// 新增应用列表
export function addSpider(data) {
  return request({
    url: '/spider/create',
    method: 'post',
    data: data,
    headers: headers
  })
}

// 修改应用列表
export function updateSpider(id, data) {
  return request({
    url: '/spider/update',
    method: 'post',
    params: {'id': id},
    data: data,
    headers: headers
  })
}

// 删除应用列表
export function delSpider(ids) {
  return request({
    url: '/spider/delete',
    method: 'post',
    data: ids,
    headers: headers
  })
}