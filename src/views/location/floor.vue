<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="requestParam_getFloorInfoList.building_id" filterable placeholder="所属建筑" style="width: 220px" class="filter-item" @change="floorChange">
        <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id" />
      </el-select>
      <el-button v-if="false" v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogFloorAdd">新建楼层</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onFloorsDelete">删除楼层</el-button>
    </div>

    <el-table
      v-loading="isFloorInfoListLoadingShow"
      :data="floorInfoList"
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
          {{ scope.$index + 1 + (requestParam_getFloorInfoList.page - 1) * requestParam_getFloorInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼层名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogFloorEdit(scope.row)"><i>{{ scope.row.floor }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼层描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属建筑">
        <template slot-scope="scope">
          <span>{{ scope.row.building }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="requestParam_getFloorInfoList.page" :limit.sync="requestParam_getFloorInfoList.limit" @pagination="getFloorInfoList" />

    <el-dialog :visible.sync="isDialogAddFloorShow" :append-to-body="true" :close-on-click-modal="false" title="新建楼层">
      <el-form ref="formAddFloor" :model="requestParam_addFloor" :rules="FloorInfoRules" label-width="100px">
        <el-form-item label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input v-model="requestParam_addFloor.floor" type="text" />
        </el-form-item>
        <el-form-item label="所属建筑" class="dialog-form-item" prop="building_id">
          <el-select v-model="requestParam_addFloor.building_id" placeholder="请选择所属建筑">
            <el-option v-for="item in dialogBuildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="requestParam_addFloor.label" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogFloorAdd">取消</el-button>
        <el-button v-waves :loading="isDialogAddFloorLoadingShow" type="primary" @click.native="onFloorAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isDialogEditFloorShow" :append-to-body="true" :close-on-click-modal="false" title="编辑楼层">
      <el-form ref="formEditFloor" :model="requestParam_eidtFloor" :rules="FloorInfoRules" label-width="100px">
        <el-form-item label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input v-model="requestParam_eidtFloor.floor" type="text" />
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="requestParam_eidtFloor.label" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogFloorEdit">取消</el-button>
        <el-button v-waves :loading="isDialogEditFloorLoadingShow" type="primary" @click.native="onFloorEdit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingList } from '@/api/building'
import { getFloorInfoList, addFloor, deleteFloor, updateFloor } from '@/api/floor'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Floor',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      buildingOptions: [
        { building_id: -1, building: '全部建筑' }
      ],
      dialogBuildingOptions: [],
      multipleSelection: [],
      floorInfoList: [],

      isFloorInfoListLoadingShow: false,
      isDialogAddFloorShow: false,
      isDialogAddFloorLoadingShow: false,
      isDialogEditFloorShow: false,
      isDialogEditFloorLoadingShow: false,

      total: 0,

      requestParam_getFloorInfoList: {
        building_id: -1,
        page: 1,
        limit: 20
      },
      requestParam_addFloor: {
        building_id: undefined,
        floor: undefined,
        label: undefined
      },
      requestParam_eidtFloor: {
        floor_id: undefined,
        floor: undefined,
        label: undefined
      },

      FloorInfoRules: {
        floor: [{ required: true, trigger: 'change', message: '请输入楼层名称' }],
        building_id: [{ required: true, trigger: 'change', message: '请选择所属建筑' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'project_id'
    ])
  },
  created() {
    this.getBuildingList()
    this.getFloorInfoList()
  },
  methods: {
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/6/28
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 获取楼层信息列表
     * @Date: 2019/6/28
     **/
    getFloorInfoList() {
      const Params = {
        project_id: this.project_id,
        building_id: this.requestParam_getFloorInfoList.building_id,
        page: this.requestParam_getFloorInfoList.page,
        limit: this.requestParam_getFloorInfoList.limit
      }
      this.isFloorInfoListLoadingShow = true
      getFloorInfoList(Params).then(res => {
        this.isFloorInfoListLoadingShow = false
        this.total = res.data.total
        this.floorInfoList = res.data.items
      }).catch(err => {
        this.isFloorInfoListLoadingShow = false
        console.error(err)
      })
    },
    /**
     * @Description: 获取建筑物下拉菜单
     * @Date: 2019/6/28
     **/
    getBuildingList() {
      const project_id = this.project_id
      getBuildingList({ project_id }).then(res => {
        const options = res.data.items
        this.buildingOptions = [{ building_id: -1, building: '全部建筑' }]
        this.buildingOptions = this.buildingOptions.concat(options.slice(0))
        this.dialogBuildingOptions = options.slice(0)
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * @Description: 检索
     * @Date: 2019/6/28
     **/
    onSearch() {
      this.getFloorInfoList()
    },
    /**
     * @Description: 确认删除指定ID的楼层
     * @Date: 2019/6/28
     **/
    onFloorsDelete() {
      this.$confirm('确认删除已选中的楼层？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          floor_id_list: this.multipleSelection.map(item => item.floor_id)
        }
        deleteFloor(Params).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getFloorInfoList()
        }).catch(err => {
          console.error(err)
        })
      })
    },
    /**
     * @Description: 打开楼层添加对话框
     * @Date: 2019/6/28
     **/
    openDialogFloorAdd() {
      this.requestParam_addFloor.floor = undefined
      this.requestParam_addFloor.building_id = undefined
      this.requestParam_addFloor.label = undefined
      if (this.$refs.formAddFloor !== undefined) {
        this.$refs.formAddFloor.resetFields()
      }
      this.isDialogAddFloorShow = true
    },
    /**
     * @Description: 关闭楼层添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogFloorAdd() {
      this.isDialogAddFloorShow = false
    },
    /**
     * @Description: 确认楼层添加
     * @Date: 2019/6/28
     **/
    onFloorAdd() {
      this.$refs.formAddFloor.validate(valid => {
        if (valid) {
          this.isDialogAddFloorLoadingShow = true
          const Params = {
            floor: this.requestParam_addFloor.floor,
            building_id: this.requestParam_addFloor.building_id,
            label: this.requestParam_addFloor.label
          }
          addFloor(Params).then(() => {
            this.isDialogAddFloorLoadingShow = false
            this.getFloorInfoList()
            this.$message({
              message: '新建成功',
              type: 'success'
            })
            this.isDialogAddFloorShow = false
          }).catch(err => {
            this.isDialogAddFloorLoadingShow = false
            console.error(err)
          })
        }
      })
    },
    /**
     * @Description: 打开楼层信息编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogFloorEdit(info) {
      this.requestParam_eidtFloor.floor = info.floor
      this.requestParam_eidtFloor.floor_id = info.floor_id
      this.requestParam_eidtFloor.label = info.label
      this.isDialogEditFloorShow = true
    },
    /**
     * @Description: 关闭楼层信息编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogFloorEdit() {
      this.isDialogEditFloorShow = false
    },
    /**
     * @Description: 确认编辑楼层信息
     * @Date: 2019/6/28
     **/
    onFloorEdit() {
      this.$refs.formEditFloor.validate(valid => {
        if (valid) {
          this.isDialogEditFloorLoadingShow = true
          const Params = {
            floor_id: this.requestParam_eidtFloor.floor_id,
            floor: this.requestParam_eidtFloor.floor,
            label: this.requestParam_eidtFloor.label
          }
          updateFloor(Params).then(() => {
            this.isDialogEditFloorLoadingShow = false
            this.getFloorInfoList()
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.isDialogEditFloorShow = false
          }).catch(err => {
            this.isDialogEditFloorLoadingShow = false
            console.erroor(err)
          })
        }
      })
    },
    /**
     * @Description: 建筑改变
     * @Date: 2019/7/10
     **/
    floorChange() {
      this.requestParam_getFloorInfoList.page = 1
      this.getFloorInfoList()
    }
  }
}
</script>

<style scoped>

</style>
