import Vue from 'vue'

const VueVideoPlayer = require('vue-video-player/dist/ssr')
const hls = require('videojs-contrib-hls')
Vue.use(hls)
Vue.use(VueVideoPlayer)
