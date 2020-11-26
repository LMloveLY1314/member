<template>
  <div id="cashier">
    <van-nav-bar title="订单创建成功"/>
    <div class="success-item">
      <div class="inner-delivery">
        <img src="data:image/png;base64,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" alt="">
        <div class="content-delivery">
          <p>支付方式：<span style="color: #ff002d;">在线支付</span></p>
          <p>订单金额：<span style="color: #ff002d;">￥{{order.pay_money}}</span></p>
        </div>
      </div>
      <div class="btns-delivery">
          <button type="button" @click="$router.push({path:'/order/my-order/detail?order_sn='+order.order_sn})">查看订单</button>
          <button type="button" @click="$router.replace('/home')">返回首页</button>
      </div>
      <div  class="success-item" style="margin-top: 20px">
        <van-cell-group>
<!--          支付宝支付-->
          <van-cell
                  is-link
                  @click="initiatePay"
          >
            <img src="http://javashop-statics.oss-cn-beijing.aliyuncs.com/v70/null/044162472C1F4BF3A4BFB7A110BD47F3.png"
                 slot="title" class="img-payment">
          </van-cell>
<!--          微信支付-->
          <van-cell
                  is-link
          >
            <img src="http://javashop-statics.oss-cn-beijing.aliyuncs.com/v70/null/2B286FFA1AA7424789E17597216F5460.png"
                 slot="title" class="img-payment">
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Order from '../../api/order'
  export default {
    name: 'cashier',
    middleware: 'auth-user',
    data() {
      return {
        //从地址中获取订单号
        order_sn: this.$route.query.order_sn,
        // 支付方式列表
        paymentList: [],
        // 订单详情
        order: {

        },
        // 支付方式
        payment_plugin_id: '',
        // 显示确认订单完成支付dialog
        showConfirmDialog: false
      }
    },
    mounted() {
    //  获取订单明细，主要是获取订单金额
        this.GET_OrderDetail(this.order_sn)
    },
    methods: {
      /** 获取订单明细*/
      GET_OrderDetail(order_sn){
          API_Order.orderDetail(order_sn).then((response)=>{
              this.order=response
          })
      },
      /** 进入支付跳转页面 */
      initiatePay() {
          //将订单号存在本地，支付完成后检验
          const  order_sn= this.order_sn
          let storage = {
              order_sn,
          }
          localStorage.setItem('order_sn', JSON.stringify(storage));
          // const url = `./cashier-load-pay?sn=${this.order_sn}`
        const url = `./cashier-load-pay?order_sn=`+order_sn
        window.location.href = url
      },
      //
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .success-item {
    width: 100%;
    height: 100%;
  }
  .inner-delivery {
    width: 170px;
    margin: 35px auto 20px;
    height: 50px;
    img {
      float: left;
      width: 50px;
      height: 50px;
    }
  }
  .content-delivery {
    font-size: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 50px;
    justify-content: center;
    p{
      padding: 0;
      margin:2px;
    }
  }
  .btns-delivery {
    display: flex;
    justify-content: space-around;
    width: 100%;
    .btns-item {
      width: 35%;
      height: 25px;
      border: 1px solid #d0d0d0;
      line-height: 20px;
      background-color: #fff;
      color: #333;
      font-size: 12px;
      text-align: center;
      border-radius: 5px;
    }
    button {
      background: none;
      border: none;
      line-height: 27px;
    }
  }
  /deep/ {
    .img-payment {
      width: 150px;
      height: 35px;
    }
  }
</style>
