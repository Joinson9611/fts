<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tempFilterOptions.building" placeholder="建筑名称" style="width: 300px;" class="filter-item" @keyup.enter.native="onSearch" />
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="openDialogBuildingAdd">新建建筑</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onBuildingsDelete">删除建筑</el-button>
    </div>

    <el-table
      v-loading="isBuildingInfoListLoadingShow"
      :data="buildingInfoList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (requestParam_getBuildingInfoList.page - 1) * requestParam_getBuildingInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="建筑名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogBuildingEdit(scope.row)"><i>{{ scope.row.building }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="requestParam_getBuildingInfoList.page" :limit.sync="requestParam_getBuildingInfoList.limit" @pagination="getBuildingInfoList" />

    <el-dialog :visible.sync="isDialogAddBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="新建建筑">
      <el-form ref="formAddBuilding" :model="requestParam_addBuilding" :rules="BuidlingInfoRules" label-width="100px">
        <el-form-item label="建筑名称" class="dialog-form-item" prop="building">
          <el-input v-model="requestParam_addBuilding.building" type="text" />
        </el-form-item>
        <el-form-item label="建筑描述" class="dialog-form-item">
          <el-input v-model="requestParam_addBuilding.label" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingAdd">取消</el-button>
        <el-button v-waves :loading="isDialogAddBuildingLoadingShow" type="primary" @click.native="onBuildingAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isDialogEditBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="编辑建筑">
      <el-form ref="formEditBuilding" :model="requestParam_editBuilding" :rules="BuidlingInfoRules" label-width="100px">
        <el-form-item label="建筑名称" class="dialog-form-item" prop="building">
          <el-input v-model="requestParam_editBuilding.building" type="text" />
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="requestParam_editBuilding.label" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingEdit">取消</el-button>
        <el-button v-waves :loading="isDialogEditBuildingLoadingShow" type="primary" @click.native="onBuildingEdit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getBuildingInfoList, deleteBuildings, addBuilding, updateBuilding } from '@/api/building'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Building',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      buildingInfoList: [],
      isBuildingInfoListLoadingShow: false,
      isDialogAddBuildingShow: false,
      isDialogAddBuildingLoadingShow: false,
      isDialogEditBuildingShow: false,
      isDialogEditBuildingLoadingShow: false,

      total: 0,

      tempFilterOptions: {
        building: undefined
      },
      requestParam_getBuildingInfoList: {
        building: undefined,
        page: 1,
        limit: 20
      },
      requestParam_addBuilding: {
        building: undefined,
        label: undefined
      },
      requestParam_editBuilding: {
        building_id: undefined,
        building: undefined,
        label: undefined
      },

      BuidlingInfoRules: {
        building: [{ required: true, trigger: 'change', message: '请输入建筑物名称' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'project_id'
    ])
  },
  created() {
    this.getBuildingInfoList()
  },
  methods: {
    /**
     * @Description: 列表选中回调
     * @Date: 2019/6/27
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 获取建筑物信息列表
     * @Date: 2019/6/27
     **/
    getBuildingInfoList() {
      const Params = {
        project_id: this.project_id,
        page: this.requestParam_getBuildingInfoList.page,
        limit: this.requestParam_getBuildingInfoList.limit,
        building: this.requestParam_getBuildingInfoList.building
      }
      this.isBuildingInfoListLoadingShow = true
      getBuildingInfoList(Params).then(res => {
        this.buildingInfoList = res.data.items
        this.total = res.data.total
        this.isBuildingInfoListLoadingShow = false
      }).catch(err => {
        this.isBuildingInfoListLoadingShow = false
        console.error(err)
      })
    },
    /**
     * @Description: 检索方法
     * @Date: 2019/6/27
     **/
    onSearch() {
      this.requestParam_getBuildingInfoList.building = this.tempFilterOptions.building
      this.requestParam_getBuildingInfoList.page = 1
      this.getBuildingInfoList()
    },
    /**
     * @Description: 删除指定ID的建筑物
     * @Date: 2019/6/27
     **/
    onBuildingsDelete() {
      this.$confirm('确认删除已选中的建筑物？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          building_id_list: this.multipleSelection.map(item => item.building_id)
        }
        deleteBuildings(Params).then(() => {
          this.getBuildingInfoList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.error(err)
        })
      })
    },
    /**
     * @Description: 打开建筑添加对话框
     * @Date: 2019/6/28
     **/
    openDialogBuildingAdd() {
      this.requestParam_addBuilding.building = undefined
      this.requestParam_addBuilding.label = undefined
      if (this.$refs.formAddBuilding !== undefined) {
        this.$refs.formAddBuilding.resetFields()
      }
      this.isDialogAddBuildingShow = true
    },
    /**
     * @Description: 关闭建筑添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogBuildingAdd() {
      this.isDialogAddBuildingShow = false
    },
    /**
     * @Description: 确认添加新建筑
     * @Date: 2019/6/28
     **/
    onBuildingAdd() {
      this.$refs.formAddBuilding.validate(valid => {
        if (valid) {
          this.isDialogAddBuildingLoadingShow = true
          const Params = {
            project_id: this.project_id,
            building: this.requestParam_addBuilding.building,
            label: this.requestParam_addBuilding.label
          }
          addBuilding(Params).then(() => {
            this.isDialogAddBuildingLoadingShow = false
            this.getBuildingInfoList()
            this.$message({
              message: '新建成功',
              type: 'success'
            })
            this.isDialogAddBuildingShow = false
          }).catch(err => {
            this.isDialogAddBuildingLoadingShow = false
            console.error(err)
          })
        }
      })
    },
    /**
     * @Description: 打开建筑编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogBuildingEdit(info) {
      this.requestParam_editBuilding.building_id = info.building_id
      this.requestParam_editBuilding.building = info.building
      this.requestParam_editBuilding.label = info.label
      this.isDialogEditBuildingShow = true
    },
    /**
     * @Description: 关闭建筑编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogBuildingEdit() {
      this.isDialogEditBuildingShow = false
    },
    /**
     * @Description: 确认建筑编辑
     * @Date: 2019/6/28
     **/
    onBuildingEdit() {
      this.$refs.formEditBuilding.validate(valid => {
        if (valid) {
          this.isDialogEditBuildingLoadingShow = true
          const Params = {
            building_id: this.requestParam_editBuilding.building_id,
            building: this.requestParam_editBuilding.building,
            label: this.requestParam_editBuilding.label
          }
          updateBuilding(Params).then(() => {
            this.isDialogEditBuildingLoadingShow = false
            this.getBuildingInfoList()
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.isDialogEditBuildingShow = false
          }).catch(err => {
            this.isDialogEditBuildingLoadingShow = false
            console.error(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
