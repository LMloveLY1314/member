
//系统消息相关
import request from '@/utils/request'


/**
 * 获取公告集合
 * */

export function  getNoticeList(params) {
    return request({
        url: 'admin/system/notice',
        method: 'post',
        loading: false,
        params
    })
}

/**
 * 删除公告
 * */

export function  deleteNotice(id) {
    return request({
        url: `admin/system/notice/delete/${id}`,
        method: 'post',
        loading: false,
    })
}

/**
 * 发布公告
 * */

export function  addNotice(data) {
    return request({
        url: `admin/system/notice/add`,
        method: 'post',
        loading: false,
        data
    })
}

/**
 * 发布公告
 * */

export function  getNoticeById(param) {
  return request({
    url: `admin/system/notice/${param}`,
    method: 'get',
    loading: false,
  })
}
