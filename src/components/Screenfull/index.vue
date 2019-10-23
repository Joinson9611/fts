<template>
  <div class="screenfull-contain" @click="click">
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" class="screenfull-svg" />
    <!--<span style="font-size: 16px">{{ getText }}</span>-->
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    getText() {
      return this.isFullscreen ? '退出全屏' : '全屏显示'
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '浏览器异常或者禁用全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle().then(() => {
        this.isFullscreen = screenfull.isFullscreen
      })
    }
  }
}
</script>

<style scoped>
  .screenfull-contain {
    width: 48px;
    height: 58px;
    text-align: center;
  }
  .screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 30px;
    height: 30px;
    vertical-align: 10px;
  }
</style>
