import request from "../util/request";



/**维修师傅评论列表 */
export   function commentOrder(params) {
    return request({
        url: `consumer/repair/comment/${params.repair_id}`,
        method: 'post',
        params
    })
}
