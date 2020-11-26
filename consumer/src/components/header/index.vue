<template>
    <div class="css-header">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
.css-header{
    position: fixed;top: 0;margin: 0 auto;
    background-color: #42b983;
    width: 100%;
    height: 70px
}
</style>
