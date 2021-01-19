<template>
  <div class="app-container">
    <div class="filter-container">
      <!--分项筛选-->
      <el-select v-model="paramsGetHistory.system_type_id" placeholder="分项" filterable clearable style="width: 244px" class="filter-item" @change="systemOptionsChange">
        <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
      </el-select>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isHistoryLoadingShow"
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
      <el-table-column label="是否完成" align="center">
        <template slot-scope="scope">
          <span :style="{color:scope.row.checked? '#67C23A': '#F56C6C'}">{{ checkMap[scope.row.checked] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总项" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.count_all }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成项" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count_checked }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.score === -1? '**' : scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="102">
        <template slot-scope="scope">
          <el-button
            class="btn"
            type="success"
            size="mini"
            plain
            @click="openHistoryitem(scope.row)"
          >
            查看子项
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="title"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="100%"
    >
      <div class="historyitem">
        <el-table
          v-loading="isHistoryitemListLoadingShow"
          :data="deviceitem"
          element-loading-text="Loading"
          style="width: 100%;"
          border
          fit
          :span-method="tableMerage"
          highlight-current-row
        >
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.device_sub_type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="子项" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.device_item }}</span>
            </template>
          </el-table-column>
          <el-table-column label="评定结果" align="center" width="90">
            <template slot-scope="scope">
              <span :style="{color:resultColor[scope.row.result]}">{{ resultMap[scope.row.result] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="得分" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ (scope.row.checked && scope.row.result !== 0) ? scope.row.score : '**' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否完成" align="center" width="90">
            <template slot-scope="scope">
              <span :style="{color:scope.row.checked? '#67C23A': '#F56C6C'}">{{ checkMap[scope.row.checked] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="102">
            <template slot-scope="scope">
              <el-button
                class="btn"
                type="success"
                size="mini"
                plain
                @click="openHistoryitemDetail(scope.row.history_item_id,scope.row.device_item_id)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          title="查看详情"
          direction="ltr"
          size="50%"
          :append-to-body="true"
          :visible.sync="detailVisible"
        >
          <el-drawer
            title="问题详情"
            direction="ltr"
            size="50%"
            :append-to-body="true"
            :visible.sync="problemDetailVisible"
          >
            <div class="problemDetail">
              <div class="content">
                <ul>
                  <li class="item">
                    所属类别: <span>{{ problemDetail.system_type }}</span>
                  </li>
                  <li class="item">
                    所属小类: <span>{{ problemDetail.device_type }}</span>
                  </li>
                  <li class="item">
                    问题详情: <span>{{ problemDetail.problem || '-' }}</span>
                  </li>
                  <li class="item">
                    对策与措施: <span>{{ problemDetail.suggestion || '-' }}</span>
                  </li>
                  <li class="item">
                    检测依据: <span>{{ problemDetail.basis || '-' }}</span>
                  </li>
                  <li class="item">
                    风险可能产生的后果: <span>{{ problemDetail.aftermath || '-' }}</span>
                  </li>
                  <li class="item">
                    所在位置: <span>{{ problemDetail.address || '-' }}</span>
                  </li>
                  <li class="item">
                    风险程度: <span :style="{color:riskColorMap[problemDetail.risk]}">{{ riskMap[problemDetail.risk] }}</span>
                  </li>
                  <li class="item">
                    重大火灾隐患: <span :style="{color:problemDetail.is_fire_hazard? '#67C23A': '#F56C6C'}">{{ isOrNot[problemDetail.is_fire_hazard] }}</span>
                  </li>
                  <li class="item">
                    不符合检查项个数: <span>{{ problemDetail.incomformity_count }}</span>
                  </li>
                  <li v-if="imageUrl.length !== 0" class="item">
                    现场照片
                    <div class="image-wrapper">
                      <viewer :images="imageUrl">
                        <img v-for="(url,index) in imageUrl" :key="index" :src="url" class="image">
                      </viewer>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-drawer>
          <div class="historyitemDetail">
            <div class="title">
              <div class="main">{{ historyItemDetail.device_item }}</div>
              <div class="article">条纹编号：{{ historyItemDetail.grade }}</div>
            </div>
            <div class="content">
              <ul class="deviceItem">
                <li class="item">
                  评定结果: <span :style="{color:resultColor[historyItemDetail.result]}">{{ resultMap[historyItemDetail.result] }}</span>
                </li>
                <li class="item">
                  是否完成: <span :style="{color:historyItemDetail.checked? '#67C23A': '#F56C6C'}">{{ checkMap[historyItemDetail.checked] }}</span>
                </li>
                <li class="item">
                  子项得分: <span>{{ (historyItemDetail.checked && historyItemDetail.result !==0) ? historyItemDetail.score : '**' }}</span>
                </li>
                <li class="item" style="padding-bottom: 0">
                  问题列表
                  <div class="problemList">
                    <ul v-if="historyItemDetail.problemList.length !== 0">
                      <li v-for="(item,index) in historyItemDetail.problemList" :key="item.problem_id" class="pro" @click="openProblemDetail(item)">{{ `${index + 1}.${item.problem}` }}</li>
                    </ul>
                    <div v-else class="pro" style="padding-bottom: 10;cursor: auto">无</div>
                  </div>
                </li>
                <li class="item">
                  修改时间: <span>{{ historyItemDetail.update_time ? getTime(historyItemDetail.update_time) : '-' }}</span>
                </li>
                <li v-if="imageUrl.length !== 0" class="item">
                  现场照片
                  <div class="image-wrapper">
                    <viewer :images="imageUrl">
                      <img v-for="(url,index) in imageUrl" :key="index" :src="url" class="image">
                    </viewer>
                  </div>
                </li>
                <li class="item">
                  检查情况: <span>{{ historyItemDetail.note || '-' }}</span>
                </li>
                <li class="item">
                  <div>检查细则</div>
                  <div class="standard">{{ historyItemDetail.testing_standard }}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getProblem } from '@/api/problem4s'
import { getHistory } from '@/api/history4'
import { getHistoryitem, getHistoryitemDetail } from '@/api/historyitem4s'
import { getSystemTypes } from '@/api/system'
import { Formattimestamp2 } from '@/utils/time'
export default {
  directives: {
    waves
  },
  data() {
    return {

      riskMap: ['-', '低', '中', '高'],
      isOrNot: ['无', '有'],
      riskColorMap: ['#909399', '#67C23A', '#E6A23C', '#F56C6C'],

      checkMap: ['否', '是'],
      historyItemDetail: {
        image: '',
        problemList: []
      },
      problemDetail: {
        image: ''
      },

      resultMap: ['无此项', 'A', 'B', 'C', 'D'],

      problemDetailVisible: false,
      dialogVisible: false,
      detailVisible: false,
      resultColor: ['#909399', '#F56C6C', '#E6A23C', '#67C23A', '#909399'],
      // 参数-获取检测记录
      paramsGetHistory: {
        project_id: undefined,
        system_type_id: undefined
      },
      title: '',
      project_name: '',
      isHistoryLoadingShow: false,
      isHistoryitemListLoadingShow: false,
      recordTable: [],
      total: 0,
      systemListOptions: [],
      deviceTypeOptions: [],
      projectOptions: [],
      buildingOptions: [],
      floorOptions: [],
      deviceitem: [],
      spanArr: [],
      spanArr2: []
    }
  },
  computed: {
    ...mapGetters(['project_id']),
    imageUrl() {
      let imgList = []
      if (this.historyItemDetail.image === '') {
        imgList = []
      } else {
        imgList = this.historyItemDetail.image.split(',').map(item => process.env.VUE_APP_FILE_API + item)
      }
      return imgList
    }
  },
  created() {
    this.getSystemTypes()
    this.getHistory()
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
    openHistoryitem(info) {
      this.dialogVisible = true
      this.deviceitem = []
      this.isHistoryitemListLoadingShow = true
      this.title = info.device_type
      getHistoryitem({ history_id: info.history_id, project_id: this.project_id }).then(res => {
        this.deviceitem = res.data.items
        this.merage1()
        this.isHistoryitemListLoadingShow = false
      }).catch(err => {
        this.isHistoryitemListLoadingShow = false
        console.error(err)
      })
    },
    openProblemDetail(info) {
      this.problemDetailVisible = true
      this.problemDetail = info
    },
    openHistoryitemDetail(history_item_id, device_item_id) {
      this.detailVisible = true
      const params = {
        project_id: this.project_id,
        history_item_id
      }
      getHistoryitemDetail(params).then(res => {
        const data = res.data
        const params = {
          project_id: this.project_id,
          is_problem: 1,
          device_item_id: device_item_id
        }
        getProblem(params).then(res => {
          data.problemList = res.data.items
          this.historyItemDetail = data
        }).catch(err => {
          console.error(err)
        })
      }).catch(err => {
        console.error(err)
      }
      )
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
          if (item.device_sub_type === this.deviceitem[index - 1].device_sub_type) {
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
    getHistory() {
      this.isHistoryLoadingShow = true
      this.paramsGetHistory.project_id = this.project_id
      getHistory(this.paramsGetHistory).then(res => {
        this.total = res.data.total
        this.recordTable = res.data.items
        this.merage()
        this.isHistoryLoadingShow = false
      }).catch(err => {
        this.isHistoryLoadingShow = false
        console.error(err)
      })
    },
    getTime(timestamp) {
      return Formattimestamp2(timestamp)
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ project_type_id: 4 }).then(res => {
        this.systemListOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 系统类型改变
    systemOptionsChange(id) {
      // 如果系统列表清空执行
      if (id === '') {
        this.paramsGetHistory.system_type_id = undefined
        this.deviceTypeOptions = []
      }
      this.getHistory()
    }
  }
}
</script>

<style scoped lang="scss">
  .historyitemDetail {
    overflow: auto;
    .title {
      text-align: center;
      .main {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .article {
        font-size: 16px;
        color: #C0C4CC;
      }
    }
    .content {
      font-family:'arial';
      padding: 20px;
      .deviceItem {
        .item {
          font-size: 15px;
          padding: 10px 0 ;
          border-bottom: 1px solid rgba(144,147,153,0.3);
          &:last-child {
            border-bottom: none;
          }
          span {
            font-size: 14px;
            color: #909399;
          }
          .standard {
            margin-top: 10px;
            font-size: 14px;
            white-space: pre-line;
            color: #909399;
            line-height: 20px;
          }
          .problemList {
            padding: 0 10px;
            .pro {
              word-break:break-all;
              cursor: pointer;
              padding: 10px 0 ;
              font-size: 14px;
              color: #909399;
              border-bottom: 1px solid rgba(144,147,153,0.3);
              &:last-child {
                border-bottom: none
              }
            }
          }
        }
      }
    }
  }
  .projectSelect{
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
    font-size: 0;
    margin-top: 12px;
    .image{
      cursor: zoom-in;
      width: 170px;
      height: 120px;
      margin-right: 5px;
      margin-bottom: 5px;
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
  .historyitem {
    flex: 1;
    overflow: auto;
    padding-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .device-item {
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
  .problemDetail {
    overflow: auto;
    .content {
      .image-wrapper {
        font-size: 0;
        margin-top: 12px;
        .image{
          width: 170px;
          height: 120px;
          margin-right: 5px;
          margin-bottom: 5px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      font-family:'arial';
      padding: 20px;
      ul {
        .item {
          word-break:break-all;
          line-height: 16px;
          font-size: 15px;
          padding: 10px 0 ;
          border-bottom: 1px solid rgba(144,147,153,0.3);
          &:last-child {
            border-bottom: none;
          }
          span {
            font-size: 14px;
            color: #909399;
          }
          .standard {
            margin-top: 10px;
            font-size: 14px;
            white-space: pre-line;
            color: #909399;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
