<template>
  <section class="app-main">
    <el-scrollbar id="scroller-box" class="sidebar">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
        <!-- <router-view /> -->
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped>
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .fixed-header+.app-main {
    padding-top: 50px;
  }
</style>

<style lang="scss" scoped>
  // 解决路由跳转时动画特效产生的滚动条
  /deep/.el-scrollbar__view{
    overflow: hidden;
  }
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
