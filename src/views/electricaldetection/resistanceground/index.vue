<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tempFilterOptions.address" placeholder="测试地点" style="width:200px;" class="filter-item" @keyup.enter.native="onSearch" />
      <el-input v-model="tempFilterOptions.note" placeholder="额外备注" style="width:200px;" class="filter-item" @keyup.enter.native="onSearch" />
      <!-- 是否合格筛选 -->
      <el-select v-model="paramsGetResistance.is_pass" placeholder="是否合格" filterable clearable style="width: 106px" class="filter-item" @change="passChange">
        <el-option v-for="item in passOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isResistanceListLoading"
      :data="resistanceList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          <span @click="openDialogResistance(scope.row)"><i>{{ scope.row.project_name }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="接地装置型号/规格" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.earthing_device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="额外备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被测设备名称编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.testing_device }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结果（Ω）" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测判定" align="center" width="90">
        <template slot-scope="scope">
          <span :style="{color:scope.row.is_pass? '#67C23A': '#F56C6C'}">{{ passMap[scope.row.is_pass] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetResistance.page" :limit.sync="paramsGetResistance.limit" @pagination="getResistance" />
  </div>
</template>

<script>
import { getHistory3_2s, getHistory3_2sDetail } from '@/api/history3_2s'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tempFilterOptions: {
        address: undefined,
        note: undefined
      },
      // 检查项列表
      resistanceList: [],
      // 设备类型列表
      deviceTypeList: [],
      passMap: ['异常', '正常'],
      isButtonAddLoadingShow: false,
      isResistanceListLoading: false,
      total: 0,
      passOptions: [
        { id: 0, name: '异常' },
        { id: 1, name: '正常' }
      ],
      paramsGetResistance: {
        project_id: undefined,
        page: 1,
        limit: 20,
        is_pass: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'project_id',
      'system_type_options'
    ])
  },
  created() {
    this.getResistance()
  },
  methods: {
    openDialogResistance({ history_id }) {
      getHistory3_2sDetail({ history_id }).then(res => {
        console.log(res)
      })
    },
    passChange(id) {
      this.paramsGetResistance.is_pass = (!id && id !== 0) ? undefined : id
      this.getResistance()
    },
    closeDialog() {
      this.dialogAddVisible = false
      this.dialogEditVisible = false
      this.$message({
        message: '取消删除',
        type: 'info'
      })
    },

    onSearch() {
      this.paramsGetResistance.note = this.tempFilterOptions.note || undefined
      this.paramsGetResistance.address = this.tempFilterOptions.address || undefined
      this.paramsGetResistance.page = 1
      this.getResistance()
    },

    // 获取接地电阻列表
    getResistance() {
      this.isResistanceListLoading = true
      this.paramsGetResistance.project_id = this.project_id
      getHistory3_2s(this.paramsGetResistance).then(response => {
        this.isResistanceListLoading = false
        this.total = response.data.total
        this.resistanceList = response.data.items
      }).catch(err => {
        console.log(err)
        this.isResistanceListLoading = false
      })
    }
  }
}
</script>
