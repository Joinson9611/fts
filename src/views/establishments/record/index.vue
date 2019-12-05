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
        <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="场所类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.system_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测类型" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ reviewMap[scope.row.is_review] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测时间" align="center" width="210px">
        <template slot-scope="scope">
          <i v-show="scope.row.update_time" class="el-icon-time" />
          <span>{{ scope.row.update_time?getTime(scope.row.update_time):'/' }}</span>
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
      :title="historyInfo.is_review === 0 ? '初查' : '复查'"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="51%"
    >
      <div class="history">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称" class="dialog-form-item" prop="building">
                <span>{{ historyInfo.task_name }}</span>
              </el-form-item>
              <el-form-item label="场所类型" class="dialog-form-item">
                <span>{{ historyInfo.system_type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检测时间" class="dialog-form-item">
                <span><i v-show="historyInfo.update_time" class="el-icon-time" /> {{ historyInfo.update_time ? getTime(historyInfo.update_time) : '/' }}</span>
              </el-form-item>
              <el-form-item v-show="historyInfo.is_review === 1" label="是否合格" class="dialog-form-item">
                <span :style="{color:historyInfo.is_pass? '#67C23A':'#F56C6C'}">{{ isPassMap[historyInfo.is_pass] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-show="historyInfo.is_review === 0" label="备注1" class="dialog-form-item">
                  <span>{{ historyInfo.note1 }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-show="historyInfo.is_review === 0" label="备注2" class="dialog-form-item">
                  <span>{{ historyInfo.note2 }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item v-show="historyInfo.is_review === 1" label="备注" class="dialog-form-item">
                  <span>{{ historyInfo.note3 }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item v-if="deviceitem.length !== 0" v-loading="isDeviceItemLoading" label="存在问题" class="dialog-form-item">
                <div class="device-item">
                  <div v-for="(item,key) in deviceitem" :key="key" class="item">
                    <div class="list">
                      <span class="title">{{ item.device_type + '、' }}</span>
                      <span v-show="item.device_type_label !== ''">{{ item.device_type_label }}</span>
                      <span v-for="(deviceItem,index) in item.itemInfo" :key="index">
                        <!-- <span v-show="deviceItem.is_other_problem">{{ deviceItem.other_problem }}</span> -->
                        <span v-show="deviceItem.device_item !== ''"><el-checkbox :checked="deviceItem.value" style="display:inline-block" disabled /> {{ deviceItem.device_item }}</span>
                      </span>
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
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getHistory, getDeviceItems } from '@/api/history5'
import { getTaskList } from '@/api/task5'
import { Formattimestamp } from '@/utils/time'
export default {
  directives: {
    waves
  },
  data() {
    return {
      reviewMap: ['初查', '复查'],
      historyInfo: {
        image: ''
      },
      dialogVisible: false,
      passColor: ['#F56C6C', '#67C23A', '#909399'],
      passMap: ['不合格', '合格', '无'],
      isPassMap: ['不合格', '合格'],
      // 参数-获取检测记录
      paramsGetRecord: {
        task_id: undefined
      },
      task_name: '',
      isDeviceItemLoading: false,
      isRecordListLoadingShow: false,
      // 检测记录信息
      recordTable: [],
      taskOptions: [],
      deviceitem: []
    }
  },
  computed: {
    ...mapGetters(['project_id'])
  },
  created() {
    this.getTaskList()
  },
  methods: {
    openRecordDetail(info) {
      this.dialogVisible = true
      this.historyInfo = Object.assign({}, info)
      const newInfo = Object.assign({}, info)
      // 保留其他问题
      const other_problem = info.other_problem || ''
      this.deviceitem = []
      this.isDeviceItemLoading = true
      getDeviceItems({ system_type_id: info.system_type_id, is_review: info.is_review }).then(res => {
        const item_list = res.data.items
        if (typeof newInfo.device_item === 'string') { newInfo.device_item = JSON.parse(newInfo.device_item) }
        if (item_list.length !== 0) {
          let itemInfo = {
            device_item: undefined,
            value: undefined
          }
          // this.deviceitem = res.data.items
          if (newInfo.device_item.length === 0) {
            this.deviceitem = []
          } else {
            item_list.forEach((item1, index, arr) => {
              newInfo.device_item.forEach((item2) => {
                if (item1.device_item_id === item2.item) {
                  itemInfo = {
                    device_item: undefined,
                    value: undefined,
                    is_other_problem: false
                  }
                  itemInfo.value = !!item2.value
                  itemInfo.device_item = item1.device_item
                  arr[index].itemInfo = itemInfo
                }
                if (item1.device_item_id === -1) {
                  itemInfo = {
                    device_item: '',
                    other_problem,
                    value: false,
                    is_other_problem: true
                  }
                  arr[index].itemInfo = itemInfo
                }
              })
            })
            const itemList = []
            item_list.map(val => {
              let flag = false // 标志两个数组有没相同项
              itemList.map((item, itemIndex) => {
                // 类型一样content数组push
                if (val.device_type === item.device_type) {
                  flag = true
                  itemList[itemIndex].itemInfo.push(val.itemInfo)
                }
              })
              // 没有相同项push
              if (!flag) {
                itemList.push({ device_type: val.device_type, itemInfo: [val.itemInfo], device_type_label: val.device_type_label })
              }
            })
            this.deviceitem = itemList
          }
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
      getHistory(this.paramsGetRecord).then(res => {
        this.recordTable = res.data.items
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
      return Formattimestamp(timestamp)
    },
    getTaskList() {
      getTaskList({ project_id: this.project_id }).then(res => {
        this.taskOptions = res.data.items
        if (res.data.items.length !== 0) {
          this.task_name = res.data.items[0].task_name
          this.paramsGetRecord.task_id = res.data.items[0].task_id
          this.getRecord()
        }
      }).catch(err => {
        console.error(err)
      })
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
    display: -moz-flex;
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .history {
    padding: 10px 0;
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
