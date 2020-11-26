<template>
    <div>
        <van-nav-bar
                title="订单中心"
        >
        </van-nav-bar>
        <van-grid
                square
                style="margin-top: 80px"
                :column-num="3"
                icon-size="30px"

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
</template>

<script>
    import OrderItem from "./OrderItem/OrderItem";
    import Vue from 'vue';
    import { Grid, GridItem } from 'vant';
    Vue.use(Grid);
    Vue.use(GridItem);
    export default {
        name: "index",
        components:{
            OrderItem
        },
        data(){
            return{
                /**使用v-bind绑定图片src的时候，需要使用require引入图片，否则无法显示*/
                order:[
                    {img:require('../../assets/img/main.jpg'),text:'待报价',order_status:'WAIT_OFFER'},
                    {img:require('../../assets/img/main.jpg'),text:'待雇佣',order_status:'WAIT_EMPLOYED'},
                    {img:require('../../assets/img/main.jpg'),text:'维修中',order_status:'UNDER_REPAIR'},
                    {img:require('../../assets/img/main.jpg'),text:'待支付',order_status:'WAIT_PAY'},
                    {img:require('../../assets/img/main.jpg'),text:'待评论',order_status:'WAIT_COMMENT'},
                    {img:require('../../assets/img/main.jpg'),text:'已取消',order_status:'COMPLETE'},
                    {img:require('../../assets/img/main.jpg'),text:'已完成',order_status:'CANCELLED'},
                    {img:require('../../assets/img/main.jpg'),text:'退款',order_status:'REFUND'},
                ]
            }
        },
        methods:{
            toMyOrder(order_status){
                this.$router.push({path:'/order/my-order?order_status='+order_status})
            }
        }
    }
</script>

<style scoped>
.order-item{
    border: #4AB7BD solid 1px;
    width: 32%;
    height: 100px;
    float: left;
    text-align: center;
}
    img{
        width: 70%;
        height: 70%;
    }
</style>
