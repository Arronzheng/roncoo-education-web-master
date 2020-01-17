<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wdsc'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">我的收藏</a>
        </ul>
        <div class="main_cont">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <div v-else class="course_content" v-for="(item, index) in pageObj.list">
            <div class="img_box">
              <img :src="item.courseLogo"alt="">
            </div>
            <p class="course_name">{{item.courseName}}</p>
            <nuxt-link class="goLearn_a" :to="{name: 'view-id', params: {id: item.courseId, isVip: isVip, tab: 'big'}}">
              进入学习
            </nuxt-link>
            <a class="cancel_a" href="#" @click="cancelCollection(item.courseId)">取消收藏</a>
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
    import {collectionList, cancelCollection} from '~/api/account/collection.js'
    import {myHttp} from '~/utils/myhttp.js'
    export default {
        name: "collect",
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
                isVip: false
            }
        },
        methods: {
            getPage (int) {
                this.pageCurrent = int
                this.getUserCollectionList()
            },
            getUserCollectionList () {
                myHttp.call(this, {
                    method: collectionList,
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
            cancelCollection (id) {
                this.$msgBox({
                    content: '确认取消收藏？'
                }).then(res => {
                    myHttp.call(this, {
                        method: cancelCollection,
                        params: {
                            courseId: id
                        }
                    }).then(res => {
                        console.log(res)
                        let content = ''
                        if (res.data > 0) {
                            content = '取消收藏成功'
                        } else {
                            content = '取消收藏失败'
                        }
                        this.$msgBox({
                            content: content,
                            isShowCancelBtn: false
                        }).then(res => {
                          this.getUserCollectionList()
                        })
                    })
                })
            }
        },
        mounted() {
            this.getUserCollectionList()
            if(this.$store.state.userInfo && this.$store.state.userInfo.isVip === 1){
                this.isVip = true
            }else{
                this.isVip = false
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '~/assets/css/account.scss';
  .course_content {
    padding: 25px 0;
    height: 136px;
    margin: 0 25px;
    border-bottom: 2px solid #f2f2f2;
    position: relative;
  }
  .notdata {
    text-align: center;
    padding: 60px 0;
    font-size: 30px;
    color: #999;
    min-height: 400px;
  }
  .img_box {
    display: inline-block;
  }
  .img_box img {
    width: 175px;
    height: 86px;
  }
  .course_content p {
    position: absolute;
    font-size: 14px;
    left: 205px;
    color: #999;
  }
  .course_content p.course_name {
    top: 25px;
    color: #333;
  }
  .course_content .goLearn_a {
    display: block;
    width: 106px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #999;
    color: #999;
    background: #fff;
    position: absolute;
    top: 25px;
    right: 0;
    cursor: pointer;
    &:hover {
      text-decoration: none;
      color: #D51423;
      border-color: #D51423;
    }
  }
  .cancel_a {
    font-size: 14px;
    color: #999;
    position: absolute;
    top: 85px;
    right: 25px;
    cursor: pointer;
    &:hover {
      text-decoration: none;
      color: #D51423;
    }
  }
</style>
