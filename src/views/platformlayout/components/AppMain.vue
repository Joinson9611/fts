<template>
  <section class="app-main">
    <!--转场方式-->
    <div>
      <el-scrollbar id="scroller-box" class="sidebar">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </el-scrollbar>
      <el-tooltip placement="top" content="回到顶部" style="z-index: 999">
        <ScrollTop />
      </el-tooltip>
    </div>

  </section>
</template>

<script>
import ScrollTop from '@/components/ElBackToTop'
export default {
  name: 'AppMain',
  components: { ScrollTop },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped lang="scss">
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;
    z-index: 0;
  }
</style>
