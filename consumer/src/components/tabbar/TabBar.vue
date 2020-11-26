<template>
        <div id="tab-bar">
            <!--再把tab-bar-item抽取成组件，tab-bar放一个slot即可-->
           <slot></slot>
        </div>
</template>

<script>

    export default {
        name: "TabBar"
    }
</script>
<!--@import引入文件css-->

<style>
    #tab-bar{
        display: flex;
        background-color: aliceblue;

        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow:1px -10px 3px rgb(100,100,100) ;
    }

</style>
