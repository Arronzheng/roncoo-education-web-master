<template>
  <div class="sy_body">
    <div class="title"><span></span>学员讨论区</div>
    <div class="iptarea">
      <div class="head">
        <img class="user_head" v-if="headImgUrl" :src="headImgUrl" alt="">
        <img class="user_head" v-else src="~/assets/image/friend.jpg" alt="">
      </div>
      <div>
        <div>
          <div class="m-cmmtipt f-cb f-pr">
            <div class="u-txtwrap holder-parent f-pr" style="display: block;">
              <textarea class="u-txt area" v-model="commentContent" placeholder="评论" maxlength="300"></textarea>
            </div>
            <div class="btns f-cb f-pr">
              <button class="btn u-btn u-btn-1" @click="pubComment()">评论</button>
              <span class="zs s-fc4">{{contentLength}}</span>
            </div>
            <div class="corr u-arr">
              <em class="arrline">◆</em>
              <span class="arrclr">◆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chapter_info" v-for="(one, index) in commentList" :key="index">
<!--      <div class="s_top" v-if="index > 0"></div>-->
      <div class="chapter_name">
        <div class="itm1">
          <div class="head">
            <img class="user_head" v-if="one.userExt.headImgUrl" :src="one.userExt.headImgUrl" alt="">
            <img class="user_head" v-else src="~/assets/image/friend.jpg" alt="">
          </div>
          <div class="cntwrap">
            <div class="">
              <div class="cnt f-brk">{{one.userExt.nickname || one.userExt.mobile}}：{{one.content}}</div>
            </div>
            <div class="rp">
              <div class="time s-fc4">{{one.createdAt | dateString('YYYY年MM月DD日 HH:mm')}}</div>
              <span v-show="one.userId == loginUserNo"><a href="javascript:void(0)" class="s-fc3" @click="delComment(one.id)">删除</a><span class="sep">|</span></span>
              <span style="color: #666;"><a href="javascript:void(0)" class="s-fc3" @click="replyComment(one)">回复</a></span>
              <span class="sep">|</span>
              <span style="color: #666;">
                <a href="javascript:void(0)" v-if="one.isPackup === 0" class="s-fc3" @click="one.isPackup = 1">收起回复</a>
                <a href="javascript:void(0)" v-if="one.isPackup === 1" class="s-fc3" @click="expandup(one)">查看回复({{one.children.length}})</a>
              </span>
            </div>
          </div>
        </div>
        <div class="que f-brk f-pr s-fc3" v-if="one.isPackup === 0">
          <span class="darr" v-if="one.children.length > 0">
            <i class="bd">◆</i>
            <i class="bg">◆</i>
          </span>
          <span v-for="(two, index) in one.children" :key="index">
            <div class="itm2">
              <div class="head">
                <img class="user_head" v-if="two.userExt.headImgUrl" :src="two.userExt.headImgUrl" alt="">
                <img class="user_head" v-else src="~/assets/image/friend.jpg" alt="">
              </div>
              <div class="cntwrap">
                <div class="">
                  <div class="cnt f-brk">{{two.userExt.nickname || two.userExt.mobile}}<span style="margin: 0 12px;color: #999999">回复</span><span>{{two.parentUserExt.nickname || two.parentUserExt.mobile}}</span>：{{two.content}}</div>
                </div>
                <div class="rp">
                  <div class="time s-fc4">{{two.createdAt | dateString('YYYY年MM月DD日 HH:mm')}}</div>
                  <span v-show="two.userId == loginUserNo"><a href="javascript:void(0)" class="s-fc3" @click="delComment(two.id)">删除</a><span class="sep">|</span></span>
                  <span style="color: #666;"><a href="javascript:void(0)" class="s-fc3" @click="replyComment(two)">回复</a></span>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
    <d-page v-if="pageObj.totalPage > 0" :page="pageObj" @btnClick="getPage"></d-page>
    <d-reply ref="MyAlert" :title="''" :content="''" :isShowInput="true" :isShowCancelBtn="false" :isShowConfimrBtn="true" :confirmBtnText="confirmBtnText" :replyed="replyed" :contentLength="contentLength" :reComment="reComment" :loginUserNo="loginUserNo"></d-reply>
  </div>
</template>
<script>
import DPage from '~/components/Page'
import filter from '~/filter/filter'
import DReply from '~/components/Reply'
import { commentSave, commentDelete } from '~/api/comment.js'
export default {
  components: {
      DReply
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    nowNo: {
      type: String,
      default: ''
    },
    nowCourseId: {
      type: String,
      default: ''
    },
    loginUserNo: {
        type: Number,
        default() {
            if (this.$store.state.userInfo != null) {
                return parseInt(this.$store.state.userInfo.userNo)
            } else {
                return 0
            }
        }
    },
    commentLength: {
        type: Number,
        default: 300
    }
  },
  data (){
    return {
        pageObj: {
            pageCurrent: '',
            pageSize: '',
            totalCount: '',
            totalPage: ''
        },
        commentList: [],
        commentContent: '',
        commentMap: {},
        headImgUrl: '',
        confirmBtnText: '回复',
        replyed: '',
        reComment: {}
    }
  },
  watch: {
      list: {
          // 因为只是在初始化的时候给commentList赋值，在data变化的时候不会改变commentList，所以要
          // 做监听
          handler (val) {
              // 监听data变化，赋值给commentList
              this.commentList = val
          },
          deep: true
      }
  },
  computed: {
      contentLength: function () {
          return this.commentLength - this.commentContent.length
      }
  },
  mounted() {
      this.commentList = this.list
      if(this.$store.state.userInfo != null) {
        this.headImgUrl = this.$store.state.userInfo.headImgUrl
      }
  },
  methods: {
    delComment(id) {
        if (!this.$store.state.tokenInfo) {
            this.$msgBox({
                content: '登录后才可以删除'
            }).then(res => {
                this.$store.dispatch('REDIRECT_LOGIN');
            }).catch(() => {
            })
            return false;
        }
        this.$msgBox({
            content: '确认删除该评论？'
        }).then(() => {
            commentDelete({id}).then(res => {
                let result = res.data
                this.commentList = result.data.courseCommentList;
                if (result.code === 200) {
                    this.$msgBox({
                        content: '删除成功',
                        isShowCancelBtn: false
                    })
                } else {
                    if (result.code >= 300 && result.code < 400) {
                        this.$msgBox({
                            content: '登录超时，请重新登录',
                            isShowCancelBtn: false
                        }).then(() => {
                            this.$store.dispatch('REDIRECT_LOGIN', result.code)
                        }).catch(() => {
                            this.$store.dispatch('REDIRECT_LOGIN', result.code)
                        })
                    } else {
                        this.$msgBox({
                            content: result.msg,
                            isShowCancelBtn: false
                        }).catch(() => {})
                    }
                }
            }).catch(() => {
            })
        }).catch(() => {
            // console.log('取消')
        })
    },
    pubComment() {
        if (!this.$store.state.tokenInfo) {
            this.$msgBox({
                content: '登录后才可以评论'
            }).then(res => {
                this.$store.dispatch('REDIRECT_LOGIN');
            }).catch(() => {
            })
            return false;
        }
        if(this.commentContent === null || this.commentContent === '' || this.commentContent === undefined) {
            this.$msgBox({
                content: '输入点内容在提交吧',
                isShowCancelBtn: false
            })
            return false;
        }
        if(this.commentContent.length > 300) {
            this.$msgBox({
                content: '输入内容长度超出限制！',
                isShowCancelBtn: false
            })
            return false;
        }
        this.commentMap.userId = this.loginUserNo
        this.commentMap.content = this.commentContent
        this.commentMap.courseId = this.nowCourseId
        if (this.commentList.length > 0) {
          this.commentMap.chapterId = this.commentList[0].chapterId
          this.commentMap.periodId = this.commentList[0].periodId
        }else{
            this.commentMap.chapterId = 0
            this.commentMap.periodId = 0
        }
        this.commentMap.commentType = 1
        commentSave(this.commentMap).then(res => {
            let result = res.data
            this.commentList = result.data.courseCommentList;
            if (result.code === 200) {
                this.$msgBox({
                    content: '评论成功',
                    isShowCancelBtn: false
                })
                this.commentContent = ''
            } else {
                if (result.code >= 300 && result.code < 400) {
                    this.$msgBox({
                        content: '登录超时，请重新登录',
                        isShowCancelBtn: false
                    }).then(() => {
                        this.$store.dispatch('REDIRECT_LOGIN', result.code)
                    }).catch(() => {
                        this.$store.dispatch('REDIRECT_LOGIN', result.code)
                    })
                } else {
                    this.$msgBox({
                        content: result.msg,
                        isShowCancelBtn: false
                    }).catch(() => {})
                }
            }
        }).catch(() => {
        })
    },
    expandup(comment) {
        if(comment.children.length > 0) {
            comment.isPackup = 0
        } else {
            return false
        }
    },
    replyComment(comment) {
        if (!this.$store.state.tokenInfo) {
            this.$msgBox({
                content: '登录后才可以回复'
            }).then(res => {
                this.$store.dispatch('REDIRECT_LOGIN');
            }).catch(() => {
            })
            return false;
        }
        this.reComment = comment
        this.replyed = '回复' + (comment.userExt.nickname || comment.userExt.mobile)+ ':'
        this.$refs.MyAlert.showMsgBox()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  a:hover{
    text-decoration: none;
  }
  div {
    display: block;
  }
  .itm1 {
    padding: 10px 0;
    border-top: 1px dotted #ccc;
  }
  .itm2 {
    padding: 8px 0;
    border-top: 1px dotted #ccc;
  }
  .head{
    float: left;
    width: 50px;
    height: 50px;
    margin-right: -100px;
    img{
      border-radius: 10%;
    }
  }
  .cntwrap {
    margin-left: 60px;
  }
  .cnt {
    width: 100%;
    overflow: hidden;
    line-height: 20px;
  }
  .cnt.f-brk {
    word-break: break-all;
  }
  .s-fc7, a.s-fc7:hover {
    color: #0c73c2;
  }
  .rp {
    margin-top: 5px;
    padding-right: 15px;
    text-align: right;
  }
  .time {
    float: left;
    margin: 0 !important;
  }
  .s-fc4 {
    color: #999;
  }
  .que {
    padding-left: 5px;
    margin-top: 5px;
    line-height: 20px;
    background: #f4f4f4;
    margin-left: 15px;
    border-radius: 1%;
  }
  .f-pr {
    position: relative;
    zoom: 1;
  }
  .s-fc3 {
    color: #666;
  }
  .darr {
    position: absolute;
    top: -7px;
    left: 50px;
    font-size: 26px;
    line-height: 14px;
  }
  .darr i {
    position: absolute;
    top: 0;
    left: 0;
  }
  i {
    font-style: normal;
    text-align: left;
    font-size: inherit;
  }
  .bg {
    top: 1px;
    color: #f4f4f4;
  }
  .user_head {
    width: 46px;
    height: 46px;
    border-radius: 10%;
    background: rgb(228, 228, 228);
    text-align: center;
    line-height: 46px;
    font-size: 13px;
    color: #999;
    float:left;
    margin: 0px 10px 0 0px;
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
  }
  }
  .sep {
    margin: 0 5px;
    color: #ccc;
  }
  .iptarea {
    margin-bottom: 40px;
  }
  .m-cmmtipt {
    margin-left: 62px;
  }
  div.holder-parent {
    position: relative;
    zoom: 1;
  }
  .u-txtwrap {
    padding-right: 14px;
  }
  .area {
    height: 50px;
    display: block;
  }
  textarea.u-txt, div.u-txt {
    width: 100%;
    margin-right: -20px;
  }
  .u-txt {
    height: 58px;
    margin: 0;
    padding: 5px 6px 6px;
    border: 1px solid #cdcdcd;
    border-radius: 2px;
    line-height: 19px;
  }
  textarea {
    font-size: 12px;
    color: initial;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-text-size-adjust: none;
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    /*color: initial;*/
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textarea;
    background-color: white;
    -webkit-rtl-ordering: logical;
    flex-direction: column;
    resize: none;
    cursor: text;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0em;
    /*font: 400 13.3333px Arial;*/
    border-width: 1px;
    border-style: solid;
    border-color: rgb(169, 169, 169);
    border-image: initial;
    padding: 2px;
  }
  .btns {
    clear: both;
    padding-top: 10px;
    padding-right: 14px;
  }
  .btn {
    float: right;
  }
  .u-btn {
    display: inline-block;
  }
  .u-btn-1 {
    width: 46px;
    height: 25px;
    background-position: -84px -64px;
    border: 1px solid #D51423;
    background-color: #D51423;
    color: #fff;
    text-align: center;
    line-height: 25px;
    border-radius: 3px;
  }
  .btn:focus,
  .btn:active:focus,
  .btn.active:focus,
  .btn.focus,
  .btn:active.focus,
  .btn.active.focus {
    outline: none;
    border-color: transparent;
    box-shadow:none;
  }
  .btn:hover {
    cursor:pointer;
    background-color: red;
  }
  .zs {
    float: right;
    margin-right: 10px;
    line-height: 25px;
  }
  .corr {
    position: absolute;
    top: 11px;
    left: -7px;
  }
  .u-arr {
    width: 13px;
    height: 14px;
    overflow: hidden;
  }
  .u-arr .arrline {
    color: #cdcdcd;
  }
  .u-arr .arrclr {
    margin: -10px 0 0 2px;
    _margin-top: -17px;
    color: #fff;
  }
  .u-arr .arrline, .u-arr .arrclr {
    display: block;
    font-family: "SimSun";
    font-size: 15px;
    font-style: normal;
    font-weight: normal;
    height: 10px;
    line-height: normal;
  }
  .sy_body{
    .title {
      border-left: 3px solid #000;
      padding-left: 12px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
      margin-bottom: 25px;
    }
  }
  .chapter_info {
    width: 839px;
    margin: 0 auto;
    font-size: 12px;
    border-bottom: 0px dashed #ccc;
    margin-bottom: 0px;
    padding-bottom: 20px;
    &:last-child {
      border: none;
    }
    .chapter_name {
      font-size: 12px;
      /*font-weight: 700;*/
      color: #333;
      padding-bottom: 10px;
    }
  }
  .period_info {
    position: relative;
    a {
      display: inline-block;
      font-size: 12px;
      width: 66px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #999;
      position: absolute;
      right: 0px;
      top: 10px;
      border: 1px solid rgb(153, 153, 153);
      border-radius: 13px;
      &:hover {
        color: rgb(213, 20, 35);
        text-decoration: none;
        border: 1px solid rgb(213, 20, 35);
        cursor: pointer;
      }
    }
  }
  .period_top {
    width: 627px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    position: relative;
    padding-right: 104px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .video_time {
      position: absolute;
      right: 0;
    }
    .period_num {
      margin-right: 6px;
    }
    .period_video {
      display: inline-block;
      width: 21px;
      height: 21px;
      position: relative;
      top: 6px;
      margin-right: 10px;
      background: url(../../assets/image/video1.svg) center center;
      background-size: 21px 21px;
      &.no_v {
        background: url(../../assets/image/no_video.svg) no-repeat center center;
      }
    }
    &:hover, &.on {
      cursor: pointer;
      background: rgb(242, 242, 242);
      color: rgb(213, 20, 35);
      .period_video {
        background: url(../../assets/image/video.png) center center;
        &.no_v {
          background: url(../../assets/image/no_video.svg) no-repeat center center;
        }
      }
    }
  }
</style>
