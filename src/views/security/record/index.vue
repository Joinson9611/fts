<template>
  <div class="app-container">
    <div class="filter-container">
      <!--任务筛选-->
      <div class="taskSelect">
        <span>当前任务名称：</span>
        <el-select v-model="paramsGetRecord.task_id" placeholder="任务列表" filterable style="width: 190px" class="filter-item" @change="taskChange" @visible-change="hasTask">
          <el-option v-for="item in taskOptions" :key="item.task_id" :label="item.name" :value="item.task_id" />
        </el-select>
      </div>
      <!--系统类型筛选-->
      <el-select v-model="paramsGetRecord.system_type_id" placeholder="分项" filterable clearable style="width: 244px" class="filter-item" @change="systemOptionsChange">
        <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
      </el-select>
      <!-- 设备类型筛选 -->
      <el-select v-model="paramsGetRecord.device_type_id" placeholder="单项" filterable clearable style="width: 175px" class="filter-item" @change="deviceOptionsChange">
        <el-option v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id" />
      </el-select>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isRecordListLoadingShow"
      :data="recordTable"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      :span-method="recordMerage"
      fit
      highlight-current-row
    >
      <el-table-column label="分项" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.system_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单项" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评估时间" align="center" width="210px">
        <template slot-scope="scope">
          <i v-show="scope.row.update_time" class="el-icon-time" />
          <span>{{ scope.row.update_time? getTime(scope.row.update_time) : '/' }}</span>
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
    <el-drawer
      title="记录详情"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="100%"
    >
      <div class="history">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称" class="dialog-form-item" prop="building">
                <span>{{ historyInfo.task_name }}</span>
              </el-form-item>
              <el-form-item label="评估时间" class="dialog-form-item">
                <span><i v-show="historyInfo.update_time" class="el-icon-time" /> {{ historyInfo.update_time?getTime(historyInfo.update_time):'/' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分项" class="dialog-form-item">
                <span>{{ historyInfo.system_type }}</span>
              </el-form-item>
              <el-form-item label="单项" class="dialog-form-item">
                <span>{{ historyInfo.device_type }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item v-loading="isDeviceItemLoading" label="评估表" class="dialog-form-item">
                <el-table
                  v-loading="isRecordListLoadingShow"
                  :data="deviceitem"
                  element-loading-text="Loading"
                  style="width: 100%;"
                  border
                  fit
                  :span-method="tableMerage"
                  highlight-current-row
                >
                  <el-table-column label="子项名称" align="center" width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.device_item_label }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="historyInfo.system_type !== 'C 消防安全管理'" label="检测内容" align="center" width="140">
                    <template slot-scope="scope">
                      <span>{{ scope.row.device_item }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="检查细则" align="left">
                    <template slot-scope="scope">
                      <span style="white-space: pre-line;">{{ scope.row.testing_standard }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="检查情况" align="center" width="180">
                    <template slot-scope="scope">
                      <span>{{ scope.row.problem }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评定结果" width="80" align="center">
                    <template slot-scope="scope">
                      <span :style="{color :gradeColor(scope.row.result)}">{{ scope.row.result }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="子项分数" width="80" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.score }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否检测" width="80" align="center">
                    <template slot-scope="scope">
                      <span :style="{color: scope.row.checked? '#67C23A' : '#F56C6C'}">{{ checkMap[ scope.row.checked ] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getHistory, getHistoryDetail } from '@/api/history4'
import { getProjectList } from '@/api/project4s'
import { getSystemTypes } from '@/api/system'
import { getDeviceTypes } from '@/api/device'
import { Formattimestamp2 } from '@/utils/time'
export default {
  directives: {
    waves
  },
  data() {
    return {
      checkMap: ['未检', '有检'],
      historyInfo: {},
      dialogVisible: false,
      passColor: ['#F56C6C', '#67C23A', '#909399'],
      // 参数-获取检测记录
      paramsGetRecord: {
        task_id: undefined,
        system_type_id: undefined,
        device_type_id: undefined
      },
      task_name: '',
      isDeviceItemLoading: false,
      isRecordListLoadingShow: false,
      recordTable: [],
      total: 0,
      systemListOptions: [],
      deviceTypeOptions: [],
      taskOptions: [],
      buildingOptions: [],
      floorOptions: [],
      deviceitem: [],
      spanArr: [],
      spanArr2: []
    }
  },
  computed: {
    ...mapGetters(['project_id'])
  },
  created() {
    this.getTaskList()
    this.getSystemTypes()
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
      getHistoryDetail({ history_id: info.history_id }).then(res => {
        this.deviceitem = res.data
        this.merage1()
        this.isDeviceItemLoading = false
      }).catch(err => {
        this.isDeviceItemLoading = false
        console.error(err)
      })
    },
    // 未建立检测任务执行的操作
    hasTask(val) {
      if (val) {
        if (this.taskOptions.length === 0) this.$message({ type: 'warning', message: '你还未建立评估任务' })
      }
    },
    merage() {
      this.spanArr = []
      let contactDot = 0
      this.recordTable.forEach((item, index) => {
        // 第一个次循环做特殊处理
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          // 如果当前的系统类型与前一个相同contact所对应的的数组元素要加1
          if (item.system_type === this.recordTable[index - 1].system_type) {
            this.spanArr.push(0)
            this.spanArr[contactDot] += 1
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
    },
    merage1() {
      this.spanArr1 = []
      let contactDot = 0
      this.deviceitem.forEach((item, index) => {
        // 第一个次循环做特殊处理
        if (index === 0) {
          this.spanArr1.push(1)
        } else {
          // 如果当前的系统类型与前一个相同contact所对应的的数组元素要加1
          if (item.device_item_label === this.deviceitem[index - 1].device_item_label) {
            this.spanArr1.push(0)
            this.spanArr1[contactDot] += 1
          } else {
            contactDot = index
            this.spanArr1.push(1)
          }
        }
      })
    },
    recordMerage({ row, column, rowIndex, columnIndex }) {
      if (this.recordTable.length !== 0) {
        // 表格的第一列
        if (columnIndex === 0) {
          if (this.spanArr[rowIndex]) {
            return {
              rowspan: this.spanArr[rowIndex],
              colspan: 1
            }
          } else {
            return [0, 0]
          }
        }
      }
    },
    tableMerage({ row, column, rowIndex, columnIndex }) {
      if (this.deviceitem.length !== 0) {
        // 表格的第一列
        if (columnIndex === 0) {
          if (this.spanArr1[rowIndex]) {
            return {
              rowspan: this.spanArr1[rowIndex],
              colspan: 1
            }
          } else {
            return [0, 0]
          }
        }
      }
    },
    getRecord() {
      this.isRecordListLoadingShow = true
      getHistory(this.paramsGetRecord).then(res => {
        this.total = res.data.total
        this.recordTable = res.data.items
        this.merage()
        this.isRecordListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isRecordListLoadingShow = false
      })
    },
    taskChange(id) {
      this.paramsGetRecord.task_id = id
      this.getRecord()
    },
    getTime(timestamp) {
      return Formattimestamp2(timestamp)
    },
    getTaskList() {
      getTaskList({ project_id: this.project_id }).then(res => {
        if (res.data.items.length !== 0) {
          this.taskOptions = res.data.items
          this.task_name = res.data.items[0].task_name
          this.paramsGetRecord.task_id = res.data.items[0].task_id
          this.getRecord()
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ task_type_id: 4 }).then(res => {
        this.systemListOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    getDeviceTypes(id) {
      const params = {
        system_type_id: id
      }
      getDeviceTypes(params).then(response => {
        this.deviceTypeOptions = response.data.items
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
      if (this.paramsGetRecord.task_id) this.getRecord()
    },
    // 设备类型改变
    deviceOptionsChange(id) {
      if (id === '') {
        this.paramsGetRecord.device_type_id = undefined
      }
      this.paramsGetRecord.page = 1
      if (this.paramsGetRecord.task_id) this.getRecord()
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
    padding-bottom: 10px;
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
