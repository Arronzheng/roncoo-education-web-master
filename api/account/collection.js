import http from '../method.js'

// 添加收藏
export const setCollection = (params={}) => {
  return http().post('/course/auth/course/user/collection/add', params)
}
// 分页列出收藏列表
export const collectionList = (params={}) => {
  return http().post('/course/auth/course/user/collection/list', params)
}
// 取消收藏
export const cancelCollection = (params={}) => {
  return http().post('/course/auth/course/user/collection/cancel', params)
}

