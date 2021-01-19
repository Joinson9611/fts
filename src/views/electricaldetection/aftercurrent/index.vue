<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 是否合格筛选 -->
      <el-select v-model="paramsGetAftercurrent.is_pass" placeholder="结果判定" filterable clearable style="width: 106px" class="filter-item" @change="passChange">
        <el-option v-for="item in passOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isAftercurrentListLoading"
      :data="aftercurrentList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogAftercurrent(scope.row)"><i>{{ scope.row.device_name }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="型号/规格" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仪器名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.testing_address || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检定时间" align="center">
        <template slot-scope="scope">
          <span>{{ getTime(scope.row.testing_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果判定" align="center" width="90">
        <template slot-scope="scope">
          <span :style="{color:scope.row.is_pass? '#67C23A': '#F56C6C'}">{{ passMap[scope.row.is_pass] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetAftercurrent.page" :limit.sync="paramsGetAftercurrent.limit" @pagination="getAftercurrentList" />
    <el-drawer
      title="详情"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="60%"
    >
      <div class="history">
        <itable v-if="dialogVisible" :tableinfo="aftercurrentInfo" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Formattimestamp2 } from '@/utils/time'
import itable from './components/itable'
import { getAftercurrentList, getAftercurrentInfo } from '@/api/history3_5s'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination, itable },
  directives: { waves },
  data() {
    return {
      tempFilterOptions: {
        address: undefined,
        note: undefined
      },
      // 红外检测列表
      aftercurrentList: [],
      aftercurrentDataList: [],
      // 设备类型列表
      deviceTypeList: [],
      dialogVisible: false,
      passMap: ['异常', '正常'],
      isButtonAddLoadingShow: false,
      isAftercurrentListLoading: false,
      dialogImgVisible: false,
      total: 0,
      total1: 0,
      paramsGetAftercurrent: {
        project_id: undefined,
        page: 1,
        limit: 20,
        is_pass: undefined
      },
      passOptions: [
        { id: 0, name: '异常' },
        { id: 1, name: '正常' }
      ],
      aftercurrentInfo: {
      }
    }
  },
  computed: {
    ...mapGetters([
      'project_id'
    ])
  },
  created() {
    this.getAftercurrentList()
  },
  methods: {
    getTime(time) {
      return Formattimestamp2(time)
    },
    openDialogAftercurrent({ history_id }) {
      getAftercurrentInfo({ history_id }).then(res => {
        this.dialogVisible = true
        this.aftercurrentInfo = res.data
      })
    },
    passChange(id) {
      this.paramsGetAftercurrent.is_pass = (!id && id !== 0) ? undefined : id
      this.getAftercurrentList()
    },
    // 获取剩余电流列表
    getAftercurrentList() {
      this.isAftercurrentListLoading = true
      this.paramsGetAftercurrent.project_id = this.project_id
      getAftercurrentList(this.paramsGetAftercurrent).then(response => {
        this.isAftercurrentListLoading = false
        this.total = response.data.total
        this.aftercurrentList = response.data.items
      }).catch(err => {
        console.log(err)
        this.isAftercurrentListLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .history {
    flex: 1;
    overflow: auto;
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
  .item-image{
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 220px;
    height: 220px;
  }
</style>
