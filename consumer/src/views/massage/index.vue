<template>
    <div style="background: #f7f7f7">
        <van-nav-bar
                fixed
                title="消息中心"
        >
        </van-nav-bar>
        <div class="profile-container">
            <van-cell-group :border="true">
                <van-cell icon="envelop-o" title="订单通知"  size="large" :value="orderNum"/>
                <van-cell icon="chat-o" title="系统消息" :value="systemNum"/>
            </van-cell-group>
        </div>

<!--   1.     订单通知-->


<!--   2.     系统消息     -->

    </div>
</template>

<script>

    export default {
        name: 'index',
        data(){
            return{
                orderNum:'暂无新消息',
                systemNum:'暂无新消息',
            }
        },
    }
</script>
<style>
    .profile-container {
        padding-top: 46px;
    }
</style>


