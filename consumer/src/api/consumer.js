import request from "../util/request";

/**
 * 获取用户数据
 * */
export  function getUserInfo() {
    return request({
        url:'/consumer/passport/info',
        method:'get'
    })

}

/**
 * 用户更新信息
 * */
export  function editConsumer(params) {
    return request({
        url:'/consumer/passport/update',
        method:'post',
        params
    })

}

