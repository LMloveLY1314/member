<template>
    <div>
        <van-nav-bar
            left-arrow
            @click-left="$router.go(-1)"
            title="报价列表"
        >
        </van-nav-bar>

<!--        报价列表-->
        <div class="repair-container">


            <van-empty v-if="finished && !noticeList.length">暂无报价</van-empty>
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
    export default {
        name: "employs"
    }
</script>

<style scoped>

</style>
