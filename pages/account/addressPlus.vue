<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wddz'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">{{content}}地址</a>
        </ul>
        <div class="main_cont form">
          <form action="" @submit="regSubmit">
            <div class="form_group">
              <div class="label">收货人:</div>
              <div class="form_ctl">
                <input type="text" v-model="pobj.receiverName" class="form_input" placeholder="请输入姓名">
              </div>
            </div>
            <div class="form_group">
              <div class="label">手机号码:</div>
              <div class="form_ctl">
                <input type="text" v-model="pobj.receiverPhone" maxlength="11" class="form_input" placeholder="请输入手机号码">
              </div>
            </div>
            <div class="form_group">
              <div class="label">地区信息:</div>
              <div class="form_ctl">
                <v-distpicker @selected="onSelected" :province="pobj.receiverProvince" :city="pobj.receiverCity" :area="pobj.receiverDistrict"></v-distpicker>
              </div>
            </div>
            <div class="form_group">
              <div class="label">详细地址:</div>
              <div class="form_ctl">
                <input type="text" v-model="pobj.receiverAddress" class="form_input" placeholder="请输入详细地址">
              </div>
            </div>
            <div class="form_group">
              <div class="label">设为默认地址:</div>
              <div class="form_ctl">
                <el-switch v-model="pobj.isToleration" class="form_switch" :active-value="1" :inactive-value="0" active-color="#D51423" inactive-color="#999"></el-switch>
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button class="submit_btn"  v-if="submitBtn">确认</button>
                <button class="submit_btn" v-else disabled="disabled">确认</button>
              </div>
            </div>
          </form>
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
    import VDistpicker from '~/components/Distpicker'
    import {saveAddress, viewAddress, updateAddress} from '~/api/account/address'
    export default {
        name: "addressPlus",
        components: {
            YHeader,
            YFooter,
            YSide,
            VDistpicker
        },
        data () {
            return {
                pobj: {
                    receiverName: '',
                    receiverPhone: '',
                    receiverProvince: '',
                    receiverCity: '',
                    receiverDistrict: '',
                    receiverAddress: '',
                    receiverZip: '',
                    isToleration: 0
                },
                submitBtn: true,
                content: ''
            }
        },
        methods: {
            onSelected(data) {
                this.pobj.receiverProvince = data.province.value
                this.pobj.receiverCity = data.city.value
                this.pobj.receiverDistrict = data.area.value
            },
            regSubmit: function (e) {
                e.preventDefault();
                if (!this.pobj.receiverName) {
                    this.showMsg('请填写收货人')
                    return false;
                }
                if (!this.pobj.receiverPhone) {
                    this.showMsg('请填写手机号码')
                    return false;
                }
                if (!(/^1[3|4|5|8|7|9][0-9]\d{4,8}$/.test(this.pobj.receiverPhone.trim()))) {
                    this.showMsg('请输入正确手机号');
                    return false;
                }
                if (this.pobj.receiverDistrict === '区' || this.pobj.receiverDistrict === '') {
                    this.showMsg('请选择地区信息')
                    return false;
                }
                if (!this.pobj.receiverAddress) {
                    this.showMsg('请填写详细地址')
                    return false;
                }
                if(this.$route.query.id){
                    this.editAddress()
                }else{
                    this.addAddress()
                }

            },
            showMsg (msg) {
                this.$msgBox({
                    content: msg,
                    isShowCancelBtn: false
                }).catch(() => {})
            },
            addAddress () {
                saveAddress(this.pobj).then(res => {
                    let result = res.data
                    if (result.code === 200) {
                        this.$msgBox({
                            content: '新增成功',
                            isShowCancelBtn: false
                        }).then(async (val) => {
                            this.$router.push({name: 'account-address'})
                        }).catch(() => {
                            this.$router.push({name: 'account-address'})
                        })
                    } else {
                        if (result.code >= 300 && result.code < 400) {
                            this.$msgBox({
                                content: '登录异常，请重新登录',
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
                }).catch(msg => {
                    this.$msgBox({
                        content: '新增地址失败！！',
                        isShowCancelBtn: false
                    })
                })
            },
            editAddress () {
                updateAddress(this.pobj).then(res => {
                    let result = res.data
                    if (result.code === 200) {
                        this.$msgBox({
                            content: '修改成功',
                            isShowCancelBtn: false
                        }).then(async (val) => {
                            this.$router.push({name: 'account-address'})
                        }).catch(() => {
                            this.$router.push({name: 'account-address'})
                        })
                    } else {
                        if (result.code >= 300 && result.code < 400) {
                            this.$msgBox({
                                content: '登录异常，请重新登录',
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
                }).catch(msg => {
                    this.$msgBox({
                        content: '修改地址失败！！',
                        isShowCancelBtn: false
                    })
                })
            }
        },
        mounted() {
            this.content = this.$route.query.id ? '修改':'新增'
            console.log(this.$route.query.id)
            if(this.$route.query.id){
                const id = this.$route.query.id
                viewAddress({id: id}).then(res => {
                    let result = res.data
                    if (result.code === 200) {
                        this.pobj = result.data
                    }
                })
            }
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
  .form_switch {
    margin-top: 10px;
  }
  .el-cascader--small {
    width: 278px;
  }
</style>
