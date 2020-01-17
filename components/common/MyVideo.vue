<template>
  <div id="wrapper" :style="styleObject">
<!--    <video tabindex="-1"></video>-->
  </div>
</template>
<script>
import popup from 'chimee-plugin-popup';
import Chimee from 'chimee';
import chimeePluginControlbar from 'chimee-plugin-controlbar';
import { setStore, getStore, removeStore, setSession, getSession } from '../../utils/storage'
export default {
    props: {
      playData: {
          type: Object,
          default: () => {

          }
      },
      nowNo: {
        type: String,
        default: ''
      }
    },
    data () {
        return {
          chimee: {},
          styleObject: {
            position: 'relative',
            display: 'block',
            backgroundColor: '#000',
            width: '',
            height: ''
          }
        }
    },
    watch: {
        playData: function (val) {
            this.chimee.load(this.playData.url[0])
        }
    },
    methods: {
      initVideo() {
          let $this = this
          Chimee.install(chimeePluginControlbar);
          this.chimee = new Chimee({
              wrapper: '#wrapper',
              src: this.playData.url[0],
              noDefaultContextMenu: true,
              plugins: [
                  {
                      name: chimeePluginControlbar.name,
                      children: {
                          play: {},
                          progressTime: {},
                          progressBar: {},
                          volume: {},
                          clarity: {
                              list: [
                                  {name: '超清', src: this.playData.url[1]},
                                  {name: '高清', src: this.playData.url[0]}
                              ],
                              immediate: true,
                              width: '4em'
                          },
                          playbackrate: {
                              list: [
                                  {name: '0.5', value: 0.5},
                                  {name: '1.0', value: 1, default: true},
                                  {name: '2.0', value: 2}
                              ]
                          },
                          screen: {}
                      }
                  }],
              controls: true,
          });
          this.chimee.on('loadedmetadata', function(){
              if (this.duration !== (getStore($this.nowNo)*1)) {
                this.currentTime = (getStore($this.nowNo)*1)
              }
          })
          this.chimee.on('timeupdate', function(){
              if (this.currentTime > 0) {
                setStore($this.nowNo, this.currentTime)
              }
          })
          this.chimee.on('pause', function(){

          })
      }
    },
    mounted: function () {
        let box = this.$parent.$refs.videobox
        box.style.backgroundImage = ''
        // box.style.backgroundColor = 'black'
        this.styleObject.width = box.offsetWidth + 'px'
        this.styleObject.height = box.offsetHeight > 600 ? (box.offsetHeight - 9) + 'px' : box.offsetHeight + 'px'
        this.initVideo()
    },
    updated: function() {

    }
}
</script>
<style lang="scss" scoped>
  container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
  /*#wrapper {*/
  /*  position: relative;*/
  /*  width: 1110px;*/
  /*  height: 624px;*/
  /*  display: block;*/
  /*  background-color: #000;*/
  /*}*/
</style>
