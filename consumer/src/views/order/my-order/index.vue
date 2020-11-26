<template>
  <div id="my-order" style="background-color: #f7f7f7">
      <div style="">
          <van-nav-bar
                  left-arrow
                  title="我的订单"
                  @click-left="$router.go(-1)"
          >
              <van-icon slot="right" name="search" @click="showSearchPopup = true"/>
          </van-nav-bar>
          <van-tabs v-model="tabActive" :swipe-threshold="4" @change="handleTabChange"
                    style="overflow: hidden"
          >
              <van-tab title="全部"/>
              <van-tab title="待报价"/>
              <van-tab title="待雇佣"/>
              <van-tab title="维修中"/>
              <van-tab title="待支付"/>
              <van-tab title="待评论"/>
              <van-tab title="已完成"/>
              <van-tab title="已取消"/>
              <van-tab title="退款"/>
          </van-tabs>
      </div>
      <div class="order-container">
        <van-empty v-if="finished && !orderList.length">暂无订单</van-empty>
        <van-list
                v-else
                v-model="loading"
                :finished="finished"
                @load="onLoad"
        >
          <div class="order-item" v-for="(order, index) in orderList" :key="index">
            <div class="sn-order-item">
              订单号：{{ order.order_sn }}
            </div>
            <div class="info-order-item">
              <p><span>状<i></i>态：</span><em style="color: #3985ff;" :value="orderStatusText(order.order_status)"></em></p>

              <p v-if="order.pay_money"><span>总<i></i>价：</span><em class="price">￥{{ order.pay_money | unitPrice }}</em></p>
              <div class="order-btns">
<!--                取消订单按钮-->
                <a v-if="(order.order_status=='WAIT_OFFER')||(order.order_status=='UNDER_REPAIR')" @click="handleCancelOrder(order.order_sn)" style="background-color: #f19325">取消订单</a>
<!--              维修中可以取消订单，可以确认维修完成-->
                <a v-if="order.order_status=='UNDER_REPAIR'" @click="handleConfirmOrder(order.order_sn)">确认完成</a>
                <a v-if="order.order_status=='WAIT_PAY'" @click="handlePayOrder(order.order_sn)">订单付款</a>
                <a v-if="order.order_status=='WAIT_COMMENT'"
                   @click="$router.push({path:'/order/comment?order_sn='+order.order_sn})">
                    去评论</a>
                <a v-if="order.order_status=='WAIT_EMPLOYED'" @click="$router.push('/order/offer')">去雇佣</a>

                  <a  @click="$router.push({path:'/order/my-order/detail?order_sn='+order.order_sn})">查看详情</a>
              </div>
<!--              如果已经接受报价，显示维修师傅-->
                <div  v-if="order.repair_id"   @click="toDetail(order.repair_id)" class="shop-order-item">
                  <em>维修师傅：{{ order.repair_name}}</em>
                </div>

              <div class="sku-order-item">
                <div class="sku-content">
                    <img :src="item" v-for="(item,index) in order.order_images.split(',')">
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    <van-dialog
            v-model="showCancelDialog"
            title="取消订单"
            show-cancel-button
            :before-close="cancelBeforeClose"
    >
      <van-field
              v-model="reason"
              type="textarea"
              rows="1"
              autosize
              placeholder="请输入取消原因"
      />
    </van-dialog>
    <van-popup
            v-model="showSearchPopup"
            position="top"
    >
      <form action="/">
        <van-search
                placeholder="请输入订单号关键字"
                v-model="searchKeyword"
                @search="handleSearchOrder"
        />
      </form>
    </van-popup>
    </div>


</template>

<script>
  import * as Order_API from '../../../api/order'
  import Vue from 'vue'
  import  {Empty} from 'vant'
  Vue.use(Empty)
  export default {
    name: 'my-order-index',
    data() {
      const { order_status } = this.$route.query
      return {
        // 加载中
        loading: false,
        // 是否全部已加载完成
        finished: false,
        // 当前tab的index
        tabActive: this.getParam(order_status),
        params: {
          page_no: 0,
          page_size: 5,
          order_status
        },
        orderList: [],
        // 显示取消订单dialog
        showCancelDialog: false,
        // 取消订单原因
        reason: '',
        //要取消或要评论的订单
         order_sn:'',
        // 显示搜索框
        showSearchPopup: false,
        // 搜索关键字
        searchKeyword: ''

      }
    },
    methods: {

      /** 根据订单状态显示显示状态文本*/
      orderStatusText(status){
        switch (status) {
          case 'WAIT_OFFER': return '待报价'
          case 'WAIT_EMPLOYED': return '待雇佣'
          case 'UNDER_REPAIR': return '维修中'
          case 'WAIT_PAY': return '待支付'
          case 'WAIT_COMMENT': return '待评论'
          case 'COMPLETE': return '已完成'
          case 'CANCELLED': return '已取消'
          case 'REFUND': return '退款'
        }
      },
      //    跳转维修师傅详情页
      toDetail(repair_id){
        this.$router.push({
          name: "repairDetail",
          params: {
            id: repair_id,
          }
        })
      },
      /** tabIndex发生改变 */
      handleTabChange(index) {
        this.finished = false
        this.orderList = []
        this.params.page_no = 1
        this.params.order_status = this.getParam(index)
        this.GET_OrderList()
      },
      /** 根据订单状态获取tabActive */
      getParam(param) {
        switch (param) {
          case 0: return ''
          case 1: return 'WAIT_OFFER'
          case 2: return 'WAIT_EMPLOYED'
          case 3: return 'UNDER_REPAIR'
          case 4: return 'WAIT_PAY'
          case 5: return 'WAIT_COMMENT'
          case 6: return  'COMPLETE'
          case 7: return  'CANCELLED'
          case 8: return  'REFUND'
          case '': return 0
          case 'WAIT_OFFER': return 1
          case 'WAIT_EMPLOYED' : return  2
          case 'UNDER_REPAIR': return 3
          case 'WAIT_PAY': return 4
          case 'WAIT_COMMENT': return 5
          case 'COMPLETE' : return  6
          case 'CANCELLED': return 7
          case 'REFUND': return 8

        }
      },
      /** 加载数据 */
      onLoad() {
        this.params.page_no += 1
        this.GET_OrderList()
      },
      /** 取消dialog关闭前校验 */
      cancelBeforeClose(action, done) {
        if (action === 'confirm') {
          const { reason, order_sn } = this
          if (!reason) {
            this.$message.error('请填写取消原因！')
            done(false)
          } else {
            Order_API.cancelOrder(order_sn, reason).then(() => {
              done()
              this.$message.success('订单取消申请成功！')
              this.finished = false
              this.orderList = []
              this.params.page_no = 1
              this.GET_OrderList()
            })
          }
        } else {
          done()
        }
      },
      /** 取消订单 */
      handleCancelOrder(order_sn) {
        this.reason = ''
        this.order_sn = order_sn
        this.showCancelDialog = true
      },
      //  订单付款
        handlePayOrder(order_sn){
            this.$router.replace({ path: '/checkout/cashier?order_sn=' +order_sn })
        },
      /** 确认收货 */
      handleDetailOrder(order_sn) {
        this.$confirm('请确认是否收到货物，否则可能会钱财两空！', () => {
          API_Order.confirmReceipt(order_sn).then(() => {
            this.$message.success('确认收货成功！')
            this.finished = false
            this.orderList = []
            this.params.page_no = 1
            this.GET_OrderList()
          })
        })
      },
      /** 订单搜索 */
      handleSearchOrder() {
        this.showSearchPopup = false
        this.params.keyword = this.searchKeyword
        this.params.page_no = 0
        this.finished = false
        this.orderList = []
        this.onLoad()
      },
      /** 获取订单数据 */
      GET_OrderList() {
        this.loading = true
        Order_API.orderList(this.params).then(response => {
          const data= response.records
          if(!data || !data.length) {
            this.finished = true
          } else {
            this.orderList.push(...data)
          }
          this.loading = false
        })
      },
    //    确认订单，确认之后订单变为待付款
        handleConfirmOrder(order_sn){
            Order_API.confirmOrder(order_sn).then(()=>{
                this.$message.success("订单已确认，快去付款吧")
            })
            this.GET_OrderList()
        },
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .order-item {
    margin-top: 10px;
    background-color: #fff;
    padding: 0 10px 10px 10px;
    .sn-order-item {
      position: relative;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      color: #333;
      &::after {
        content: "";
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #e5e5e5;
        height: 1px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 -10px;
      }
    }
    .info-order-item {
      display: block;
      padding: 10px 0;
      position: relative;
      &::after {
        content: "";
        height: 0;
        display: block;
        border-bottom: 1px solid #e5e5e5;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
      p {
        line-height: 20px;
        font-size: 12px;
        color: #999;
        span { color: #666 }
        i {
          display: inline-block;
          width: 24px;
        }
      }
    }
    .order-btns {
      position: absolute;
      top: 17px;
      right: 0;
      a {
        display: inline-block;
        width: 65px;
        height: 30px;
        margin-left: 5px;
        text-align: center;
        color: #fff;
        line-height: 30px;
        z-index: 1;
        border-radius: 2px;
        background: #e4393c;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        outline: 0;
        border: none;
      }
    }
    .shop-order-item {
      display: block;
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #00baea;
      em {
        display: block;
        position: relative;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-style: normal;
        &::after {
          position: absolute;
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          border-top: 1px solid #666;
          border-left: 1px solid #666;
          transform-origin: 50%;
          transform: rotate(135deg);
          right: 5px;
          top: 14px;
        }
      }
    }
    .sku-order-item {
      position: relative;
      margin-top: 10px;
      .sku-content {
        display: block;
        overflow: hidden;
        img {
          position: relative;
          display: block;
          width: 75px;
          height: 75px;
          float: left;
          margin-right: 10px;
        }
      }
    }
    .sku-name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      min-height: 36px;
    }
  }
  .after-btn {
    margin-top: 5px;
    a {
      color: white;
    }
  }
</style>
