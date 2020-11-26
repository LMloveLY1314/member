import request from "../util/request";

/**
 * 获取全部分类
 * */

export  function catregoryList() {
    return request({
        url:'order/base/categorys',
        method:'get'
    })
}

/**
 * 获取全部服务类型
 * */
export  function typeList() {
    return request({
        url:'order/base/types',
        method:'get'
    })
}
