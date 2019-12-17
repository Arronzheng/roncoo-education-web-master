import http from './method.js'

// 创建订单
export const orderSave = (params={}) => {
  return http().post('/course/auth/order/info/pay', params)
}
// 创建订单
export const orderTestSave = (params={}) => {
  return http().get('/course/auth/order/info/test/pay', params)
}
// 订单信息
export const orderInfo = (params={}) => {
  return http().post('/course/auth/order/info/view', params)
}
