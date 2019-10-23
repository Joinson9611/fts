<template>
  <div class="project">
    <el-row class="header">
      <el-col :span="12">
        <el-card class="item">
          <div slot="header" class="clearfix">
            <span>操作历史</span>
          </div>
          <!-- <ul class="history">
            <li v-for="item in historyRecord">

            </li>
          </ul> -->
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-right:0">
        <el-card class="item">
          <div slot="header" class="clearfix">
            <span>项目统计</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="project-list">
      <el-card>
        <div slot="header">
          <div class="list-header">
            <span class="left">项目列表</span>
            <span class="right">
              <div class="item"><el-button size="small" type="primary" plain @click="newProject">新建项目</el-button></div>
              <div class="item"> <el-input placeholder="请输入项目名称" size="small" style="width:200px;padding: 0 20px 0 10px" /></div>
            </span>
          </div>
        </div>
        <el-table
          v-loading="isProjecteLoading"
          :data="projectList"
          element-loading-text="加载中"
          style="width:100%;"
          fit
          class="el-table"
          max-height="400px"
          highlight-current-row
        >
          <el-table-column label="序号" align="center" width="55">
            <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="项目名称" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.name }} </span>
            </template>
          </el-table-column>
          <el-table-column label="项目地址" align="center">
            <template slot-scope="scope">
              <span>{{ `${scope.row.province}${scope.row.city}${scope.row.district}${scope.row.address}` }} </span>
            </template>
          </el-table-column>
          <el-table-column label="项目描述" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }} </span>
            </template>
          </el-table-column>
          <el-table-column label="立项时间" align="center" width="150">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ getTime(scope.row.create_time) }} </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="90"
          >
            <template>
              <el-button
                type="primary"
                size="small"
              >
                进入项目
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-drawer
      ref="drawer"
      title="新建项目"
      :before-close="handleDialogClose"
      :visible.sync="isProjectDialogVisible"
      direction="ltr"
      size="50%"
    >
      <div class="newProject">
        <el-form :model="paramsAddProject">
          <el-form-item label="项目名称:" class="dialog-form-item" prop="name">
            <el-input v-model="paramsAddProject.name" type="text" style="width:100px" />
          </el-form-item>
          <el-form-item label="项目地址：" prop="address">
            <el-select v-model="paramsAddProject.province_id" placeholder="省" @change="provinceChange">
              <el-option v-for="item in provinceOptions" :key="item.province_id" :label="item.province_name" :value="item.province_id" />
            </el-select>
            <el-select v-model="paramsAddProject.city_id" placeholder="市" @change="cityChange">
              <el-option v-for="item in cityOptions" :key="item.city_id" :label="item.city_name" :value="item.city_id" />
            </el-select>
            <el-select v-model="paramsAddProject.district_id" placeholder="区" @change="districtChange">
              <el-option v-for="item in districtOptions" :key="item.district_id" :label="item.district_name" :value="item.district_id" />
            </el-select>
            <el-input v-model="paramsAddProject.address" placeholder="详细地址" type="text" style="margin-top: 20px" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="isProjectDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="$refs.drawer.closeDrawer()">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { FormatDateTime } from '@/utils/time.js'
import { getProjectList, addProject } from '@/api/project'
import { getProvinces, getCities, getDistricts } from '@/api/address'

export default {
  data() {
    return {
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],

      loading: false,
      isProjectDialogVisible: false,
      isProjecteLoading: false,
      projectList: [],
      // 项目数
      total: 0,
      paramsGetProjectList: {
        page: 1,
        limit: 20,
        name: undefined
      },
      paramsAddProject: {
        name: undefined,		// 项目名称
        province_id: undefined, // 省
        city_id: undefined, // 省
        district_id: undefined,	// 区
        address: undefined,		// 项目地址
        longitude: undefined,		// 经度
        latitude: undefined,	// 纬度
        label: undefined
      }
    }
  },
  created() {
    this.getProjectList()
    this.getProvinces()
  },
  methods: {
    getProvinces() {
      getProvinces().then(res => {
        this.provinceOptions = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    // 省份选项改变
    provinceChange(province_id) {
      this.paramsAddProject.city_id = undefined
      this.paramsAddProject.district_id = undefined
      this.districtOptions = []
      this.cityOptions = []
      getCities({ province_id }).then(res => {
        this.cityOptions = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    // 市级选项改变
    cityChange(city_id) {
      this.districtOptions = []
      this.paramsAddProject.district_id = undefined
      getDistricts({ city_id }).then(res => {
        this.districtOptions = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    // 区级选项改变
    districtChange(did) {
      console.log(2)
    },
    newProject() {
      this.isProjectDialogVisible = true
    },
    // 关闭新建项目对话框触发
    handleDialogClose() {
      // this.$confirm('确定要新建项目嘛？')
      //   .then(_ => {
      //     this.loading = true
      //     setTimeout(() => {
      //       this.loading = false
      //       done()
      //     }, 2000)
      //   })
      //   .catch(_ => {})
    },
    getTime(timeStamp) {
      return FormatDateTime(timeStamp, 'yyyy-MM-dd')
    },
    getProjectList() {
      this.isProjecteLoading = true
      getProjectList(this.paramsGetProjectList).then(res => {
        this.projectList = res.data.items
        this.total = res.data.total
        this.isProjecteLoading = false
      }).catch(err => {
        console.error(err)
        this.isProjecteLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .project{
    .header{
      margin-bottom: 10px;
      .item{
        height: 300px;
        margin-right: 10px;
      }
    }
    .project-list{
      /deep/.el-card__header {
        padding: 0;
      }
      .list-header{
        .left{
          display: inline-block;
          margin: 20px
        }
        .right{
          height: 56px;
          float: right;
          display: flex;
          align-items: center;
          justify-content: center;
          .item{
            display: inline-block;
          }
        }
      }

    }

  }
  /deep/.el-drawer__body{
    padding: 0 14px 14px 14px;
  }
  .newProject{
    display: flex;
    flex-direction: column;
    height: 100%;
    form{
      flex: 1;
    }
    button {
      flex: 0 0 100px;
    }
    .dialog-footer{
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
