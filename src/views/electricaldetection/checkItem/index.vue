<template>
  <div class="app-container">
    <div class="filter-container">
      <!--系统类型筛选-->
      <el-select v-model="paramsGetRecord.system_type_id" placeholder="系统类型" filterable clearable style="width: 244px" class="filter-item" @change="systemOptionsChange">
        <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
      </el-select>
      <!-- 设备类型筛选 -->
      <el-select v-model="paramsGetRecord.device_type_id" placeholder="设备类型" filterable clearable style="width: 175px" class="filter-item" @change="deviceOptionsChange">
        <el-option v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id" />
      </el-select>
      <!-- 是否合格 -->
      <el-select v-model="paramsGetRecord.is_pass" filterable placeholder="是否合格" style="width: 120px" clearable class="filter-item" @change="passChange">
        <el-option v-for="(item,key) in ['不合格','合格']" :key="key" :label="item" :value="key" />
      </el-select>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isRecordListLoadingShow"
      :data="recordTable"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(paramsGetRecord.page - 1) * paramsGetRecord.limit + 1 }} </span></template>
      </el-table-column>
      <!-- <el-table-column label="任务名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openRecordDetail(scope.row)">{{ scope.row.task_name }}</a>
        </template>
      </el-table-column> -->
      <el-table-column label="系统类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.system_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="具体位置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否合格" align="center" width="88px">
        <template slot-scope="scope">
          <span :style="{color:scope.row.is_pass? '#67C23A':'#F56C6C'}">{{ isPassMap[scope.row.is_pass] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测时间" align="center" width="120px">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time? getTime2(scope.row.create_time): '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="102">
        <template slot-scope="scope">
          <el-button
            class="btn"
            type="success"
            size="mini"
            plain
            @click="openRecordDetail(scope.row)"
          >
            查看记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetRecord.page" :limit.sync="paramsGetRecord.limit" @pagination="getRecord" />
    <el-drawer
      title="记录详情"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="51%"
    >
      <div class="history">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" class="dialog-form-item" prop="building">
                <span>{{ historyInfo.project_name }}</span>
              </el-form-item>
              <el-form-item label="备注" class="dialog-form-item">
                <span>{{ historyInfo.note || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="是否合格" class="dialog-form-item">
                <span :style="{color:historyInfo.is_pass? '#67C23A':'#F56C6C'}">{{ isPassMap[historyInfo.is_pass] }}</span>
              </el-form-item>
              <el-form-item label="检测时间" class="dialog-form-item">
                <span><i v-show="historyInfo.create_time" class="el-icon-time" /> {{ historyInfo.create_time? getTime2(historyInfo.create_time): '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="系统类型" class="dialog-form-item">
                <span>{{ historyInfo.system_type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型" class="dialog-form-item">
                <span>{{ historyInfo.device_type }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="具体位置" class="dialog-form-item">
                <span>{{ historyInfo.label }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="imageUrl.length !== 0">
            <el-col :span="24">
              <el-form-item label="检测照片" class="dialog-form-item">
                <div class="image-wrapper">
                  <viewer :images="imageUrl">
                    <img v-for="(url,index) in imageUrl" :key="index" :src="url" class="image">
                  </viewer>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item v-loading="isDeviceItemLoading" label="单项评定结果" class="dialog-form-item">
                <div class="device-item">
                  <div v-for="(item,key) in deviceitem" :key="key" class="item">
                    <div class="list">
                      <span class="title">{{ `(${item.device_item_id})${item.device_item}` }}</span>：<span class="content" :style="{color:passColor[item.isPass]}">{{ passMap[item.isPass] }}</span>
                    </div>
                    <div class="list">
                      <span class="title">等级：</span><span class="content" :style="{color:gradeColor(item.grade)}">{{ item.grade }}</span>
                    </div>
                    <div class="list">
                      <span class="title">检测标准：</span><span class="content">{{ item.testing_standard }}</span>
                    </div>
                    <el-divider />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
    <!--历史记录详情-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getFloorList } from '@/api/floor1'
import { getCheckItemList } from '@/api/history3s'
import { getSystemTypes } from '@/api/system'
import { getDeviceTypes3 } from '@/api/device'
import { Formattimestamp, Formattimestamp2 } from '@/utils/time'
import { getDeviceItems3 } from '@/api/deviceitem'
export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      historyInfo: {
        image: ''
      },
      dialogVisible: false,
      passColor: ['#F56C6C', '#67C23A', '#909399'],
      passMap: ['不合格', '合格', '无'],
      isPassMap: ['不合格', '合格'],
      // 参数-获取检测记录
      paramsGetRecord: {
        project_id: this.project_id,
        page: 1,
        limit: 20,
        system_type_id: undefined,
        device_type_id: undefined,
        is_pass: undefined	// -1=所有、0=不合格、1=合格
      },
      task_name: '',
      isDeviceItemLoading: false,
      isRecordListLoadingShow: false,
      // 检测记录信息
      recordTable: [],
      total: 0,
      systemListOptions: [],
      deviceTypeOptions: [],
      taskOptions: [],
      deviceitem: []
    }
  },
  computed: {
    ...mapGetters(['company_id', 'project_type_id', 'project_id']),
    imageUrl() {
      let imgList
      if (this.historyInfo.image === '') {
        imgList = []
      } else {
        imgList = this.historyInfo.image.split(',').map(item => process.env.VUE_APP_FILE_API + item)
      }
      return imgList
    }
  },
  created() {
    this.getSystemTypes()
    this.getRecord()
  },
  methods: {
    gradeColor(grade) {
      switch (grade) {
        case 'A':
          return '#F56C6C'
        case 'B':
          return '#E6A23C'
        default:
          return '#67C23A'
      }
    },
    openRecordDetail(info) {
      this.dialogVisible = true
      this.historyInfo = Object.assign({}, info)
      this.deviceitem = []
      this.isDeviceItemLoading = true
      getDeviceItems3({ device_type_id: info.device_type_id }).then(res => {
        const item_list = res.data.items
        if (item_list.length !== 0) {
          // this.deviceitem = res.data.items
          info.device_item.split(',').forEach((item, index) => {
            item_list[index].isPass = item
            // device_item_id 不足补0
            item_list[index].device_item_id = item_list[index].device_item_id.length === 6 ? item_list[index].device_item_id : '0' + item_list[index].device_item_id
          })
          this.deviceitem = item_list
        }
        this.isDeviceItemLoading = false
      }).catch(err => {
        this.isDeviceItemLoading = false
        console.error(err)
      })
    },
    // 未建立检测任务执行的操作
    hasTask(val) {
      if (val) {
        if (this.taskOptions.length === 0) this.$message({ type: 'warning', message: '你还未建立检测任务' })
      }
    },
    getRecord() {
      this.isRecordListLoadingShow = true
      this.paramsGetRecord.project_id = this.project_id
      getCheckItemList(this.paramsGetRecord).then(res => {
        this.total = res.data.total
        this.recordTable = res.data.items
        this.isRecordListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isRecordListLoadingShow = false
      })
    },
    getTime(timestamp) {
      return Formattimestamp(timestamp)
    },
    getTime2(timestamp) {
      return Formattimestamp2(timestamp)
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ project_type_id: this.project_type_id }).then(res => {
        this.systemListOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    getDeviceTypes(id) {
      const params = {
        system_type_id: id
      }
      getDeviceTypes3(params).then(response => {
        this.deviceTypeOptions = response.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    getFloorList(id) {
      getFloorList({ building_id: id }).then(res => {
        this.floorOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 系统类型改变
    systemOptionsChange(id) {
      this.paramsGetRecord.device_type_id = undefined
      // 如果系统列表清空执行
      if (id === '') {
        this.paramsGetRecord.system_type_id = undefined
        this.deviceTypeOptions = []
      } else {
        this.getDeviceTypes(id)
      }
      this.paramsGetRecord.page = 1
      this.getRecord()
    },
    buildChange(id) {
      this.paramsGetRecord.floor_id = undefined
      // 如果建筑列表清空执行
      if (id === '') {
        this.paramsGetRecord.building_id = undefined
        this.floorOptions = []
      } else {
        this.getFloorList(id)
      }
      this.paramsGetRecord.page = 1
      this.getRecord()
    },
    floorChange(id) {
      if (id === '') {
        this.paramsGetRecord.floor_id = undefined
      } else {
        this.paramsGetRecord.floor_id = id
      }
      this.paramsGetRecord.page = 1
      this.getRecord()
    },
    passChange(id) {
      if (id === '') {
        this.paramsGetRecord.is_pass = undefined
      } else {
        this.paramsGetRecord.is_pass = id
      }
      this.paramsGetRecord.page = 1
      this.getRecord()
    },
    // 设备类型改变
    deviceOptionsChange(id) {
      if (id === '') {
        this.paramsGetRecord.device_type_id = undefined
      }
      this.paramsGetRecord.page = 1
      this.getRecord()
    }
  }
}
</script>

<style scoped lang="scss">
  .taskSelect{
    display: inline-block;
    height: 100%;
    font-size: 14px;
    margin-bottom: 10px;
    vertical-align: top;
    /deep/.filter-item{
      margin-bottom: 0;
    }
  }
  .image-wrapper {
     margin-top: 12px;
    .image{
      width: 170px;
      height: 120px;
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .history {
    flex: 1;
    overflow: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .device-item {
      /deep/.el-divider--horizontal {
        margin: 0;
      }
      .item {
        .list{
          font-size: 14px;
          .title {
            height: 30px;
            line-height: 30px;
            color:#303133;
          }
          .content {
            height: 30px;
            line-height: 30px;
            color:#909399;
          }
        }
      }
    }
    /deep/.el-form-item__content {
      span {
        color: #99a9bf;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
  }

</style>
