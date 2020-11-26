<template>
  <div id="order-detail" style="background-color: #f7f7f7">
    <van-nav-bar
            title="订单详情"
            left-arrow
            @click-left="$router.go(-1)"

    />
    <div v-if="order" class="order-container">
      <div class="order-items">
        <div class="order-item">
          <span>订单编号：</span><span>{{ order.order_sn }}</span>
        </div>
        <div v-if="!orderLog.length" class="order-item">
          <span>下单时间：</span><span>{{ order.create_time | unixToDate }}</span>
        </div>
<!--        订单日志-->
<!--        <div v-for="(log, index) in orderLog" :key="index" class="order-item">-->
<!--          <span>{{ log.message }}：</span><span>{{ log.op_time | unixToDate }}</span>-->
<!--        </div>-->

        <div class="order-item">
          <span>订单备注：</span><span>{{ order.remark || '无' }}</span>
        </div>
        <div class="order-item">
          <span>订单状态：</span><span>{{order.order_status_text}}</span>
        </div>
        <span class="hr"></span>
        <div class="order-item">
          <span>应付：</span><span class="price">￥{{ order.pay_money | unitPrice }}</span>
        </div>
<!--        维修师傅-->
        <div class="sku-box" v-if="order.repair_name">
          <div class="shop-info">
              <div @click="$router.push({path:'/repair-detail?id='+order.repair_id})" >
                <label style="color: #3132ff">维修师傅：{{ order.repair_name }}</label>
                <van-icon style="float: right" name="arrow"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
  import * as API_Order from "../../../api/order";

  export default {
    name: 'order-detail',
    data() {
      return {
        order_sn: this.$route.query.order_sn,
        order: '',
        skuList: '',
        // 显示发票信息
        showReceiptDialog: false,
        // 订单日志
        orderLog: ''
      }
    },
    mounted() {
      this.GET_OrderDetail(this.order_sn)
    },
    methods: {
      /** 获取订单明细*/
      GET_OrderDetail(order_sn){
        API_Order.orderDetail(order_sn).then((response)=>{
          this.order=response
        })
      },

    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .order-container {
    padding-top: 0px;
    .hr {
      display: block;
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      clear: both;
    }
    .order-items {
      background-color: #fff;
      padding: 0 10px;
      .order-item {
        padding: 5px 0;
        font-size: 14px;
        .price {
          font-size: 16px;
        }
      }
    }
    .sku-box {
      clear: both;
      margin-top: 10px;
      background-color: #fff;
      .shop-info {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 10px;
        margin: 0 auto;
      }
      .shop-name {
        a {
          color: #385b80;
          &:hover { color: #781127 }
        }
        .van-icon {
          vertical-align: middle;
          margin-right: 5px;
        }
        .van-icon-point-gift, .van-icon-points-mall {
          font-size: 20px;
        }
      }
      .sku-num {
        float: right;
      }
    }
    .sku-list {
      padding: 0 10px;
    }
    .sku-item {
      display: flex;
      align-items: center;
      margin: 10px auto;
      min-height: 75px;
      &.gift {
        min-height: auto;
      }
      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .goods-image {
        margin-right: 10px;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .goods-info {
        margin-left: 10px;
        .price {
          font-size: 14px;
        }
      }
    }
    .order-btns {
      line-height: 50px;
      padding: 0 10px;
      border-top: 1px solid #e5e5e5;
      background-color: #fff;
      text-align: right;
      a {
        display: inline-block;
        margin-left: 5px
      }
    }
    .receipt-cell {
      margin-top: 10px;
      /deep/ .van-cell__value {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .information {
    width: 100%;
    background: #fff;
    margin-top: 10px;
    .address {
      margin: 0 auto;
      padding: 10px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      .name {
        margin-right: 40px;
        display: inline-block;
        line-height: 25px;
      }
      p {
        color: #999;
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        font-size: 12px;
      }
    }
  }
  /deep/ {
    .receipt-dialog {
      height: 70%;
      .van-nav-bar { position: relative }
    }
  }
  .goods-infos {
    min-width: 60px;
    margin-left: 10px;
  }
</style>
