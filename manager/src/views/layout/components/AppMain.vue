<template>
  <section>
    <div class="app-main" :style="{height: mainHeight+'px',}">
      <transition name="fade" mode="out-in" :style="{height: mainHeight+'px'}">
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </section>
</template>
<script>
export default {
  name: 'AppMain',
  data(){
      return{
        mainHeight:document.documentElement.clientHeight-66-50-33,//内容高度=页面高度-顶部高度
      }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}

</script>
<style>
  .app-main{
    overflow-y: auto;
  }
</style>
