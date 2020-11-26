<template>
        <div class="tab-bar-item" @click="itemClick">
            <div>
                <!--普通图片、活跃时的图片，只显示一个-->
                <slot name="item-icon"></slot>
<!--                <slot v-else name="active-item-icon"></slot>-->
                <div :class="{active :isActive}">
                    <slot name="item-text"></slot>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        name: "TabBarItem",
        data(){
             return {
            //     isActive:false
             }
        },
        props:{//父组件给子组件传值，定义属性名为path，限定为字符串类型
            path:String
        },
        computed:{
            isActive(){
               return  this.$route.path.indexOf(this.path)!==-1
            }
        }
        ,
        methods:{
            itemClick:function () {
               this.$router.replace(this.path)
            }
        }
    }
</script>

<style scoped>
    .tab-bar-item{
        flex: 1;
        text-align: center;
        height: 49px;
    }
    .tab-bar-item img{
        height: 25px;
        width: 25px;
    }
    .active{
        color: red;
    }

</style>
