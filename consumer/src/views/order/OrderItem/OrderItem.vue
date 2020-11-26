<template>
    <div >
        <div>
            <!--普通图片、活跃时的图片，只显示一个-->
            <slot name="order-item-icon"></slot>
            <div>
                <slot name="item-text"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderItem"
    }
</script>

<style scoped>
    /*.order-item{*/
    /*    width: 50px;*/
    /*    height: 50px;*/
    /*}*/
    /*img{*/
    /*    width: 80%;*/
    /*    height: 80%;*/
    /*}*/
</style>
