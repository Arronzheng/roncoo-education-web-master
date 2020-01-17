import http from '../method.js'

// 新增地址信息
export const saveAddress = (params={}) => {
  return http().post('/user/auth/user/address/save', params)
}
// 地址信息分页列表
export const getAddressList = (params={}) => {
  return http().post('/user/auth/user/address/list', params)
}
// 删除地址信息
export const delAddress = (params={}) => {
  return http().post('/user/auth/user/address/delete', params)
}
// 修改地址信息
export const updateAddress = (params={}) => {
  return http().post('/user/auth/user/address/update', params)
}
// 查看地址信息
export const viewAddress = (params={}) => {
  return http().post('/user/auth/user/address/view', params)
}
