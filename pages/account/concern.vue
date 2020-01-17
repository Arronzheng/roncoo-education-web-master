<template>
  <div>
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'wdgz'"></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">我的关注</a>
        </ul>
        <div class="main_cont">
          <div class="notdata" v-if="notdata">
            <i class="iconfont">&#xe6be;</i>暂时没有数据
          </div>
          <div v-else class="course_content" v-for="(item, index) in pageObj.list">
            <div class="img_box">
              <img :src="item.courseImgUrl"alt="">
            </div>
            <p class="course_name">{{item.courseName}}</p>
            <p class="course_study">
              上次学习：<span>{{item.lsatPeriodName}}</span>
            </p>
            <p class="course_time">
              学习时间：{{item.lastStudyTime}}
            </p>
            <nuxt-link :to="{name: 'view-id', params: {id: item.courseId, isVip: isVip, tab: 'big'}}">
              进入主页
            </nuxt-link>
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
    import {studyList} from '~/api/account/user.js'
    import {myHttp} from '~/utils/myhttp.js'
    export default {
        name: "concern",
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
                }
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
</style>
