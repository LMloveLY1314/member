import request from "../util/request";

/**
 *
 * 查询维修师傅详情列表
 * */
export  function  getRepairList(params) {
    return request({
        url:'consumer/repair/list',
        method:'post',
        params
    })

}


/**
 *
 * 添加收藏
 * */
export  function  addCollection(params) {
    return request({
        url:'consumer/repair/collection/add',
        method:'post',
        params
    })

}


/**
 *
 * 移除收藏
 * */
export  function  removeCollection(params) {
    return request({
        url:'consumer/repair/collection/remove',
        method:'post',
        params
    })

}
/**
 *
 * 获得一个师傅详细
 * */
export  function  getRepairDetail(repair_id) {
    return request({
        url:`consumer/repair/detail/${repair_id}`,
        method:'post',
    })

}
