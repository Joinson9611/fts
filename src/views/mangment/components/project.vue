<template>
  <div class="project">
    <div class="project-list">
      <el-card style="margin-bottom: 20px">
        <div slot="header">
          <div class="list-header">
            <span class="left">项目列表</span>
            <span class="right">
              <div class="item"><el-button v-if="validatePer([2],Account_Type)" size="mini" type="primary" plain @click="newProject">新建项目</el-button></div>
              <el-badge v-if="validatePer([2],Account_Type)" :value="selectedProject.length" class="item" :hidden="selectedProject.length === 0">
                <div class="item"><el-button :loading="isDeleteLoading" :disabled="selectedProject.length === 0" size="mini" type="danger" style="margin-left: 10px" plain @click="bantchDeleteProject">批量删除</el-button></div>
              </el-badge>
              <div class="item"> <el-input v-model="tempFilterOptions.name" placeholder="请输入项目名称" size="mini" style="width:200px;padding: 0 20px 0 10px" @keyup.native.enter="onSearch" /></div>
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
          :row-key="rowKey"
          highlight-current-row
          @selection-change="handleSelectChange"
        >
          <el-table-column v-if="validatePer([2],Account_Type)" type="selection" align="center" width="55" :reserve-selection="true" />
          <el-table-column label="序号" align="center" width="55">
            <template slot-scope="scope"><span>{{ (paramsGetProjectList.page-1) * paramsGetProjectList.limit +scope.$index + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="项目名称" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.name }} </span>
            </template>
          </el-table-column>
          <el-table-column label="项目地址" align="center">
            <template slot-scope="scope">
              <span>{{ `${scope.row.address}` }} </span>
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
            v-if="validatePer([2],Account_Type)"
            align="center"
            label="操作"
            width="260"
          >
            <template slot-scope="scope" class="tab-btn">
              <el-button
                class="btn"
                type="primary"
                size="mini"
                @click="enterProject(scope.row)"
              >
                进入项目
              </el-button>
              <el-button
                v-if="validatePer([2],Account_Type)"
                class="btn"
                type="success"
                size="mini"
                @click="editProject(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <pagination v-show="total>0" :page-sizes="[10,20,30]" :auto-scroll="false" :total="total" :page.sync="paramsGetProjectList.page" :limit.sync="paramsGetProjectList.limit" @pagination="getProjectList" />
    </div>
    <!-- 项目添加dialog -->
    <el-dialog
      :visible.sync="isProjectDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="新建项目"
      @closed="closeAdd"
    >
      <div class="newProject">
        <el-form ref="addProject" :model="paramsAddProject" :rules="addProjectRules">
          <el-form-item label="项目名称：" class="dialog-form-item" prop="name" label-width="110px">
            <el-input v-model="paramsAddProject.name" class="dialog-form-item" type="text" />
          </el-form-item>
          <el-form-item label="项目描述：" class="dialog-form-item" prop="label" label-width="110px">
            <el-input v-model="paramsAddProject.label" type="text" />
          </el-form-item>
          <amap v-if="isMapOpen" style="margin-right:20px;" @pos="getAddPos" />
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-right: 20px;margin-top: 0;">
          <el-button @click="isProjectDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="closeAddProject">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 项目编辑dialog -->
    <el-dialog
      :visible.sync="isEditProjectDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="编辑"
      @closed="closeEdit"
    >
      <div class="newProject">
        <el-form ref="editProject" :model="paramsEditProject" :rules="addProjectRules">
          <el-form-item label="项目名称：" class="dialog-form-item" prop="name" label-width="110px">
            <el-input v-model="paramsEditProject.name" class="dialog-form-item" type="text" />
          </el-form-item>
          <el-form-item label="项目描述：" class="dialog-form-item" prop="label" label-width="110px">
            <el-input v-model="paramsEditProject.label" type="text" />
          </el-form-item>
          <amap v-if="mapEditOpen" :position="pos" style="margin-right:20px;" @pos="getEditPos" />
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0; text-align:right">
          <el-button @click="isEditProjectDialog = false">取消</el-button>
          <el-button type="primary" :loading="isEditLoading" @click="closeEditProject">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Formattimestamp2 } from '@/utils/time.js'
import { getProjectList, addProject, editProject, deleteProject, selectProject } from '@/api/project'
import Pagination from '@/components/Pagination'
import amap from '@/components/amap'
import { mapGetters } from 'vuex'

export default {
  name: 'Project',
  components: {
    amap,
    Pagination
  },
  data() {
    return {
      visible: false,
      pos: {
        lng: undefined,
        lat: undefined,
        district: undefined
      },
      mapEditOpen: false,
      // 地图组件是否存在
      isMapOpen: false,
      // 保存勾选中的项目
      selectedProject: [],
      provinceEditOptions: [],
      cityEditOptions: [],
      districtEditOptions: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      // 立项表单规则
      addProjectRules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        label: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
      },
      // 删除加载
      isDeleteLoading: false,
      loading: false,
      isEditLoading: false,
      isEditProjectDialog: false,
      isProjectDialogVisible: false,
      isProjecteLoading: false,
      projectList: [],
      // 项目数
      total: 0,
      tempFilterOptions: {
        name: undefined
      },
      tempEditProject: {
        longitude: undefined,
        latitude: undefined,
        address: undefined
      },
      paramsGetProjectList: {
        page: 1,
        limit: 10,
        name: undefined
      },
      paramsEditProject: {
        project_id: undefined,
        name: undefined,		// 项目名称
        address: undefined,		// 项目地址
        longitude: undefined,		// 经度
        latitude: undefined,	// 纬度
        label: undefined
      },
      paramsAddProject: {
        name: undefined,		// 项目名称
        address: undefined,		// 项目地址
        longitude: undefined,		// 经度
        latitude: undefined,	// 纬度
        label: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type'
    ])
  },
  created() {
    this.getProjectList()
  },
  methods: {
    // 进入项目
    enterProject(info) {
      selectProject({ selected_project_id: info.project_id }).then(() => {
        this.$store.dispatch('user/SelectProject', info).then(() => {
          this.$store.dispatch('RemoveRoutes', info).then(() => {
            this.$router.push({ path: '/project/projectDetail' })
          })
        }).catch(err => {
          console.error(err)
        })
      }).catch(err => {
        console.error(err)
        this.$message({
          type: 'danger',
          message: '项目选取失败'
        })
      })
    },
    closeEdit() {
      this.mapEditOpen = false
      if (this.$refs.editProject !== undefined) {
        this.$refs.editProject.resetFields()
      }
    },
    closeAdd() {
      this.isMapOpen = false
      if (this.$refs.addProject !== undefined) {
        this.$refs.addProject.clearValidate()
      }
    },
    rowKey(row) {
      return row.project_id
    },
    // 批量删除项目
    bantchDeleteProject() {
      this.$confirm('确定要删除选中的项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          const params = {
            project_id_list: this.selectedProject.map(item => item.project_id)
          }
          this.isDeleteLoading = true
          deleteProject(params).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.isDeleteLoading = false
            this.getProjectList()
          }).catch(err => {
            console.error(err)
            this.isDeleteLoading = false
          })
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '删除已取消'
          })
        })
    },
    // 处理选中框
    handleSelectChange(arr) {
      this.selectedProject = arr
    },
    // 判断是否有权限
    validatePer(arrPer, level) {
      return arrPer.includes(level)
    },
    // 打开项目编辑窗口
    editProject(info) {
      this.mapEditOpen = true
      this.paramsEditProject = Object.assign({}, this.paramsEditProject, info)
      this.pos.lng = info.longitude
      this.pos.lat = info.latitude
      this.pos.district = info.address
      this.isEditProjectDialog = true
      // getProvinces().then(res => {
      //   this.provinceEditOptions = res.data
      // }).catch(err => {
      //   console.error(err)
      // })
      // getCities({ province_id: info.province_id }).then(res => {
      //   this.cityEditOptions = res.data
      // }).catch(err => {
      //   console.error(err)
      // })
      // getDistricts({ city_id: info.city_id }).then(res => {
      //   this.districtEditOptions = res.data
      // }).catch(err => {
      //   console.error(err)
      // })
    },
    // 关闭项目编辑窗口
    closeEditProject() {
      this.$refs.editProject.validate(valid => {
        if (valid) {
          this.isEditLoading = true
          const params = {
            name: this.paramsEditProject.name,
            project_id: this.paramsEditProject.project_id,
            district_id: this.paramsEditProject.district_id,
            address: this.tempEditProject.address,
            longitude: this.tempEditProject.longitude + '',	// 经度,
            latitude: this.tempEditProject.latitude + '',
            label: this.paramsEditProject.label
          }
          editProject(params).then(() => {
            this.$message({
              type: 'success',
              message: '项目编辑成功！'
            })
            this.getProjectList()
            this.isEditProjectDialog = false
            this.isEditLoading = false
          }).catch(err => {
            this.isEditProjectDialog = false
            this.isEditLoading = false
            console.error(err)
          })
        }
      })
    },
    // 搜索
    onSearch() {
      this.paramsGetProjectList.name = this.tempFilterOptions.name
      this.paramsGetProjectList.page = 1
      this.getProjectList()
    },
    // 获取从amap得到的位置信息
    getAddPos(pos) {
      this.paramsAddProject.longitude = pos.slon
      this.paramsAddProject.latitude = pos.slat
      this.paramsAddProject.address = pos.sname
    },
    getEditPos(pos) {
      this.tempEditProject.longitude = pos.slon
      this.tempEditProject.latitude = pos.slat
      this.tempEditProject.address = pos.sname
    },
    init() {
      this.paramsAddProject.name = undefined
      this.paramsAddProject.address = undefined
      this.paramsAddProject.longitude = undefined
      this.paramsAddProject.label = undefined
      this.cityOptions = []
      this.districtOptions = []
    },
    newProject() {
      this.isProjectDialogVisible = true
      this.isMapOpen = true
    },
    closeAddProject() {
      this.$refs.addProject.validate(valid => {
        if (valid) {
          this.$confirm('确定要新建项目嘛？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(_ => {
              const params = {
                name: this.paramsAddProject.name,			// 项目名称
                district_id: this.paramsAddProject.district_id,		// 省市区
                address: this.paramsAddProject.address,		// 项目地址
                longitude: this.paramsAddProject.longitude + '',		// 经度
                latitude: this.paramsAddProject.latitude + '',	// 纬度
                label: this.paramsAddProject.label		// 项目描述
              }
              this.loading = true
              addProject(params).then(() => {
                // 初始化表单
                this.init()
                this.isMapOpen = false
                this.loading = false
                this.getProjectList()
              }).catch(err => {
                this.isMapOpen = false
                console.error(err)
                this.loading = false
              })
            })
            .catch(_ => {})
        }
      })
    },
    getTime(timeStamp) {
      return Formattimestamp2(timeStamp, 'yyyy-MM-dd')
    },
    getProjectList() {
      this.isProjecteLoading = true
      getProjectList(this.paramsGetProjectList).then(res => {
        this.isProjectDialogVisible = false
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
    /deep/.pagination-container {
      padding-top: 0
    }
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
  .place {
    /deep/.el-input__inner {
      width: 130px;
    }
  }
  /deep/.el-drawer__body{
    padding: 0 14px 14px 14px;
  }
</style>
