import http from '../method.js'

// 用户通知
export const userMsgList = (params={}) => {
  return http().post('/system/auth/msg/user/list', params)
}
// 用户通知详情
export const msgView = (params={}) => {
  return http().post('/system/auth/msg/view', params)
}

