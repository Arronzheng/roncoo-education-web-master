<template>
  <div class="">
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">基础信息</a>
        </ul>
        <div class="main_cont form" v-if="isLogin">
          <form action="" @submit="userEducationInfUpdate">
            <div class="form_group">
            <div class="label">昵称:</div>
            <div class="form_ctl">
              <input type="text" v-model="obj.nickname" class="form_input" placeholder="请输入昵称">
            </div>
          </div>
            <div class="form_group">
              <div class="label">用户名:</div>
              <div class="form_ctl">
                <div class="text">{{ obj.mobile }}</div>
              </div>
            </div>
            <div class="form_group">
              <div class="label">年龄:</div>
              <div class="form_ctl">
                  <input type="text" v-model="obj.age" class="form_input" placeholder="请输入昵称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">性别:</div>
              <div class="form_ctl form_ctl_radio">
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex1" value="1" name="sex">
                <label for="sex1">男</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex2" value="2" name="sex">
                <label for="sex2">女</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex3" value="3" name="sex">
                <label for="sex3">保密</label>
              </div>
            </div>
            <div class="form_group">
              <div class="label">用户头像:</div>
              <div class="form_ctl upload_ctl">
                <input type="hidden" v-model="obj.headImgUrl">
                <div class="preview">
                  <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
                <d-upload @rtnUrl="setUrl"></d-upload>
<!--                <p class="tip">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p>-->
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button href="javascript:" class="submit_btn">保存</button>
                <button href="javascript:" class="submit_btn" @click="cancelEdit">取消</button>
              </div>
            </div>
          </form>
        </div>
        <div class="main_cont form" v-else>
          <div class="form_group">
            <div class="label">昵称:</div>
            <div class="form_ctl">
              <div class="text">{{ obj.nickname }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">手机号码:</div>
            <div class="form_ctl">
              <div class="text">
                <span>{{ obj.mobile ? obj.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : obj.mobile }}</span>
                <span class="form_btn" v-if="obj.mobile"><a href="#" @click="modifyPhone">修改</a></span>
                <span class="form_btn" v-else><a href="#" @click="modifyPhone">绑定</a></span>
              </div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">微信:</div>
            <div class="form_ctl">
              <div class="text">
                <span v-if="obj.openId"><a href="#" @click="wxBind">已绑定</a></span>
                <span v-else><a href="#" @click="wxBind">未绑定</a></span>
<!--                <span id="wx_qr" class="wx_qr"></span>-->
<!--                <span class="form_btn" v-else><a href="#" @click="modifyPhone">绑定</a></span>-->
              </div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">年龄:</div>
            <div class="form_ctl">
              <div class="text">{{ obj.age }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">性别:</div>
            <div class="form_ctl">
              <div class="text" v-if="obj.sex === 1">男</div>
              <div class="text" v-else-if="obj.sex === 2">女</div>
              <div class="text" v-else-if="obj.sex === 3">保密</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">用户头像:</div>
            <div class="form_ctl upload_ctl">
              <input type="hidden" v-model="obj.headImgUrl">
                <div class="preview">
                  <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">&nbsp;</div>
            <div class="form_ctl">
              <button href="javascript:" class="submit_btn" @click="editInfo">修改</button>
<!--              <button href="javascript:" class="submit_btn" @click="signOut">退出登录</button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="isModifyPhone" @click="cancelModify()"></div>
    <div class="modify modify_modal" v-if="isModifyPhone">
      <div class="modal_body">
        <input type="text" v-model="obj2.mobile" placeholder="请输入手机号">
        <div class="phone_yzm">
          <input type="text" name="code" v-model="obj2.code" placeholder="请输入手机验证码" class="phone" maxlength="6" autocomplete="off">
          <y-button class="yzm_btn" :mobile="obj2.mobile"></y-button>
        </div>
        <div class="center border_b">
          <a class="solid_btn order_btn" href="javascript:" @click="updatePhone">确定</a>
          <a class="solid_btn order_btn" href="#" @click="cancelModify">取消</a>
        </div>
      </div>
    </div>
    <div class="mask" ref="mask" v-show="isBindWX" @click="close()"></div>
    <div class="bind_modal" v-show="isBindWX">
      <div class="modal_head">
        <span class="fl">绑定微信</span>
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body">
        <div id="wx_qr" class="icon iconfont c_green minIcon"></div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import DUpload from '~/components/account/Upload'
import YButton from '~/components/common/CodeButton'
import {getUserInfo, getAppId} from '~/api/user.js'
import {updateUserEducationInf, updatePhone} from '~/api/account/user.js'
import { myHttp } from '~/utils/myhttp.js'
export default {
  head () {
      return {
          script: [
              {src: "https://res.wx.qq.com/connect/zh_CN/htmledition/js/jquery.min.js" },
              {src: "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js" }
          ]
      }
  },
  data () {
    return {
      isLogin: false,
      region1: [],
      region2: [],
      errTip1: '',
      errTip2: '',
      obj: {
        id: '',
        province: '',
        city: '',
        mobile: '',
        nickname: '',
        sex: '',
        birthday: '',
        school: '',
        eduGrade: '',
        headImgUrl: '',
        orgNo: '',
        userNo: ''
      },
      obj2: {
        id: '',
        mobile: '',
        code: '',
        clientId: ''
      },
      isModifyPhone: false,
      isBindWX: false
    }
  },
  methods: {
    modifyPhone () {
      this.isModifyPhone = true
    },
    cancelModify () {
      this.isModifyPhone = false
    },
    wxBind () {
        getAppId().then(res => {
            this.isBindWX = true
            let obj = new WxLogin({
                self_redirect: false,
                id: "wx_qr",
                appid: res.data.data.appid,
                scope: "snsapi_login",
                redirect_uri: encodeURIComponent(res.data.data.redirectUri),
                state: res.data.data.state,
                style: "black",
                href: "https://zmzx-1259495568.cos.ap-chengdu.myqcloud.com/doc/wxqrcode.css", //https://某个域名下的css文件
            });
        })
    },
    close () {
        this.isBindWX = false
    },
    updatePhone () {
        this.obj2.id = this.obj.id
        this.obj2.clientId = this.$store.state.clientData.id
        myHttp.call(this, {
            method: updatePhone,
            params: this.obj2
            // confirm: () => {window.location.reload()},
            // cancel: () => {window.location.reload()}
        }).then(res => {
            this.$store.commit('SET_USER', res.data)
            this.$msgBox({
                content: '修改成功',
                isShowCancelBtn: false
            }).then(async (val) => {
                window.location.reload()
            }).catch(() => {
                window.location.reload()
            })
        }).catch(error => {})
    },
    getByUser () {
      myHttp.call(this, {
        method: getUserInfo
      }).then(res => {
        console.log(res)
        this.obj = res.data || {}
      }).catch(error => {})
    },
    editInfo () {
      this.isLogin = true;
    },
    cancelEdit () {
      this.isLogin = false;
    },
    signOut () {
        this.$store.commit('SIGN_OUT');
        this.userInfo = '';
        console.log(this.$route.path)
        if (this.$route.path.includes('account')) {
            this.$router.push({name: 'login'})
        } else {
            window.location.reload()
        }
        console.log('退出登录')
    },
    userEducationInfUpdate (e) {
      e.preventDefault();
      if (!this.obj.nickname) {
        this.errTip1 = '请输入昵称';
        return false;
      } else {
        this.errTip1 = false;
      }
      this.id = this.obj.id;
      console.log(this.obj)
      myHttp.call(this, {
        method: updateUserEducationInf,
        params: this.obj,
        confirm: () => {window.location.reload()},
        cancel: () => {window.location.reload()}
      }).then(res => {
        console.log(res)
        this.$store.commit('SET_USER', res.data)
        this.$msgBox({
          content: '修改成功',
          isShowCancelBtn: false
        }).then(async (val) => {
          window.location.reload()
        }).catch(() => {
          window.location.reload()
        })
      })
    },
    setUrl (res) {
      this.obj.headImgUrl = res.url;

    }
  },
  mounted () {
    this.getByUser()
    // this.$refs.mask.style.height = document.documentElement.clientHeight + 'px'
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    DUpload,
    YButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~/assets/css/account.scss';
  .upload_ctl{
    .preview{
      width: 100px;
      height: 100px;
      background-color: #f5f5f5;
      text-align: center;
      margin-bottom: 10px;
      i{
        line-height: 120px;
        font-size: 80px;
        color: #ddd;
      }
    }
  }
  .form_ctl .text {
    width: 125px;
  }
  .form_ctl .submit_btn {
    width: 100px;
    cursor: pointer;
  }
  .form_btn {
    margin-left: 5px;
    a {
      text-decoration: none;
      color: #0099FF;
      &:hover {
        color: #D51423;
        cursor: pointer;
      }
    }
  }
  .modify_modal {
    /*position: absolute;*/
    /*width: 325px;*/
    /*height: 187px;*/
    /*left: 45%;*/
    /*top: 25%;*/
    /*opacity: 1;*/
    /*padding: 5px 5px;*/
    /*border: 1px solid #cccccc;*/
    /*background-color: white;*/
    /*z-index: 999;*/
    position: fixed;
    left: 45%;
    top: 25%;
    z-index: 999;
    width: 450px;
    height: 187px;
    padding: 5px 5px;
    margin-left: -240px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
  }
  .bind_modal {
    position: absolute;
    width: 315px;
    height: 287px;
    left: 45%;
    top: 25%;
    opacity: 1;
    padding: 5px 5px;
    border: 1px solid #cccccc;
    background-color: white;
    z-index: 999;
  }
  .modal_body input[type='text'] {
    width: 310px;
    height: 46px;
    padding-left: 10px;
    margin-top: 5px;
    border-radius: 6px;
    font-size: 14px;
    border-color: rgb(230, 230, 230);
  }
  .phone_yzm {
    position: relative;
    margin-top: 15px;
    .phone {
      padding-right: 100px;
      width: 210px;
      font-size: 14px;
      border-color: rgb(230, 230, 230);
      padding-left: 10px;
      height: 46px;
      border-radius: 6px;
    }
  }
  .yzm_btn {
    width: 100px;
    height: 46px;
    position: absolute;
    left: 290px;
    top: 5px;
    line-height: 48px;
    border-radius: 0 6px 6px 0;
    text-align: center;
    color: #fff;
    cursor: pointer;
    border: none;
  }
  .border_b {
    margin-top: 20px;
  }
  .wx_qr {
    position: absolute;
    left: 60px;
  }

</style>
