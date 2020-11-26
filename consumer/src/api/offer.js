import request from "../util/request";

/**
 * 获取报价列表
 * */

export   function getOfferList(params) {
    return request({
        url: 'consumer/offer/list',
        method: 'post',
        params
    })
}
/**
 * 同意或拒绝报价
 * */
export   function handleOffer(params) {
    return request({
        url: `consumer/offer/handle/${params.id}`,
        method: 'get',
        params
    })
}

