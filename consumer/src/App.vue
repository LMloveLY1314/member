<template>
  <div id="app">
      <router-view :key="key"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
    computed:{
        key(){
            return this.$route.name?this.$route.name+ +new Date():this.$route+ +new Date()
        }
    }
}
</script>

<style>
#app {

}
</style>
