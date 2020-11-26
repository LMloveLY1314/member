<template>
    <div>
        <van-nav-bar
                left-arrow
                title="人才市场"
                @click-left="$router.go(-1)"
        >
            <van-icon slot="right" name="search" @click="showSearchPopup = true"/>
        </van-nav-bar>
        <van-tabs class="sort-box" v-model="tabActive" :swipe-threshold="2" @change="handleTabChange">
            <van-tab title="全部"/>
            <van-tab title="我的收藏"/>
        </van-tabs>
        <div class="repair-container">
            <van-empty v-if="finished && !repairList.length">暂无师傅</van-empty>
            <van-pull-refresh
                    v-else
                    v-model="refreshing" @refresh="onRefresh">
                 <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
            >


                <div class="order-item" v-for="(repair, index) in repairList" :key="index"
                     style="margin-top: 5px;width: 100%;height: 90px;"
                     @click="toDetail(repair.repair_id)"
                >
<!--                    头像和信誉分div-->
                    <div style="float: left">
                       <div style="margin-left: 10px">
                           <img
                                   :src="repair.face"
                                   style="border-radius: 50%;height: 60px;width: 60px"
                           />
                           <div style="border: green solid 1px;width: 70px;font-size: 10px">
                               <label style="">信用分</label>
                               <label
                                       style="background-color: #42b983"
                               >{{repair.redit_core}}分</label>
                           </div>
                       </div>
                    </div>
<!--                    维修师傅基本信息-->
                    <div style="margin-left: 5px;height: 100%;width:55%;float: left">
                        <label>{{repair.repair_name}}</label>
                        <div style="overflow: hidden">{{repair.categorys}}</div>
                        <div style="overflow: hidden">{{repair.address}}</div>
                    </div>
<!--                    按钮区域，根据是否收藏，显示收藏/移除-->
                    <div style="float: left">
                        <van-button v-if="tabActive===0" icon="star-o" type="primary" @click.stop="addCollection(repair.repair_id,repair.repair_name)">收藏</van-button>
                        <van-button v-else="tabActive===1" icon="star-o" type="primary" @click.stop="removeCollection(repair,id)">移除</van-button>
                    </div>

                </div>
            </van-list>
            </van-pull-refresh>
        </div>

<!--    维修师傅搜索-->
        <van-popup
                v-model="showSearchPopup"
                position="top"
        >
            <form action="/">
                <van-search
                        placeholder="请输入师傅姓名或手机号"
                        v-model="searchKeyword"
                        @search="handleSearchRepair"
                />
            </form>
        </van-popup>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { List,Empty,Image,PullRefresh } from 'vant';
    import  * as Repair_API from  '../../api/repair'

    Vue.use(List);
    Vue.use(Empty)
    Vue.use(Image)
    Vue.use(PullRefresh)
    export default {
        name: "repairCore",
        data(){
            const {type}=this.$route.query
            return{
                showSearchPopup:false,
                tabActive:type? 1:0,
                searchKeyword:'',
                loading:false,
                /**是否加载完毕*/
                finished: false,
                //下拉刷新
                refreshing: false,
                /**维修师傅列表*/
                repairList:[],
                /** 查询维修师傅列表参数*/
                params: {
                    page_no: 0,
                    page_size: 6,
                    type:type?type :''        //是否是我的收藏，不是则查询所有师傅
                },
            }
        },
        methods:{
            //切换卡片，清空list数据，重新设置该卡片参数
            handleTabChange(index){
                this.finished = false
                this.repairList = []
                this.params.page_no = 1
                this.params.type = this.getParam(index)
                this.GET_RepairList()
            },
            //改变卡片索引
            getParam(index){
                switch (index) {
                    case 0:
                        return 'all'
                    case 1:
                        return 'collection'
                }
            },
            GET_RepairList(){
                this.loading = true
                Repair_API.getRepairList(this.params).then((response)=>{
                    this.loading = false
                    const data= response.records
                    if(!data || !data.length) {
                        this.finished = true
                    } else {
                        this.repairList.push(...data)
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
            /**搜索维修师傅后处理*/
            handleSearchRepair(){
                    this.showSearchPopup = false
                    this.params.key_words = this.searchKeyword
                    this.params.page_no = 1
                    this.finished = false
                    this.repairList = []
                    this.onLoad()
            },
            /**收藏或移除师傅*/
            addCollection(repair_id,repair_name){
                const  params={repair_id,repair_name}
                Repair_API.addCollection(params).then(()=>{
                    this.$message.success("收藏成功")
                    this.GET_RepairList()
                })
            },
            removeCollection(repair_id){
                Repair_API.removeCollection(repair_id).then(()=>{
                    this.$message.info("移除成功")
                    this.repairList = []
                    this.params.page_no = 1
                    this.GET_RepairList()
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
            }

        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .sort-box {
        position: fixed;
        z-index: 99;
        height: 40px;
        background-color: #fff;
        top: 46px;
        left: 0;
        right: 0;
    }
    .van-nav-bar {
        position: fixed;
        z-index: 100 !important;
        top: 0;
        left: 0;
        right: 0;
    }
    .repair-container {
        padding-top: 60px + 40px;
    }
</style>
