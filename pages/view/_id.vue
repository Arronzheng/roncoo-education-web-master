<template>
  <div class="course_detail">
    <y-watch-video  v-if="courseInfo.isFree || courseInfo.isPay || vipFree" :courseInfo="courseInfo" @playfunc="videoPlay" :nowNo="nowPeriodNo" :startPlay="startPlay" :playData="playData" ref="watchVideo"></y-watch-video>
    <y-display v-else :courseInfo="courseInfo" :startPlay="startPlay" :playData="playData" ref="watchVideo"></y-display>
    <div class=" detail_info detail_box clearfix">
      <div class="layout_left">
        <ul class="course_tab clearfix">
          <li :class="{on: tab == 'big'}"><a href="javascript:" @click="tab = 'big'">录播课程</a></li>
          <li :class="{on: tab == 'info'}"><a href="javascript:" @click="tab = 'info'">课程介绍</a></li>
          <li :class="{on: tab == 'talk'}"><a href="javascript:" @click="tab = 'talk'">学员讨论</a></li>
        </ul>
        <div class="content_info"  v-if="tab == 'info'">
          <div class="introduce" v-html="courseInfo.introduce"></div>
<!--          <y-syllabus @playfunc="videoPlay" :list="courseInfo.chapterList" :nowNo="nowPeriodNo"></y-syllabus>-->
        </div>
        <div class="content_info"  v-if="tab == 'big'">
          <y-syllabus @playfunc="videoPlay" :list="courseInfo.chapterList" :nowNo="nowPeriodNo" :isPay="courseInfo.isPay" :isVipFree="courseInfo.isVipFree"></y-syllabus>
        </div>
        <div class="content_info"  v-if="tab == 'talk'">
          <y-talk :list="courseInfo.courseCommentList" :nowNo="nowPeriodNo" :nowCourseId="courseInfo.id"></y-talk>
<!--          <y-talk @playfunc="videoPlay" :list="courseInfo.chapterList" :nowNo=nowPeriodNo""></y-talk>-->
        </div>
      </div>
      <div class="layout_right">
        <div class="teacher_info clearfix">
          <span class="head">讲师简介</span>
          <div class="teacher_msg">
            <div class="teacher_msg_right">
              <img class="teacher_phone" v-if="teacherInfo.headImgUrl" :src="teacherInfo.headImgUrl" alt="">
              <img class="teacher_phone" v-else src="~/assets/image/friend.jpg" alt="">
              <div class="teacher_name">
                {{teacherInfo.lecturerName}}
              </div>
              <div v-html="teacherInfo.introduce" class="info_box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YDisplay from '~/components/course/Display'
import YFooter from '~/components/common/Footer'
import YSyllabus from '~/components/course/Syllabus'
import YTalk from '~/components/course/Talk'
import YWatchVideo from '~/components/course/WatchVideo'
import {courseDetail, userCourseDetail, chapterSign, periodVideoUrl} from '~/api/course.js'
import {isVip} from '~/api/user.js'
import {periodVideo} from "../../api/account/course";
export default {
  components: {
    YFooter,
    YDisplay,
    YSyllabus,
    YWatchVideo,
    YTalk
  },
  head () {
    return {
      title: '课程详情'
    }
  },
  data () {
    return {
      tab: 'big',
      nowPeriodNo: '',  //当前播放章节
      startPlay: false,
      playData: {},
      userInfo: this.$store.state.userInfo,
      vipFree: false,
      isLogin: false
    }
  },
  validate ({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData(context) {
    let tk = context.store.state.userInfo;
    try {
      let result = new Object();
      if(context.params.tab){
        result.tab = context.params.tab
      }
      if (tk) {
        let {data} = await userCourseDetail({courseId: context.params.id}, tk);
        if (data.code == 200) {
          result.courseInfo = data.data;
          result.teacherInfo = data.data.lecturer;
          if(data.data.isVipFree === 1 && context.params.isVip){
            result.vipFree = true
          }else{
            result.vipFree = false
          }
          result.isbuy = false;
          result.isLogin = true;
        }else if (data.code >= 300 && data.code <= 400){
          // context.redirect('login');
          context.store.dispatch('REDIRECT_LOGIN')
        }else{
          result.courseInfo = null;
        }
      } else{

        let {data} = await courseDetail({courseId: context.params.id});
        console.log(data)
        console.log('info=====')
        if (data.code == 200) {
          result.courseInfo = data.data;
          result.teacherInfo = data.data.lecturer;
          result.isbuy = false;
          result.isLogin = false;
        }else{
          result.courseInfo = null;
        }
      }
      return result
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }

  },
  methods: {
    async videoPlay(data) {
        console.log(data)
        let _that = this
        let userNo = 0
        if (this.isLogin) {
            userNo = this.$store.state.userInfo.userNo
        }
        await isVip({userNo: userNo}).then(res => {
            if(res.data.code == 200){
              this.vipFree = res.data.data
              _that.isLogin = true
            }else{
              _that.isLogin = false
            }
        }).catch(() => {
            this.vipFree = false
        })
        if(!this.isLogin){
            this.$msgBox({
                content: '请先登录'
            }).then(() => {
                this.$store.dispatch('REDIRECT_LOGIN')
            }).catch(() => {
                this.$store.dispatch('REDIRECT_LOGIN')
            })
            return false;
        }
        if (this.courseInfo.isPay || data.isFree === 1 || (this.courseInfo.isVipFree === 1 && this.vipFree)) {
            window.scrollTo(0, 0)
            console.log(data)
            this.nowPeriodNo = data.id
            if (this.courseInfo.videoType === 1) {
                //保利威视播放
                chapterSign({
                    ip: 'string',
                    periodId: data.id,
                    videoVid: data.videoVid
                }).then(res => {
                    res = res.data
                    this.isResetVideo = false
                    console.log(res)
                    console.log("res==========")
                    if (res.code === 200) {
                        this.play(Object.assign({vid: data.videoVid}, res.data));
                    } else if (res.code === 402) {
                        this.$msgBox({
                            content: '购买后才可以观看',
                            isShowCancelBtn: false
                        })
                    }
                }).catch(() => {
                    this.isResetVideo = false
                })
            } else {
                //腾讯云播放
                periodVideoUrl({
                    ip: 'string',
                    periodId: data.id
                }).then(res => {
                    res = res.data
                    this.isResetVideo = false
                    if (res.code === 200) {
                        this.tencentPlay(Object.assign({}, res.data));
                    } else {
                        this.$msgBox({
                            content: '购买后才可以观看',
                            isShowCancelBtn: false
                        })
                    }
                }).catch(() => {
                    this.isResetVideo = false
                })
            }
        } else {
            this.$msgBox({
                content: '购买后才可以播放',
                isShowCancelBtn: false
            })
            return false;
        }
    },
    play (data) {
      console.log(data)
      let box = this.$refs.watchVideo.$refs.videobox;
      if (this.player) {
        this.player.changeVid({
          vid:data.vid,
          playsafe: data.token,
          ts: data.ts,
          sign: data.sign,
          autoplay: true
        });
      } else {
        this.player = polyvObject('#player').videoPlayer({
            'width': box.offsetWidth,
            'height': box.offsetHeight,
            'forceH5': true,
            'code': data.code,
            'playsafe': data.token,
            'ts': data.ts,
            'sign': data.sign,
            'vid': data.vid
        });
      }
    },
    tencentPlay (data) {
        let $this = this
        let box = this.$refs.watchVideo.$refs.videobox;
        this.startPlay = true;
        this.playData = data;
    }
    // isVip(data) {
    //     // isVip({userNo: data}).then(res => {
    //     //     this.vipFree = res.data.data
    //     // }).catch(() => {
    //     //     this.vipFree = false
    //     // })
    // }
  },
  mounted () {
    // console.log(this.courseInfo)
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.course_detail{
  .detail_info {
    margin: 20px auto 60px;
    width: 1200px;
  }
  .layout_left {
    width: 920px;
    float: left;
    .info_body {
      margin-bottom: 30px;
    }
  }
  .course_tab{
    padding-left: 30px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    li {
      float: left;
      height: 66px;
      line-height: 66px;
      margin-right: 80px;
      &.on {
        border-bottom: 2px solid #D51423;
        a {
          color: #D51423;
        }
      }
      a {
        color: #000;
        font-size: 14px;
        font-weight: 700;
        &:hover {
          text-decoration: none;
          color: #D51423;
        }
      }
    }
  }
  .content_info{
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    min-height: 400px;
    .title {
      border-left: 3px solid #000;
      padding-left: 12px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
      margin-bottom: 25px;
    }
    .introduce{
      font-size: 14px;
      line-height: 30px;
      color: #333;
      padding-left: 8px;
    }
  }
  .layout_right{
    width: 260px;
    float: right;
  }
  .teacher_info {
    background: #fff;
    border-radius: 8px;
    position: relative;
    min-height: 180px;
    .head {
      display: block;
      line-height: 60px;
      height: 60px;
      padding-left: 20px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid rgb(228, 228, 228);
    }
    .teacher_phone {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: rgb(228, 228, 228);
      text-align: center;
      line-height: 46px;
      font-size: 13px;
      color: #999;
      float:left;
      margin: 0px 10px 0 10px;
      img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
      }
    }
    .teacher_msg_right {
      width: 235px;
      float: right;
      margin: 12px 15px 12px 12px;
      line-height: 20px;
    }
    .teacher_name {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      margin-bottom: 10px;
    }
    .err_msg {
      position: relative;
      width: 100%;
      height: 250px;
      background: #000;
      opacity:0.5;
      /* filter: alpha(opacity=100); *//***针对ie8以上或者更早的浏览器****/
      background-color: transparent;
      z-index: 1;
    }
  }
}
</style>
