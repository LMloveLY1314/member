import request from "../util/request";


/**
 * 获取公告集合
 * */

export function  getNoticeList(params) {
    return request({
        url: 'consumer/notice',
        method: 'post',
        params
    })
}



/**
 * 查看公告详情
 * */

export function  noticeDetail(params) {
    return request({
        url: `consumer/notice/${id}`,
        method: 'post',
        params
    })
}

/**
* 获取最新公告
* */

export function  newNotice() {
    return request({
        url: 'consumer/notice/new',
        method: 'post',
    })
}
