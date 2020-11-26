<template>
  <div id="payment-complete">
    <van-nav-bar title="支付详情"/>
    <div class="success-item" v-if="isComplete">
      <div class="inner-delivery success" v-if="isSuccess">
        <van-icon name="checked" style="margin-bottom: 12px; font-size: 72px"/>
        <p>支付成功</p>
      </div>
      <div class="inner-delivery error" v-else>
        <van-icon name="clear" style="color: #f44; margin-bottom: 12px; font-size: 72px"/>
        <p style="color: #f44">支付异常</p>
      </div>
      <div class="btns-delivery">
          <button type="button" @click="$router.push('/order/my-order')">查看订单</button>
          <button type="button" @click="$router.push('/home')">返回首页</button>

      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Order from '../api/order'
  export default {
    name: "payment-complete",
    data () {
      return {
        isComplete: false, //标记接口是否请求完成
        isSuccess: true
      }
    },
    mounted () {

      this.isPaySuccess()
    },
    methods: {
      isPaySuccess () {
        //取出支付时存储的订单号
        const storage = JSON.parse(localStorage.getItem('order_sn'));
        let order_sn = storage.order_sn;
        //获得订单状态，查看是否已经支付
        API_Order.getPayStatus(order_sn).then(response => {
          this.isComplete = true
          //如果返回success，表示支付成功
          this.isSuccess = response.toLowerCase() === 'fail' ? false : true;
        }).catch(err=>{
          this.isComplete = false
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .success-item {
    width: 100%;
    height: 100%;
  }
  .inner-delivery {
    color: #00c800;
    font-size: 24px;
    width: 100%;
    text-align: center;
    margin: 34px 0 40px;
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
</style>
