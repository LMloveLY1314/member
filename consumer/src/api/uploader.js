import request from "../util/request";

/**
 * 文件上传API
 * */

/**上传*/
export function uploader(params) {
    return request({
        url:'localhost:7003/uploaders',
        method:'post',
        params
    })

}

/**删除*/
