<template>
    <div>
<!--        维修师傅详情-->
<!--        上半部分背景-->
        <div style="background-color: #6c2b0b;height: 200px">
            <van-nav-bar
                    left-arrow
                    @click-left="$router.go(-1)"
            >
            </van-nav-bar>
            <div class="box-card">
                <!--            头像-->
                <div class="avatar_box">
                    <img :src="repair_detail.face" alt="头像">
                </div>
                <!--            基本信息，简介-->
                <div style="margin-top: 50px; text-align: center">
                    <label>{{repair_detail.repair_name}}</label>
                </div>
                <!--            评价数据，服务次数，评分，信誉分-->
                <div id="repair-nav" class="repair-nav">
                    <ul>
                        <li>
                            <span></span>
                            <p>服务次数</p>
                            <i></i>
                        </li>
                        <li>
                            <span>{{repair_detail.repair_score}}</span>
                            <p>评价</p>
                            <i></i>
                        </li>
                        <li>
                            <span>{{repair_detail.redit_core}}</span>
                            <p>信誉分</p>
                        </li>

                    </ul>
                </div>
            </div>
            <!--        卡片显示师傅基本信息-->
        </div>
        <!--        下半部分背景-->
<!--        当标签页移动到顶部时，将其固定在顶部，
            首先，在挂载组件时添加一个滚动监听事件,然后添加处理监听事件的方法，

            销毁页面时移除监听器，否则会报错
-->
            <van-tabs value="1" id="tabbar" :class="tabBarFixed==true? 'isFixed':'noFixed'"
            >
                <van-tab title="师傅信息">
                    <div style="margin: 20px">

                        <div>
                            <ul>
                                <li>擅长类目：{{repair_detail.categorys}}</li>
                                <li>所在地区：{{repair_detail.address}}</li>
                                <li>服务介绍：{{repair_detail.repair_describe}}</li>
                            </ul>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="订单评价">
<!--                   显示维修师傅的评论列表
                       评价用户、评价内容，好评或其他评价，评价图片
-->
                    <order-comment :repair-id="repair_id" />
                </van-tab>
                <van-tab title="图片展示">
                    <!--                <div -->
                    <!--                    style="margin-left: 10px"-->
                    <!--                >-->
                    <van-image v-for="(item,index) in images" :key="index"
                               width="100px"
                               height="100px"
                               style="margin-left: 30px;margin-top: 20px"
                               :src="item">
                        图片
                    </van-image>
                    <van-image-preview v-model="showFlag" :images="images">
                        <!-- <template v-slot:index>第{ index }页</template> -->
                    </van-image-preview>
                    <!--                </div>-->
                </van-tab>
            </van-tabs>


    </div>
</template>

<script>
    import Vue from 'vue'
    import  * as Repair_API from '../../api/repair'
    import  * as Comment_API from '../../api/comment'
    import  OrderComment from './orderComments'
    import {Image as VanImage,Lazyload,ImagePreview} from 'vant'
    Vue.use(VanImage)
    Vue.use(Lazyload)
    Vue.use(ImagePreview)
    export default {
        name: "repairDetail",
        components:{
            OrderComment
        },
        data(){
               return{
                   //标签栏是否固定在顶部
                   tabBarFixed:false,
                   repair_id:this.$route.params.id,
                   repair_detail:'',
                   images:[],
                   showFlag:false,
                   loading:false,
                   /**是否加载完毕*/
                   finished: false,
                   //下拉刷新
                   refreshing: false,
                   /**评论列表*/
                   commentList:[],
                   params:{
                       page_no:0,
                       page_size:5,
                   },
            }
        },
        mounted() {
            //挂载时获取师傅的基本信息，评分，评价
            window.addEventListener('scroll', this.handleScroll)
            this.getRepairDetail()

        },
        methods:{
            //监听元素与顶部的距离与滑动距离，使用id选择器获取到元素
            handleScroll () {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                let offsetTop = document.querySelector('#tabbar').offsetTop
                scrollTop > offsetTop ? this.tabBarFixed = true : this.tabBarFixed = false
            },
            getRepairDetail(){
                Repair_API.getRepairDetail(this.repair_id).then((response)=>{
                    this.repair_detail=response
                    this.images=response.repair_imgs.split(",")
                })
            },
            GET_RepairComment(){
                this.params.repair_id=this.repair_id
                this.loading = true
                Comment_API.commentOrder(this.params).then((response)=>{
                    this.loading = false
                    const data= response.records
                    if(!data || !data.length) {
                        this.finished = true
                    } else {
                        this.commentList.push(...data)
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            /** 初始化列表时加载数据  下滑列表到底部，刷新，请求下一页数据*/
            onLoad() {
                this.params.page_no += 1
                this.GET_RepairList()


            },
            onRefresh() {
                // 清空列表数据
                this.finished = false;
                // 重新加载数据
                // 将 loading 设置为 true，表示处于加载状态
                this.loading = true;
                this.onLoad();
            },
        },
        destroyed () {
            window.removeEventListener('scroll', this.handleScroll)
        },
    }
</script>

<style  lang="less" scoped>
    li{
        list-style: none;
        margin-top: 10px;
    }
    .box-card{
        left: 15px;
        right: 15px;
        position: absolute;
        height: 160px;
        top: 100px;
        background-color: #fff;
        border-radius: 5%;
    }
    .avatar_box {
        height: 90px;
        width: 90px;
        border: red solid 1px;
        border-radius: 50%;
        background-color: #ffffff;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
        }
    }
    .repair-nav {
        width: 100%;
        overflow: hidden;
        text-align: center;
        ul {
            width: 100%;
            height: 100%;
            overflow: hidden;
            text-align: center;
            background: #fff;
        }
        li {
            list-style: none outside none;
            text-align: center;
            width: 32%;
            display: inline-block;
            height: 100%;
            padding: 8px 0;
            position: relative;
        }
        span {
            font-size: 16px;
        }
        i {
            width: 1px;
            height: 32px;
            display: block;
            border-right: 1px solid #dedede;
            position: absolute;
            top: 14px;
            right: 0;
        }
    }
</style>

<style>
    .isFixed{
        position:fixed;
        background-color:#Fff;
        top:0;
        z-index:999;
        width: 100%;
    }
    .noFixed{
        position:absolute;
        margin-top: 90px;
        width: 100%;

    }
</style>
