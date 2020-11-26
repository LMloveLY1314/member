<template>
    <div>
        <van-nav-bar
                left-arrow
                title="系统公告"
                @click-left="back"
        >
        </van-nav-bar>
<!--        公告列表-->
        <div class="repair-container">
            <van-empty v-if="finished && !noticeList.length">暂无公告</van-empty>
            <van-pull-refresh
                    v-else
                    v-model="refreshing" @refresh="onRefresh">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                >


                    <div class="order-item" v-for="(notice, index) in noticeList" :key="index"
                         style="margin-top: 10px;width: 100%;border-bottom: #6c2b0b solid 1px"
                    >
                        <van-panel title="公告标题" :desc="notice.title">
                            <div style="margin-left: 10px">
                                {{notice.content}}
                            </div>
                        </van-panel>



                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
    import  Vue from 'vue'
    import {Panel} from 'vant'
    import * as API_Notice from "../../api/notice";

    Vue.use(Panel)
    export default {
        name: "index",
        data(){
            return{
                noticeList:[],
                params: {
                    page_no: 0,
                    page_size: 6,
                },
                loading:false,
                /**是否加载完毕*/
                finished: false,
                //下拉刷新
                refreshing: false,
            }
        },
        mounted() {
        },
        methods:{
            back(){
                this.$router.go(-1)
            },
            GET_NoticeList(){
                this.loading = true
                API_Notice.getNoticeList(this.params).then((response)=>{
                    this.loading = false
                    const data= response.records
                    if(!data || !data.length) {
                        this.finished = true
                    } else {
                        this.noticeList.push(...data)
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            /** 初始化列表时加载数据  下滑列表到底部，刷新，请求下一页数据*/
            onLoad() {
                this.params.page_no += 1
                this.GET_NoticeList()
            },
            onRefresh() {
                // 清空列表数据
                this.finished = false;
                // 重新加载数据
                // 将 loading 设置为 true，表示处于加载状态
                this.loading = true;
                this.onLoad();
            },
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .van-nav-bar {
        position: fixed;
        z-index: 100 !important;
        top: 0;
        left: 0;
        right: 0;
    }
    .repair-container {
        padding-top: 10px + 40px;
    }
</style>
