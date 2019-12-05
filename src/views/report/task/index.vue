<template>
  <div class="main-page">
    <!-- <div class="block">
      <el-carousel height="180px">
        <el-carousel-item v-for="item in 3" :key="item">
          <img :src="getAdImage(item)" class="ad-image">
        </el-carousel-item>
      </el-carousel>
    </div> -->
    <hr class="divider-big">
    <div>
      <el-row class="info-item">
        <h4 class="reportInfo-title">报告信息</h4>
        <el-col :span="20">
          <el-form ref="formDevicesInfo" :model="reportInfo" label-width="90px">
            <el-form-item class="reportInfo-item" label="项目名称 ：">
              <span>{{ reportInfo.project_name }}</span>
            </el-form-item>
            <el-form-item class="reportInfo-item" label="项目地址 ：">
              <span>{{ reportInfo.address }}</span>
            </el-form-item>
            <el-form-item class="reportInfo-item" label="单位名称 ：">
              <span>{{ reportInfo.constructing_unit }}</span>
            </el-form-item>
            <el-form-item class="reportInfo-item" label="检测单位 ：">
              <span>{{ reportInfo.testing_unit }}</span>
            </el-form-item>
            <!-- <el-form-item class="reportInfo-item" label="是否完成 ：">
              <span>{{ reportInfo.is_finished }}</span>
            </el-form-item> -->
            <el-form-item class="reportInfo-item" label="完成日期 ：">
              <span>{{ reportInfo.finished_time ? getTime(reportInfo.finished_time) : '/' }}</span>
            </el-form-item>
            <el-form-item class="reportInfo-item" label="报告文件 ：">
              <a style="color: #409EFF" @click="downloadReport(reportInfo.report_path)">{{ reportInfo.report_code }}</a>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--设备没有巡检过-->
      <!-- <div v-if="!isDeviceCheck" class="info-no-item" style="text-align: center">
        <span>暂时没有巡检记录</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getReportInfo } from '@/api/wechatscan.js'
import { Formattimestamp2 } from '@/utils/time.js'
export default {
  data() {
    return {
      reportInfo: {
        project_name: '',
        address: '',
        constructing_unit: '',
        testing_unit: '',
        is_finished: '',
        is_reported: '',
        report_code: '',
        report_path: ''
      },
      requestParams: {
        task_type_id: undefined,
        task_id: undefined
      }
    }
  },
  created() {
    this.getParams()
    this.getreportInfo()
  },
  methods: {
    downloadReport(fileurl) {
      if (fileurl) {
        const file = process.env.VUE_APP_FILE_API + fileurl
        window.open(file)
      }
    },
    /**
     * @Description: 获取url中的参数
     * @Date: 2019/5/7
     **/
    getParams() {
      this.requestParams.task_type_id = this.$route.query.type.toString()
      this.requestParams.task_id = this.$route.query.id.toString()
    },
    /**
     * @Description: 获取设备详情
     * @Date: 2019/5/7
     **/
    getreportInfo() {
      getReportInfo(this.requestParams).then(res => {
        this.reportInfo = Object.assign({}, res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 时间格式转换
     * @Date: 2019/5/7
     **/
    getTime(time) {
      return Formattimestamp2(time)
    }
  }
}
</script>

<style scoped>
.main-page{
  background-color: #eeeeee;
  width: 100%;
  height: 100%;
}
.info-item{
  background-color: #ffffff;
  padding: 20px;
}
.info-no-item{
  background-color: #ffffff;
  padding: 48px;
}
.reportInfo-title{
  margin-top: 0;
}
.reportInfo-item{
  margin-bottom: 0;
}
.device-image{
  float: right;
  margin-top: 0;
  width: 72px;
  height: 72px;
}
.ad-image{
  width:100%;
  height: auto;
}
.item-image{
  margin-right: 10px;
  width: 96px;
  height: 96px;
}
</style>
