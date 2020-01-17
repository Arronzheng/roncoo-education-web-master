// /src/components/MessageBox/index.vue
<template>
    <div class="message-box" v-show="isShowMessageBox">
      <div class="mask" @click="cancel"></div>
      <div class="message-content">
<!--        <h3 class="title">{{ title }}</h3>-->
<!--        <p class="content">{{ content }}</p>-->
        <div>
          <textarea type="text" :placeholder="replyed" v-model="inputValue" v-if="isShowInput" ref="input"></textarea>
        </div>
        <div class="btn-group">
            <button class="btn-default solid_btn" @click="cancel" v-show="isShowCancelBtn">{{ cancelBtnText }}</button>
            <button class="btn u-btn u-btn-1" @click="confirm" v-show="isShowConfimrBtn">{{ confirmBtnText }}</button>
            <span class="btn cl">{{cLength}}</span>
        </div>
      </div>
    </div>
</template>

<script>
import { commentSave } from '~/api/comment.js'
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: '这是弹框内容'
    },
    isShowInput: false,
    isShowCancelBtn: {
      type: Boolean,
      default: true
    },
    isShowConfimrBtn: {
      type: Boolean,
      default: true
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    replyed: {
        type: String,
        default: ''
    },
    contentLength: {
        type: Number,
        default: 0
    },
    reComment: {
        type: Object,
        default() {
            return {}
        }
    },
    loginUserNo: {
        type: Number,
        default() {
            return 0;
        }
    }
  },
  data () {
    return {
      inputValue: '',
      isShowMessageBox: false,
      resolve: '',
      reject: '',
      promise: '', // 保存promise对象
      commentMap: {}
    };
  },
  computed: {
      cLength: function () {
          return this.contentLength - this.inputValue.length
      }
  },
  methods: {
    // 确定,将promise断定为resolve状态
    confirm: function () {
      // this.$parent.pubComment(this.reComment)
        if(this.inputValue === null || this.inputValue === '' || this.inputValue === undefined) {
            this.$msgBox({
                content: '输入点内容在提交吧',
                isShowCancelBtn: false
            })
            return false;
        }
        if(this.inputValue.length > 300) {
            this.$msgBox({
                content: '输入内容长度超出限制！',
                isShowCancelBtn: false
            })
            return false;
        }
        this.commentMap.userId = this.loginUserNo
        this.commentMap.content = this.inputValue
        this.commentMap.courseId = this.reComment.courseId
        if (this.reComment.length > 0) {
            this.commentMap.chapterId = this.reComment[0].chapterId
            this.commentMap.periodId = this.reComment[0].periodId
        }else{
            this.commentMap.chapterId = 0
            this.commentMap.periodId = 0
        }
        if(this.reComment.commentType == 1) {
          this.commentMap.pid = this.reComment.id
        } else {
            this.commentMap.pid = this.reComment.pid
        }
        this.commentMap.parentNo = this.reComment.userId
        this.commentMap.commentType = 2
        commentSave(this.commentMap).then(res => {
            let result = res.data
            this.$parent.commentList = result.data.courseCommentList;
            if (result.code === 200) {
                this.$msgBox({
                    content: '评论成功',
                    isShowCancelBtn: false
                })
                this.isShowMessageBox = false;
                this.inputValue = ''
                if (this.isShowInput) {
                    this.resolve(this.inputValue);
                } else {
                    this.resolve('confirm');
                }
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
    // 取消,将promise断定为reject状态
    cancel: function () {
      this.isShowMessageBox = false;
      this.inputValue = ''
      this.reject('cancel');
      // this.remove();
    },
    // 弹出messageBox,并创建promise对象
    showMsgBox: function () {
      this.isShowMessageBox = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      // 返回promise对象
      return this.promise;
    },
    remove: function () {
      setTimeout(() => {
        this.destroy();
      }, 300);
    },
    destroy: function () {
      this.$destroy();
      document.body.removeChild(this.$el);
    }
  }
};
</script>
<style lang="scss" scoped>
  textarea {
    width: 95%;
    height: 32px;
    margin: 20px 10px;
    line-height: 26px;
  }
  .message-box{
    position: relative;
    top: 50%;
    left: 50%;
    z-index: 10009;
  }
  .message-content{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    width: 470px;
    margin-left: -235px;
    margin-top: -140px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    .title{
      line-height: 45px;
      padding: 0 20px;
      background-color: #f9f9f9;
      font-size: 16px;
      .close{
        float: right;
      }
    }
    .content{
      text-align: center;
      padding:24px 20px 12px;
      font-size: 16px;
    }
  }
  .btn-group{
    padding: 12px;
    text-align: center;
    .btn-default{
      background-color: #eee;
      border-color: #ddd;
      color: #666;
    }
  }
  .btn {
    float: right;
  }
  .cl {
    margin-top: -20px;
    margin-right: 10px;
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
    margin-bottom: 10px;
    margin-top: -25px;
  }
</style>
