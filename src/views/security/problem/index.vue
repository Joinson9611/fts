<template>
  <div class="app-container">
    <div class="filter-container">
      <!--分项筛选-->
      <el-select v-model="paramsGetProblems.system_type_id" placeholder="分项" filterable clearable style="width: 244px" class="filter-item" @change="systemOptionsChange">
        <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
      </el-select>
      <!-- 单项筛选 -->
      <el-select v-model="paramsGetProblems.device_type_id" placeholder="单项" filterable clearable style="width: 175px" class="filter-item" @change="deviceOptionsChange">
        <el-option v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id" />
      </el-select>
      <!-- 问题筛选 -->
      <el-input v-model="paramsGetProblems.problem" placeholder="问题详情" style="width: 200px;" class="filter-item" @keyup.enter.native="problemInput" />
    </div>
    <el-table
      v-loading="isProblemListLoadingShow"
      :data="problemList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(paramsGetProblems.page - 1) * paramsGetProblems.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="问题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.problem || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建议" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.suggestion || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分项" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.system_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单项" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="159">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time? getTime(scope.row.create_time) : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="102">
        <template slot-scope="scope">
          <el-button
            class="btn"
            type="success"
            size="mini"
            plain
            @click="openDetail(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetProblems.page" :limit.sync="paramsGetProblems.limit" @pagination="getProblemList" />
    <el-drawer
      title="详情"
      direction="ltr"
      size="50%"
      :visible.sync="detailVisible"
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
              风险可能产生的后果: <span>{{ problemDetail.basis || '-' }}</span>
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
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getProblem } from '@/api/problem4s'
import { mapGetters } from 'vuex'
import { getSystemTypes } from '@/api/system'
import { getDeviceTypes } from '@/api/device'
import { Formattimestamp } from '@/utils/time'

export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data() {
    return {
      riskMap: ['-', '低', '中', '高'],
      isOrNot: ['无', '有'],
      riskColorMap: ['#909399', '#67C23A', '#E6A23C', '#F56C6C'],

      detailVisible: false,
      isProblemListLoadingShow: false,

      problemDetail: {
        image: ''
      },

      problemList: [],
      systemListOptions: [],
      deviceTypeOptions: [],

      total: 0,

      paramsGetProblems: {
        system_type_id: undefined,
        device_type_id: undefined,
        problem: undefined,
        project_id: undefined,
        is_problem: this.$route.meta.is_problem,
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters(['project_id']),
    imageUrl() {
      let imgList = []
      if (this.problemDetail.image === '') {
        imgList = []
      } else {
        imgList = this.problemDetail.image.split(',').map(item => process.env.VUE_APP_FILE_API + item)
      }
      return imgList
    }
  },
  created() {
    this.getSystemTypes()
    this.getProblemList()
  },
  methods: {
    problemInput() {
      this.paramsGetProblems.page = 1
      this.getProblemList()
    },
    onSearch() {
      this.paramsGetProblems.page = 1
      this.getProblemList()
    },
    openDetail(info) {
      this.detailVisible = true
      this.problemDetail = info
    },
    getProblemList() {
      this.isProblemListLoadingShow = true
      this.paramsGetProblems.project_id = this.project_id
      getProblem(this.paramsGetProblems).then(res => {
        this.total = res.data.total
        this.problemList = res.data.items
        this.isProblemListLoadingShow = false
      }).catch(err => {
        this.isProblemListLoadingShow = false
        console.error(err)
      })
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ project_type_id: 4 }).then(res => {
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
      this.paramsGetProblems.device_type_id = undefined
      // 如果系统列表清空执行
      if (id === '') {
        this.paramsGetProblems.system_type_id = undefined
        this.deviceTypeOptions = []
      } else {
        this.getDeviceTypes(id)
      }
      this.paramsGetProblems.page = 1
      this.getProblemList()
    },
    // 设备类型改变
    deviceOptionsChange(id) {
      if (id === '') {
        this.paramsGetProblems.device_type_id = undefined
      }
      this.paramsGetProblems.page = 1
      this.getProblemList()
    },
    getTime(timeStamp) {
      return Formattimestamp(timeStamp)
    }
  }
}
</script>

<style lang="scss" sooped>
  .problemDetail {
    overflow: auto;
    .content {
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
      font-family:'arial';
      padding: 20px;
      ul {
        .item {
          word-break:break-all;
          line-height: 16px;
          font-size: 15px;
          padding: 10px 0 ;
          border-bottom: 1px solid rgba(144,147,153,0.3);
          &:last-of-type {
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
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
</style>
