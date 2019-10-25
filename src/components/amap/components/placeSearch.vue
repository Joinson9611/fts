<template>
  <div ref="resultWrapper" class="result-list-wrapper">
    <ul class="result-list address" :data="result">
      <li
        v-for="(item, index) in result"
        :key="item.index"
        ref="resultItem"
        class="result-item address"
        @click="setLocation(item)"
      >
        <p class="result-name address" :class="{'active': index === activeIndex}">{{ item.name }}</p>
        <template v-if="item.address.constructor === Array"><p class="result-adress address">{{ item.district }}</p></template>
        <template v-else><p class="result-adress address">{{ item.address }}</p></template>
      </li>
    </ul>
  </div>
</template>
<script >
export default {
  props: {
    result: {
      type: Array,
      default: null
    },
    left: { // 输入框的offsetLeft
      type: Number,
      default: 0
    },
    top: { // 输入框的offsetTop
      type: Number,
      default: 0
    },
    width: { // 输入框的宽
      type: Number,
      default: 0
    },
    height: { // 输入框的高
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeIndex: 0 // 激活项
    }
  },
  mounted() {
    this.initPos()
    document.addEventListener('keydown', this.keydownSelect, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownSelect, false)
  },
  methods: {
    instanceof(val) {
      return val instanceof Array
    },
    // 选择下拉的地址
    setLocation(item) {
      this.$emit('getLocation', item)
    },
    // 初始化地址搜索下拉框位置
    initPos() {
      const dom = this.$refs['resultWrapper']
      const body = document.getElementsByTagName('body')
      if (body) {
        body[0].appendChild(dom)
        const clientHeight = document.documentElement.clientHeight
        let wrapHeight = 0
        if (this.result && this.result.length > 5) {
          wrapHeight = 250
        } else if (this.result && this.result.length <= 5) {
          wrapHeight = this.result.length * 50
        }
        if (clientHeight - this.top < wrapHeight) {
          // 如果div高度超出底部，div往上移（减去div高度+input高度）
          dom.style.top = this.top - wrapHeight - this.height + 'px'
        } else {
          dom.style.top = this.top + 'px'
        }
        dom.style.left = this.left + 'px'
        dom.style.width = this.width + 'px'
      }
    },
    // 窗口resize时改变下拉框的位置
    changePost(left, top, width, height) {
      const dom = this.$refs['resultWrapper']
      const clientHeight = document.documentElement.clientHeight
      let wrapHeight = 0
      if (this.result && this.result.length > 5) {
        wrapHeight = 250
      } else if (this.result && this.result.length <= 5) {
        wrapHeight = this.result.length * 50
      }
      if (clientHeight - top < wrapHeight) {
        // 如果div高度超出底部，div往上移（减去div高度+input高度）
        dom.style.top = top - wrapHeight - height + 'px'
      } else {
        dom.style.top = top + 'px'
      }
      dom.style.left = left + 'px'
      dom.style.width = width + 'px'
    },
    // 监听键盘上下方向键并激活当前选项
    keydownSelect(event) {
      const e = event || window.event || arguments.callee.caller.arguments[0]
      if (e && e.keyCode === 38) { // 上
        if (this.$refs['resultWrapper']) {
          const items = this.$refs['resultWrapper'].querySelectorAll('.result-item')
          if (items && items.length > 0) {
            this.activeIndex--
            // 滚动条往上滚动
            if (this.activeIndex < 5) {
              this.$refs['resultWrapper'].scrollTop = 0
            }
            if (this.activeIndex === 5) {
              this.$refs['resultWrapper'].scrollTop = 250
            }
            if (this.activeIndex === -1) {
              this.activeIndex = 0
            }
          }
        }
      } else if (e && e.keyCode === 40) { // 下
        if (this.$refs['resultWrapper']) {
          const items = this.$refs['resultWrapper'].querySelectorAll('.result-item')
          if (items && items.length > 0) {
            this.activeIndex++
            // 滚动条往下滚动
            if (this.activeIndex === 5) {
              this.$refs['resultWrapper'].scrollTop = 250
            }
            if (this.activeIndex === 9) { // 防止最后一条数据显示不全
              this.$refs['resultWrapper'].scrollTop = 300
            }
            if (this.activeIndex === items.length) {
              this.activeIndex = 0
              this.$refs['resultWrapper'].scrollTop = 0
            }
          }
        }
      } else if (e && e.keyCode === 13) { // 监听回车事件，并获取当前选中的地址的经纬度等信息
        if (this.result && this.result.length > this.activeIndex) {
          this.setLocation(this.result[this.activeIndex])
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .result-list-wrapper{
    position: absolute;
    max-height: 250px;
    overflow: auto;
    z-index: 9999;
    border: 1px solid #ccc;
    background-color: #fff;
    .result-list {
      .result-item{
        padding: 5px;
        color: #666;
        border-bottom: 1px solid #ccc;
        &:hover {
          background-color: #f5f5f5
          cursor pointer
        }
        &:last-child {
          border-bottom: none
        }
        .result-name {
            font-size: 12px;
            margin-bottom: 0.5rem;
            &.active {
                color: #259bff
            }

        }
        .result-adress {
          font-size: 12px;
          color: #bbb
        }
      }
    }
  }

</style>
