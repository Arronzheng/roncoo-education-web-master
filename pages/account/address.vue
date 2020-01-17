<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wddz'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">我的地址</a>
          <nuxt-link :to="{name:'account-addressPlus', params: {content: '新增'}}" class="fr solid_btn">新增地址</nuxt-link>
        </ul>
        <div class="main_cont form">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <table class="course_table table" v-else>
            <thead>
              <tr>
                <th>收货人</th>
                <th>所在地区</th>
                <th>详细地址</th>
                <th>电话/手机</th>
                <th>默认地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pageObj.list" :key="item.id">
                <td class="consignee">{{item.receiverName}}</td>
                <td class="area">{{item.receiverProvince}}&nbsp;{{item.receiverCity}}&nbsp;{{item.receiverDistrict}}</td>
                <td class="address" style="width: 250px;word-wrap:break-word;">{{item.receiverAddress}}</td>
                <td class="phone">{{item.receiverPhone}}</td>
                <td class="swich">
                  <el-switch class="form_switch"
                             v-model="item.isToleration"
                             @change="handleChangeIsToleration(item.id, item.isToleration, $event)"
                             :active-value="1"
                             :inactive-value="0"
                             active-color="#D51423"
                             inactive-color="#999"
                             active-text="是"
                             inactive-text="否">
                  </el-switch>
                </td>
                <td class="operation">
                  <button class="gray_btn" @click="updateAddress(item.id)">修改</button>
                  <button class="gray_btn" @click="delAddress(item.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
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
    import {getAddressList, delAddress, updateAddress} from '~/api/account/address'
    import {myHttp} from '~/utils/myhttp.js'
    export default {
        name: "site",
        components: {
            YHeader,
            YFooter,
            YSide
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
                }
            }
        },
        methods: {
            getPage (int) {
                this.pageCurrent = int
                this.getAddressList()
            },
            getAddressList () {
                myHttp.call(this, {
                    method: getAddressList,
                    params: {
                        pageCurrent: this.pageCurrent,
                        pageSize: 10
                    }
                }).then(res => {
                    this.pageObj = res.data
                    if(!res.data.list.length){
                        this.notdata = true
                    } else {
                        this.notdata = false
                    }
                })
            },
            delAddress (id) {
                this.$msgBox({
                    content: "确认删除该条地址么？"
                }).then(res => {
                    myHttp.call(this, {
                        method: delAddress,
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if(res.code === 200){
                            this.$msgBox({
                                content: "删除成功",
                                isShowCancelBtn: false
                            }).then(res => {
                                this.getAddressList()
                            })
                        }else if(res.code > 300 && res.code <400){
                            this.$msgBox({
                                content: '登录超时，请重新登录',
                                isShowCancelBtn: false
                            }).then(() => {
                                this.$store.dispatch('REDIRECT_LOGIN', res.data.code)
                            }).catch(() => {
                                this.$store.dispatch('REDIRECT_LOGIN', res.data.code)
                            })
                        }else{
                            this.$msgBox({
                                content: "删除失败",
                                isShowCancelBtn: false
                            })
                        }
                    })
                })
            },
            handleChangeIsToleration (id, isToleration) {
              myHttp.call(this, {
                  method: updateAddress,
                  params: {
                      id: id,
                      isToleration: isToleration
                  }
              }).then(res => {
                  if(res.data > 0){
                      this.getAddressList()
                  }else{
                      this.$msgBox({
                          content: "设置失败",
                          isShowCancelBtn: false
                      })
                  }
              })
            },
            updateAddress (id) {
                this.$router.push({path:'/account/addressPlus', query: {id: id}})
            }
        },
        mounted() {
            this.getAddressList()
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
  .course_table{
    td {
      text-align: center;
      .consignee {
        width: 80px;
      }
      .area {
        width: 241px;
      }
      .address {
        width: 250px;
        word-wrap:break-word;
      }
      .phone {
        width: 160px;
      }
      .swich {
        width: 190px;
      }
      .operation {
        width: 200px;
      }
    }
  }
</style>
