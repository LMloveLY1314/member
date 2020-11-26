<template>
<!--    报价列表
        是按每一个订单显示，还是按状态来显示，还是按状态显示吧
-->
    <div>
        <van-nav-bar
                left-arrow
                title="查看报价"
                @click-left="$router.go(-1)"
        >
        </van-nav-bar>
<!--        报价选项卡-->
        <van-tabs v-model="tabActive" :swipe-threshold="4" @change="handleTabChange"
                  style="overflow: hidden"
        >
            <van-tab title="待处理"/>
            <van-tab title="已接受"/>
            <van-tab title="已失效"/>
            <van-tab title="已拒绝"/>
            <van-tab title="师傅取消"/>
        </van-tabs>
        <div class="order-container">
            <van-empty v-if="finished && !offerList.length">暂无订单</van-empty>
            <van-list
                    v-else
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
            >
                <div class="order-item" v-for="(offer, index) in offerList" :key="index">
                    <div class="sn-order-item">
                        订单号：{{ offer.order_sn }}
                    </div>
                    <div class="info-order-item">
                        <p><span>状<i></i>态：</span><em style="color: #3985ff;">{{offerStatusText(offer.status)}}</em></p>

                        <p v-if="offer.price"><span>报<i></i>价：</span><em class="price">￥{{ offer.price | unitPrice }}</em></p>
                        <p v-if="offer.info"><span>描<i></i>述：</span><em class="price">{{ offer.info }}</em></p>

                        <div class="order-btns">
                            <!--                操作按钮，接受报价或是拒绝-->
                            <a v-if="offer.status=='WAIT'" @click="handleCancelOffer(offer.id,'REFUSE')" style="background-color: red">拒绝</a>
                            <a v-if="offer.status=='WAIT'" @click="handleCancelOffer(offer.id,'AGREE')" style="background-color: #0800ff">接受</a>
                            <!--              维修中可以取消订单，可以确认维修完成-->
                        </div>
                        <!--              如果已经接受报价，显示维修师傅-->
                        <div  v-if="offer.repair_id"   @click="toDetail(offer.repair_id)" class="shop-order-item">
                            <em>维修师傅：{{ offer.repair_name}}</em>
                        </div>

                    </div>
                </div>
            </van-list>
        </div>

    </div>
</template>

<script>
    import * as  API_Offer from  '../api/offer'
    import Vue from 'vue'
    import  {Empty} from 'vant'
    Vue.use(Empty)
    export default {
        name: "offerList",
        data(){
            //从请求地址获取报价状态
            // const { status } = this.$route.query

            return{
                loading: false,
                // 是否全部已加载完成
                finished: false,
                // 当前tab的index
                tabActive: this.getParam('WAIT'),
                params: {
                    page_no: 0,
                    page_size: 5,
                    status:'WAIT'
                },
                offerList: [],
            }
        },
        methods:{
            /** 根据订单状态获取tabActive */
            getParam(param) {
                switch (param) {
                    case 0: return 'WAIT'
                    case 1: return 'AGREE'
                    case 2: return  'INVALID'
                    case 3: return  'REFUSE'
                    case 4: return 'CANCELLED'

                    case 'WAIT': return 0
                    case 'AGREE': return 1
                    case 'INVALID' : return 2
                    case 'REFUSE': return 3
                    case 'CANCELLED' : return 4

                }
            },
            offerStatusText(status){
                switch (status) {
                    case 'WAIT': return '待处理'
                    case 'AGREE': return '已接受'
                    case 'INVALID': return '已失效'
                    case 'REFUSE': return '已拒绝'
                    case 'CANCELLED': return '已取消'
                }
            },
            /** tabIndex发生改变 */
            handleTabChange(index) {
                this.finished = false
                this.offerList = []
                this.params.page_no = 1
                this.params.status = this.getParam(index)
                this.GET_OfferList()
            },
            /** 加载数据 */
            onLoad() {
                this.params.page_no += 1
                this.GET_OfferList()
            },
        //    获取报价列表
            GET_OfferList(){
                this.loading = true
                API_Offer.getOfferList(this.params).then((response)=>{
                       const data= response.records
                       if(!data || !data.length) {
                           this.finished = true
                       } else {
                           this.offerList.push(...data)
                       }
                       this.loading = false
                   })
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
        //处理报价：同意或拒绝，同意之后，其他师傅对该订单的报价自动失效
            handleCancelOffer(id,status){
                const  params={id,status}
                API_Offer.handleOffer(params).then(()=>{
                    if (status==="REFUSE"){
                        this.$message.success("已拒绝")
                    }else {
                        this.$message.success("接受报价")
                    }

                })
                this.GET_OfferList()
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
