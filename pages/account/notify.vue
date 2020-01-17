<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wdtz'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">系统通知</a>
        </ul>
        <div class="main_cont">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <div class="message_items" v-if="!notdata && !showView" v-for="(item, index) in pageObj.list">
            <div class="message_item" @click="getMsgById(item.msgId, item.gmtCreate)">
              <div class="message_title">
                {{item.msgTitle}}
              </div>
              <div class="message_time">
                {{item.gmtCreate}}
              </div>
            </div>
          </div>
          <div v-if="showView" class="msg_view">
            <h1 style="text-align: center;font-size: 20px">{{msg.msgTitle}}</h1>
            <div style="text-align: center;margin-top: 10px">{{msg.sendTime | dateString('YYYY-MM-DD')}}</div>
            <p v-html="msg.msgText"  style="text-indent: 2em;margin-top: 20px;font-size: 18px"></p>
            <div style="text-align: center;margin-top: 35px"><button href="javascript:" class="submit_btn" @click="showView = false"> <<返回 </button></div>
          </div>
          <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getPage"></d-page>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>

<script>
    import YHeader from '~/components/common/Header'
    import YFooter from '~/components/common/Footer'
    import YSide from '~/components/account/Side'
    import DPage from '~/components/Page'
    import filter from '~/filter/filter'
    import {userMsgList, msgView} from '~/api/account/msgUser.js'
    import {myHttp} from '~/utils/myhttp.js'
    export default {
        name: "notify",
        components: {
            YHeader,
            YFooter,
            YSide,
            DPage
        },
        data () {
            return {
                notdata: true,
                pageCurrent: 1,
                pageObj: {
                    pageCurrent: '',
                    pageSize: '',
                    totalCount: '',
                    totalPage: ''
                },
                showView: false,
                msg: {}
            }
        },
        methods: {
            getPage (int) {
                this.pageCurrent = int
                this.getUserMsgList()
            },
            getUserMsgList () {
                myHttp.call(this, {
                    method: userMsgList,
                    params: {
                        pageCurrent: this.pageCurrent,
                        pageSize: 5
                    }
                }).then(res => {
                    console.log(res)
                    this.pageObj = res.data
                    if (!res.data.list.length) {
                        this.notdata = true
                    } else {
                        this.notdata = false
                    }
                })
            },
            getMsgById (id, time) {
                myHttp.call(this, {
                    method: msgView,
                    params: {
                        id: id
                    }
                }).then(res => {
                    this.showView = true
                    this.msg = res.data
                    this.msg.sendTime = time
                })
            }
        },
        mounted() {
            this.getUserMsgList()
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~/assets/css/account.scss';
  .notdata {
    text-align: center;
    padding: 60px 0;
    font-size: 30px;
    color: #999;
    min-height: 400px;
  }
  .message_items {
    padding: 0 20px;
    cursor: pointer;
 }
  .message_items .message_item {
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #f7f5f8;
    color: #999;
    &:hover {
      color: #D51423;
    }
  }
   .message_items .message_title {
     width: 750px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     float: left;
   }
   .message_items .message_time {
     float: right;
   }
  .msg_view {
    color: #1E1E1E;
  }
  .submit_btn{
    display: inline-block;
    text-align: center;
    height: 34px;
    line-height: 34px;
    border: 1px solid #D51423;
    background-color: #D51423;
    width: 80px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    &:disabled{
      background-color: #eee;
      border-color: #ddd;
      color: #aaa;
    }
  }

</style>
