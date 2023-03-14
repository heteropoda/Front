import request from '@/utils/request'

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
    data: data
  })
}

// 修改应用列表
export function updateSpider(data) {
  return request({
    url: '/spider/update',
    method: 'post',
    data: data
  })
}

// 删除应用列表
export function delSpider(ids) {
  return request({
    url: '/spider/delete',
    method: 'post',
    data: ids
  })
}