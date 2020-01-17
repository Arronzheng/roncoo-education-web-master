<template>
  <div class="vip_page">
<!--    <y-header></y-header>-->
    <div class="v_header">
      <div class="container h_30 clearfix">
        <a href="/" class="fl nuxt-link-active">
          <span class="iconfont"></span>
          返回首页
        </a>
        <div class="fr" v-if="userInfo">
          <span >|</span>
          <nuxt-link :to="{name: 'account-order'}">我的订单</nuxt-link>
<!--          <a  href="/lesson">我的课程</a>-->
          <span >|</span>
          <nuxt-link :to="{name: 'account'}">{{userInfo.mobile}}</nuxt-link>
          <a  href="javascript:" @click="signOut">退出</a>
        </div>
        <div class="fr" v-else>
          <a href="javascript:" @click="login">登录</a>
          <a href="javascript:" @click="register">注册</a>
        </div>
      </div>
    </div>
    <div class="header_img clearfix">
      <p class="font_36 center mgt70">超级会员（SVIP）  享专属特权</p>
      <p class="font_14 center mgt30">
        海量课程专享，付费课程免费学习，超低折扣课程，资源随心下，一切只为助力您的学习成长。
      </p>
    </div>
    <div class="vip_info">
      <a href="/list?four=4" target="_blank" class="free_btn">
        <img src="../assets/image/course_icon.png" alt="">
        查看免费录播课程
      </a>
      <!---->
      <div class="h100 index_box" >
        <div class="right_item" >
          <img src="../assets/image/vip01.png" alt="" >
          <p class="font_16 c_fff" >免费课程</p>
          <p class="font_12 mgt10 c_gold" >专属课程免费看</p>
        </div>
        <div class="right_item" >
          <img src="../assets/image/vip02.png" alt="" >
          <p class="font_16 c_fff" >超低折扣</p>
          <p class="font_12 mgt10 c_gold" >购买课程最低5折起</p>
        </div>
        <div class="right_item" >
          <img src="../assets/image/vip04.png" alt="" >
          <p class="font_16 c_fff" >活动专享</p>
          <p class="font_12 mgt10 c_gold" >平台活动可以折上折</p>
        </div>
        <!---->
        <!---->
        <!---->
      </div>
      <div class="clearfix card_box mgt30" >
        <div class="fl show_box" >
          <img src="../assets/image/show_vip.png" alt="" >
        </div>
        <div class="fl pay_box clearfix" >
          <div class="pay_item fl clearfix" >
            <div class="card fl c_fff" >
              <p class="font_20 font_b" >年度会员</p>
              <p class="font_12 mgt10" >有效期为1年（365天）</p>
            </div>
            <div class="vip_price fl c_666" >
              <p class="font_20" >年度会员</p>
              <p class="font_12 c_999 mgt10" >有效期为1年（365天）</p>
              <!---->
              <p class="font_20 c_gold vip_time" >￥{{webInfo.vipPrice}}/年
                <del class="font_14 c_999" >￥299/年</del>
              </p>
              <button class="vip_btn" @click="buyVip">立即购买</button>
            </div>
          </div>
        </div>
      </div>
      <div class="c_333 font_14 lh30 pdb30 card_box text_bg" >
        <p class="font_20 lh60 mgt10" >会员权益与服务说明</p>
        <p >1、会员有效期内可免费学习会员免费课。</p>
        <p >2、会员有效期：年度会员有效期为1年（365天）。</p>
        <p >
          3、会员折扣：会员有效期内，购买学院付费课程可享有对应会员折扣。
        </p>
        <p >
          4、会员到期：自购买之日起，所购会员对应的权益随会员过期自动到期，临近到期您可进行会员续费。
        </p>
        <p >
          5、会员续费：当前会员未到期进行续费的用户，权益和有效期自动顺延。
        </p>
        <p >
          6、会员属于虚拟商品，一经售出，不予退费。
        </p>
        <p >
          7、禁止用户使用任何方式利用本站资源为他人提供有偿服务，一经发现，本站有权查封该账号并追究法律责任。
        </p>
      </div>
    </div>
    <d-pay @hidefun="showPay = false" :data="payData" v-if="showPay"></d-pay>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YFooter from '~/components/common/Footer'
import DPay from '~/components/VipPayModal'
export default {
  components: {
      DPay,
      YFooter
  },
  head () {
    return {
      title: this.$store.state.clientData.name,
      meta: [
          {
              hid: 'keywords',
              name: 'keywords',
              content: this.$store.state.webInfo.websiteKeyword
          },
          {
              hid: 'description',
              name: 'description',
              content: this.$store.state.webInfo.websiteDesc
          }
      ]
    }
  },
  data () {
    return {
      payData: null,
      showPay: false,
      userInfo: '',
      webInfo: '',
      isLogin: this.$store.state.tokenInfo ? true : false
    }
  },
  watch: {

  },
  methods: {
    buyVip (event) {
        console.log('buy')
        if (!this.isLogin) {
            this.$msgBox({
                content: '请登录后再购买',
                isShowCancelBtn: false
            }).then(() => {
                this.$store.dispatch('REDIRECT_LOGIN');
            })
            return
        }
        this.showPay = true;
        this.payData = {};
    },
    login () {
        this.$store.commit('SET_TEMPORARYURL');
        this.$router.push({name: 'login'});
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
    register () {
        this.$router.push({name: 'login', query: {tab: 2}});
    }
  },
  mounted () {
    this.webInfo = this.$store.state.webInfo
    this.userInfo = this.$store.state.userInfo
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .vip_page .v_header, .vip_page .v_header .h_30 {
    height: 30px;
    line-height: 30px;
  }
  .vip_page .v_header {
    background: #333;
    color: #ccc;
  }
  .container {
    width: 1200px;
    margin: 0 auto;
  }
  .vip_page .v_header a {
    color: #ccc;
    margin: 0 6px;
  }
  .vip_page a {
    text-decoration: none;
  }
  .fl {
    float: left;
  }
  a {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
    text-decoration: none;
    background: transparent;
  }
  .iconfont {
    font-family: iconfont!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .fr {
    float: right;
  }
  .vip_page .header_img {
    height: 450px;
    background: url(../assets/image/vip_header.jpg) no-repeat 50%;
    color: #d1b388;
  }
  .font_36 {
    font-size: 36px;
  }
  .mgt70 {
    margin-top: 70px;
  }
  .center {
    text-align: center;
  }
  .font_14 {
    font-size: 14px;
  }
  .mgt30 {
    margin-top: 30px;
  }
  .vip_page .vip_info {
    position: relative;
    width: 1080px;
    margin: -235px auto 0;
  }
  .vip_page .vip_info .free_btn {
    position: absolute;
    top: -200px;
    right: 30px;
    color: #ca9e70;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    cursor: pointer;
    background: hsla(0,0%,100%,.3);
    border-radius: 6px;
    img {
      width: 20px;
      height: 20px;
      margin-bottom:-5px;
    }
  }
  .vip_page .vip_info .index_box {
    padding: 0 300px 20px;
  }
  .vip_page .h100 {
    height: 100px;
    padding-bottom: 30px;
  }
  .vip_page .right_item {
    width: 120px;
    float: left;
    text-decoration: none;
    text-align: center;
    margin: 0 20px;
    img {
      width: 50px;
      height: 50px;
      margin: 0 35px 20px;
    }
  }
  .c_fff {
    color: #fff;
  }
  .font_16 {
    font-size: 16px;
  }
  .c_gold {
    color: #ca9e70;
  }
  .font_12 {
    font-size: 12px;
  }
  .mgt10 {
    margin-top: 10px;
  }
  .vip_page .vip_info .card_box {
    width: 910px;
    margin-left: 85px;
  }
  .vip_page .vip_info .show_box {
    width: 300px;
    height: 213px;
    background: #ca9e70;
    img {
      height: 100%;
    }
  }
  .vip_page .vip_info .pay_box {
    margin-top: 1px;
    padding: 30px 0;
    width: 590px;
    height: 211px;
    background: #ca9e70;
  }
  .vip_page .pay_item {
    margin-left: 40px;
    width: 528px;
    height: 155px;
    border-radius: 6px;
    overflow: hidden;
  }
  .vip_page .pay_item .card {
    padding: 20px;
    width: 248px;
    height: 155px;
    background: url(../assets/image/vip_card.png) no-repeat 50%;
  }
  .font_20 {
    font-size: 20px;
  }
  .font_b {
    font-weight: 650;
  }
  .vip_page .pay_item .vip_price {
    width: 240px;
    height: 155px;
    padding: 14px 20px 6px;
    background: #fff;
    position: relative;
  }
  .c_999 {
    color: #999;
  }
  .vip_page .pay_item .vip_price .vip_time {
    position: absolute;
    bottom: 52px;
  }
  del {
    text-decoration: line-through;
  }
  .vip_btn {
    position: absolute;
    bottom: 6px;
    left: 20px;
    width: 200px;
    height: 36px;
    background: #ca9e70;
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  .vip_page .vip_info .text_bg {
    padding-left: 20px;
    width: 890px;
    margin-bottom: 20px;
    margin-top: 20px;
    background: #fff url(../assets/image/text_bg.jpg) no-repeat bottom;
    box-shadow: 0 0 3px rgba(0,0,0,.2);
  }
  .vip_page .pdb30 {
    padding-bottom: 30px;
  }
  .vip_page .lh30 {
    line-height: 30px;
  }
  .vip_page .lh60 {
    line-height: 60px;
  }

</style>
