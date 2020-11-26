<template>
  <div id="member-index" style="background-color: #f0f2f5">
    <van-nav-bar title="个人">
    </van-nav-bar>
    <div class="member-container">
      <!--头像背景-->
      <div class="head-box" >
        <div class="head-items">
          <div class="head-img" @click="$router.push('/profile/my-profile')">
              <en-face :url="user.face"/>
          </div>
          <div class="items">
              <div @click="$router.push({path:'/repair-core?type=collection'})" class="item">
            <span>
              <p>{{ nums[0]}}</p>
              <p>收藏的师傅</p>
            </span>
              </div>
              <div @click="$router.push({path:'/order/offer'})" class="item">
                  <p>{{ nums[1]}}</p>
                  <p>查看报价</p>
              </div>
              <div @click="$router.push({path:'/order/my-order?order_status=WAIT_COMMENT'})" class="item">
                  <p>{{ nums[2]}}</p>
                  <p>待评论</p>
              </div>
          </div>
        </div>

      </div>
      <div class="member-nav">
          <van-grid
                  square
                  :column-num="3"
                  icon-size="30px"
                  style="font-size: 16px"

          >
              <van-grid-item
                      v-for="item in order"
                      :key="item.text"
                      :icon="item.img"
                      :text="item.text"
                      @click="toMyOrder(item.order_status)"

              />
          </van-grid>
    </div>
  </div>
  </div>
</template>

<script>
    import EnFace from '../../components/Face'
    import Storage from "../../util/storage";
    import * as API_Data from  '../../api/data'
    import Vue from 'vue';
    import { Grid, GridItem } from 'vant';
    Vue.use(Grid);
    Vue.use(GridItem);
    export default {
        name: 'member-index',
        components:{
            EnFace
        },
        data() {
            //登录时保存的用户信息
          const user = this.$store.state.user.user
          return {
            nums: [],
            user:user,//用户信息
            order:[
                  {img:require('../../assets/img/main.jpg'),text:'待报价',order_status:'WAIT_OFFER'},
                  {img:require('../../assets/img/main.jpg'),text:'待支付',order_status:'WAIT_PAY'},
                  {img:require('../../assets/img/main.jpg'),text:'维修中',order_status:'UNDER_REPAIR'}
              ]
          }
        },
        mounted() {
            //判断是否登录
            if (!Storage.getItem('consumer_uid')) {
                this.$router.replace('/login')
            }
        //    查询收藏的师傅数量，已经报价的数量（还未处理的，状态：WAIT），待评论的数量，三个数据一起查吧
            API_Data.data().then((response)=>{
                this.nums=response
            })

        },
          methods:{
              //跳转到my-profile
              toMyProfile(){
                  this.$router.push('/profile/my-profile')
              },
              toMyOrder(order_status){
                  this.$router.push({path:'/order/my-order?order_status='+order_status})
              }

          },
        computed: {},
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .member-container {
    padding-top: 0px;
    padding-bottom: 50px;
    .head-box {
      width: 100%;
      height: 130px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #df5000;
      padding-top: 0px;
    }
    .head-items {
      position: relative;
      height: 55px;
      /*background-color: #fff;*/
    }
    .head-img {

      width: 52px;
      height: 52px;
      border: 3px rgba(255, 255, 255, 0.8) solid;
      border-radius: 100%;
      background-color: #fff;
      position: relative;
      top: 10px;
      left: 30px;
      margin-bottom: 10px;
      img {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .head-user-name {
      //position: absolute;
      //top: -40px;
      top: -70px;
      left: 100px;
      max-width: 168px;
      font-size: 16px;
      color: #fff;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      display: -webkit-box;
      word-break: break-all;
      -webkit-box-orient: vertical;
      box-orient: vertical;
      overflow: hidden;
    }
    .items {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      /*width: calc(100% - 100px);*/
      width:100%;
      height: 55px;
      float: right;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% / 3);
        /*border-left: 1px solid #e7e7e7;*/
        &:first-child {
          border-left: none;
        }
        span {
          align-self: flex-start;
          width: 100%;
          color:#fff;
        }
        p {
          text-align: center;
          font-size: 12px;
          line-height: 18px;
          color:#fff;

        }
      }
    }
    .member-nav {

      position: relative;
      margin-top: 15px;
      width: 96%;
      min-height: 66px;
      background-color: #fff;
      margin-left: 2%;
      border-radius: 10px;
    }
    .member-nav-two{
      position: relative;
      margin-top: 15px;
      width: 96%;
      min-height: 132px;
      background-color: #fff;
      margin-left: 2%;
      border-radius: 10px
    }
    .member-nav-items {

      position: relative;
      justify-content: space-around;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      /*height: 66px;*/
      margin-top: -1px;
      width: 100%;
      overflow: hidden;
      padding-bottom: 14px;


      li {
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
        width: 25%;
        float: left;
        padding-top: 14px;
        a {
          display: block;
          width: 100%;
          text-align: center;
        }
      }
      i {
        display: block;
        height: 26px;
        font-size: 26px;
        text-align: center;
      }
    }
    .big-btn {
      padding: 10px 15px;
    }
  }
  /deep/ .clear-pl {
    display: inline-block;
    width: 15px;
    height: 15px;
  }
</style>

