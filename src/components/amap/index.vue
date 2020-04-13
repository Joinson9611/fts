<template>
  <div style="position: relative">
    <el-form-item label="项目地址：" prop="sname" size="mini">
      <el-input
        id="sname"
        v-model.trim="addForm.sname"
        clearable
        type="text"
        placeholder="请输入项目具体地址"
        @input="placeAutoInput('sname')"
        @keyup.delete.native="deletePlace('sname')"
        @clear="clearAddress"
      >
        <i
          slot="suffix"
          class="el-icon-location-outline el-input__icon"
          title="具体地址"
        />
      </el-input>
      <div class="map-wrapper">
        <div class="btn-toggle-map">
          <el-button v-show="addForm.sname" type="text" size="mini" @click.stop="snameMapShow = !snameMapShow">{{ snameMapShow ? '收起地图':'展开地图' }}<i :class="snameMapShow ?'el-icon-caret-top':'el-icon-caret-bottom'" /></el-button>
        </div>
        <div v-show="snameMapShow && addForm.sname" id="sNameMap" class="map-self" />
      </div>
    </el-form-item>
    <!--地址模糊搜索子组件-->
    <place-search
      v-if="resultVisible"
      ref="placeSearch"
      class="place-wrap"
      :result="result"
      :left="offsetLeft"
      :top="offsetTop"
      :width="inputWidth"
      :height="inputHeight"
      @getLocation="getPlaceLocation"
    />
  </div>
</template>
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.4.6&key=21d2805b1b3b94b2c35975460006531f&plugin=AMap.Geocoder"></script>
<script src="http://webapi.amap.com/ui/1.0/main.js"></script>
<script>
// import AMap from 'amap'
import placeSearch from './components/placeSearch'

import AMapJS from 'amap-js'

export default {
  props:{
    city:{
      type: Number
    },
    position: {
      type: Object,
    }
  },
  watch: {
    position: {
      handler(item) {
        if (item&&item.slon) {
          this.resultVisible = false
          this.snameMapShow = true
          if(item) {
            this.pickAddress('sname',this.parseNumber(item.slon), this.parseNumber(item.slat))
          } else {
            this.geocoder(item.name, 'sname')
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'place-search': placeSearch
  },
  data() {
    const validatePlace = (rules, value, callback) => {
      if (rules.field === 'sname') {
        if (value === '') {
          callback(new Error('请输入地址'))
        } else {
          if (!this.addForm.slat || this.addForm.slat === 0) {
            callback(new Error('请搜索并选择有经纬度的地点'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      addForm: {
        sname: '', // 地点名称
        slat: 0, // 纬度
        slon: 0 // 经度
      },
      addRules: {
        sname: [{ required: true, validator: validatePlace, trigger: 'change' }]
      },
      inputId: '', // 地址搜索input对应的id
      result: [], // 地址搜索结果
      resultVisible: false, // 地址搜索结果显示标识
      inputWidth: 0, // 搜索框宽度
      inputHeight: 0, // 搜索框高度
      offsetLeft: 0, // 搜索框的左偏移值
      offsetTop: 0, // 搜索框的上偏移值
      snameMap: null, // 地图选址
      snameMapShow: false // 地图选址显示
    }
  },
  mounted() {
    // document添加onclick监听，点击时隐藏地址下拉浮窗
    document.addEventListener('click', this.hiddenMap, false)
    // document添加onclick监听，点击时隐藏地址下拉浮窗
    document.addEventListener('click', this.hidePlaces, false)
    // window添加onresize监听，当改变窗口大小时同时修改地址下拉浮窗的位置
    window.addEventListener('resize', this.changePos, false)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hidePlaces, false)
  },
  methods: {
    hiddenMap(event) {
      if(event.target !== 'canvas.amap-labels') this.snameMapShow = false
    },
    parseNumber(num) {
      return parseFloat(((num * 100000)/100000).toFixed(6))
    },
    clearAddress() {
     this.snameMapShow = false
    },
    placeAutoInput(inputId) {
      const currentDom = document.getElementById(inputId)// 获取input对象
      const keywords = currentDom.value
      if (keywords.trim().length === 0) {
        this.resultVisible = false
      }
      AMap.plugin('AMap.Autocomplete', () => {
        // 实例化Autocomplete
        const autoOptions = {
          city: this.city || '全国',
          citylimit:true
        }
        const autoComplete = new AMap.Autocomplete(autoOptions) // 初始化autocomplete
        // 开始搜索
        autoComplete.search(keywords, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据
          if (result.info === 'OK') {
            const sizeObj = currentDom.getBoundingClientRect() // 取得元素距离窗口的绝对位置
            this.inputWidth = currentDom.clientWidth// input的宽度
            this.inputHeight = currentDom.clientHeight + 2// input的高度，2是上下border的宽
            // input元素相对于页面的绝对位置 = 元素相对于窗口的绝对位置
            this.offsetTop = sizeObj.top + this.inputHeight // 距顶部
            this.offsetLeft = sizeObj.left // 距左侧
            this.result = result.tips
            this.inputId = inputId
            this.resultVisible = true
          }
        })
      })
    },
    // 隐藏搜索地址下拉框
    hidePlaces(event) {
      const target = event.target
      // 排除点击地址搜索下拉框
      if (target.classList.contains('address')) {
        return
      }
      this.resultVisible = false
    },
    // 修改搜索地址下拉框的位置
    changePos() {
      if (this.inputId && this.$refs['placeSearch']) {
        const currentDom = document.getElementById(this.inputId)
        const sizeObj = currentDom.getBoundingClientRect() // 取得元素距离窗口的绝对位置
        // 元素相对于页面的绝对位置 = 元素相对于窗口的绝对位置
        const inputWidth = currentDom.clientWidth// input的宽度
        const inputHeight = currentDom.clientHeight + 2// input的高度，2是上下border的宽
        const offsetTop = sizeObj.top + inputHeight// 距顶部
        const offsetLeft = sizeObj.left // 距左侧
        this.$refs['placeSearch'].changePost(offsetLeft, offsetTop, inputWidth, inputHeight)
      }
    },
    // 获取子组件返回的位置信息
    getPlaceLocation(item) {
      if (item) {
        this.resultVisible = false
        if (item.location && item.location.getLat()) {
          this.pickAddress(this.inputId, item.location.getLng(), item.location.getLat())
          this.$emit('getPos',this.addForm)
        } else {
          this.geocoder(item.name, this.inputId)
        }
      }
    },
    // 地图选址
    pickAddress(inputId, lon, lat) {
      if (inputId === 'sname') {
        this.snameMapShow = true
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          this.snameMap = new AMap.Map('sNameMap', {
            zoom: 16,
            scrollWheel: true,
            center: [lon, lat]
          })
          const positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: this.snameMap
          })
          positionPicker.on('success', (positionResult) => {
            this.addForm.slat = positionResult.position.lat
            this.addForm.slon = positionResult.position.lng
            this.addForm.sname = positionResult.address
            this.$emit('getPos',this.addForm)
          })
          positionPicker.on('fail', (positionResult) => {
            this.$message.error('地址选取失败')
          })
          positionPicker.start()
        })
      }
    },
    // 地理编码
    geocoder(keyword, inputValue) {
      const geocoder = new AMap.Geocoder({
        // city: "010", //城市，默认：“全国”
        radius: 1000 // 范围，默认：500
      })
      // 地理编码,返回地理编码结果
      geocoder.getLocation(keyword, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const geocode = result.geocodes
          if (geocode && geocode.length > 0) {
            if (inputValue === 'sname') {
              this.addForm.slat = geocode[0].location.getLat()
              this.addForm.slon = geocode[0].location.getLng()
              this.addForm.sname = keyword
              // 如果地理编码返回的粗略经纬度数据不需要在地图上显示，就不需要调用地图选址，且要隐藏地图
              // this.pickAddress("sname", geocode[0].location.getLng(), geocode[0].location.getLat());
              this.snameMapShow = false
            }
          }
        }
      })
    },
    // 做删除操作时还原经纬度并验证字段
    deletePlace(inputId) {
      if (inputId === 'sname') {
        this.addForm.slat = 0
        this.addForm.slon = 0
      }
    }
  }
}
</script>
<style lang="scss" scopde >
    .map-wrapper {
      position: absolute;
      z-index: 1000;
      top:23px;
      left: 0;
      width: 100%;
      /deep/.el-button--mini, .el-button--mini.is-round {
        padding: 0 8px;
      }
      .btn-toggle-map {
        text-align: right;
      }
      .map-self {
        border: 1px solid #C0C4CC;
        border-radius: 4px;
        height: 200px;
        width: 100%;
      }
    }
</style>
