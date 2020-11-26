
import request from "../util/request";

/**
 * 对一个订单发起支付
 *@param sn 订单号
 *@param params  支付参数，支付模式、类型（wap、pc）
 * */

export   function initiatePay(order_sn,params) {
    return request({
        url: `order/pay/${order_sn}`,
        method: 'get',
        params
    })
}

/**发布悬赏*/
export   function newOrder(params) {
    return request({
        url: 'order/newOrder',
        method: 'post',
        params
    })
}


/**获取一个订单详情*/
export   function orderDetail(sn) {
    return request({
        url: `order/${sn}`,
        method: 'post',
    })
}

/**获得订单列表 */
export   function orderList(params) {
    return request({
        url: 'order/all',
        method: 'post',
        params
    })
}


/**获得订单状态 */
export   function getPayStatus(order_sn) {
    return request({
        url: `order/pay/status/${order_sn}`,
        method: 'post',
    })
}



/**取消订单 */
export   function cancelOrder(order_sn,reason) {
    return request({
        url: `order/cancel/${order_sn}`,
        method: 'post',
        reason
    })
}

/**确认订单,订单状态变为待支付 */
export   function confirmOrder(order_sn) {
    return request({
        url: `order/confirm/${order_sn}`,
        method: 'get',
    })
}


/**报修方发表评论 */
export   function commentOrder(params) {
    return request({
        url: `order/comment/${params.order_sn}`,
        method: 'post',
        params
    })
}


