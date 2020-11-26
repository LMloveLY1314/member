<template>
    <div style="height: 100%">
        <div class="item-header">
            个人
        </div>
        <div class="profile-header">
<!--            点击头像去到我的资料页面-->
            <img src="444" id="face" @click="toMy">
        </div>
        <div>
            <el-card class="box-card" style="width: 90%;margin-left: 20px;">
                <order-item v-for="item in orderitems" :key="item" style="float: left">
                    <img slot="order-item-icon" :src="item.img">
                    <div slot="item-text">{{item.text}}</div>
                </order-item>
            </el-card>
            <el-card class="box-card" style="width: 90%;margin-left: 20px;">
                <order-item v-for="item in infoitems" :key="item" style="float: left">
                    <img slot="order-item-icon" :src="item.img">
                    <div slot="item-text">{{item.text}}</div>
                </order-item>
            </el-card>
        </div>
    </div>
</template>

<script>
    import OrderItem  from "../order/OrderItem/OrderItem";
    import Storage from "../../util/storage";
    export default {
        name: "index",
        components:{
            OrderItem
        },
        data(){
            return{
                orderitems:[
                    {img:'fr',text:'hahha'},
                    {img:'rtrg',text:'hahha'},
                    {img:'rgerb',text:'hahha'},
                ],
                infoitems:[
                    {img:'rget',text:'hahha'},
                    {img:'reg',text:'hahha'},
                    {img:'reger',text:'hahha'},
                ]
            }
        },
        methods:{
            /** 每次操作数据都有涉及到用户id，将用户id保存在cookie中*/
            toMy(){
            const uid=   Storage.getItem("consumer_id");
            this.$router.push('')
            }
        }
    }
</script>

<style scoped>
    .profile-header{
        height: 180px;
        background-color: red;
        width: 100%;
    }
    #face{
        margin-top: 20px;
        margin-left: 20px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: white;
    }
</style>
