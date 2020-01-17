import http from './method.js'

// 评论添加
export const commentSave = (params={}) => {
  return http().post('/course/auth/courseComment/save', params)
}
// 评论删除
export const commentDelete = (params={}) => {
  return http().post('/course/auth/courseComment/delete', params)
}
