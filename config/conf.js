if (process.env.NODE_ENV == 'development') { //开发环境
  module.exports =  {
    title: '知码在线',
    baseUrl: 'http://127.0.0.1:5840/#'   //java项目接口地址
  }
}else if (process.env.NODE_ENV == 'testing') {  //测试环境
  module.exports =  {
    title: '知码在线',
    baseUrl: 'http://127.0.0.1:5840/api/'  //java项目接口地址
  }
}else {
  module.exports =  {   //默认生产环境
    title: '知码在线',
    baseUrl: 'http://127.0.0.1:5840/#'   //java项目接口地址
  }
}
