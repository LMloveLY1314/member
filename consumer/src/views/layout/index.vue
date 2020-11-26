<template>
    <div>
        <tab-bar>
            <tab-bar-item path="/home">
                <img slot="item-icon" src="../../assets/img/main.jpg">
                <div slot="item-text">首页</div>
            </tab-bar-item>
            <tab-bar-item path="/order">
                <img slot="item-icon" src="../../assets/img/list.jpg">
                <div slot="item-text">订单</div>
            </tab-bar-item>

            <tab-bar-item path="/release">
                <img slot="item-icon" src="../../assets/img/new_order.jpg">
                <div slot="item-text">下单</div>
            </tab-bar-item>

            <tab-bar-item path="/massage">
                <img  slot="item-icon" src="../../assets/img/massage.jpg">
                <div slot="item-text">消息</div>
            </tab-bar-item>
            <tab-bar-item path="/profile">
                <img  slot="item-icon" src="../../assets/img/my.jpg">
                <div slot="item-text">我的</div>
            </tab-bar-item>
        </tab-bar>
<!--        子组件显示区域-->
        <router-view :key="key"></router-view>
    </div>
</template>

<script>
    import TabBar from "../../components/tabbar/TabBar";
    import TabBarItem from "../../components/tabbar/TabBarItem";
    export default {
        name: "index",
        components:{
            TabBar,
            TabBarItem

        },
        computed:{
            key(){
                return this.$route.name?this.$route.name+ +new Date():this.$route+ +new Date()
            }
        }
    }
</script>

<style scoped>

</style>
