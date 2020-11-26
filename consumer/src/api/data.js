import request from "../util/request";


/**
 * 获取myprofile的统计数据
 */
export function data() {
    return request({
        url: 'consumer/data/num',
        method: 'get',
    })
}
