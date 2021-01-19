<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tempFilterOptions.building" placeholder="建筑名称" style="width: 300px;" class="filter-item" @keyup.enter.native="onSearch" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="openDialogBuildingAdd">新建建筑</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onBuildingsDelete">删除建筑</el-button>
    </div>

    <el-table
      v-loading="isBuildingInfoListLoadingShow"
      :data="buildingInfoList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      highlight-current-row
      fit
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column type="expand" label="展开详情" width="100">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="建筑地址：">
              <span>{{ scope.row.building_address }}</span>
            </el-form-item>
            <el-form-item label="建筑类型：">
              <span>{{ buildingTypeMap[scope.row.building_type_id*1-1] }}</span>
            </el-form-item>
            <el-form-item label="自动消防设施：">
              <span :style="{color:scope.row.is_contain_afff? '#67C23A': '#F56C6C'}">{{ isOrNotMap[scope.row.is_contain_afff] }}</span>
            </el-form-item>
            <el-form-item label="占地面积(平方米)：">
              <span>{{ scope.row.cover_area || '0' }}</span>
            </el-form-item>
            <el-form-item label="建筑面积(平方米)：">
              <span>{{ scope.row.building_area || '0' }}</span>
            </el-form-item>
            <el-form-item label="建筑高度(米)：">
              <span>{{ scope.row.building_height || '0' }}</span>
            </el-form-item>
            <el-form-item label="楼层数：">
              <span>{{ scope.row.building_floor || '0' }}</span>
            </el-form-item>
            <el-form-item label="地上几层：">
              <span>{{ scope.row.building_floor1 || '0' }}</span>
            </el-form-item>
            <el-form-item label="地下几层：">
              <span>{{ scope.row.building_floor2 || '0' }}</span>
            </el-form-item>
            <el-form-item label="安全出口数量：">
              <span>{{ scope.row.safety_exit_count || '0' }}</span>
            </el-form-item>
            <el-form-item label="疏散楼梯个数：">
              <span>{{ scope.row.evacuation_staircase_count || '0' }}</span>
            </el-form-item>
            <el-form-item label="消防电梯个数：">
              <span>{{ scope.row.fire_lift_count || '0' }}</span>
            </el-form-item>
            <el-form-item label="避难层位置：">
              <span>{{ scope.row.refuge_layer || '-' }}</span>
            </el-form-item>
            <el-form-item label="耐火等级：">
              <span>{{ scope.row.fire_rating || '-' }}</span>
            </el-form-item>
            <el-form-item label="使用功能：">
              <span>{{ scope.row.use_function || '-' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
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
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="requestParam_getBuildingInfoList.page" :limit.sync="requestParam_getBuildingInfoList.limit" @pagination="getBuildingInfoList" />

    <el-dialog :visible.sync="isDialogAddBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="新建建筑">
      <div class="building">
        <el-form ref="formAddBuilding" :model="requestParam_addBuilding" :rules="BuidlingInfoRules" label-width="100px">
          <el-form-item label="建筑名称：" class="dialog-form-item" prop="building" :size="size">
            <el-input v-model="requestParam_addBuilding.building" type="text" />
          </el-form-item>
          <el-form-item label="建筑地址：" prop="building_address" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_address" type="text" />
          </el-form-item>
          <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type_id" :size="size">
            <el-select v-model="requestParam_addBuilding.building_type_id" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item">
              <el-option v-for="item in buildingOptions" :key="item.building_type_id" :label="item.building_name" :value="item.building_type_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动消防设施：" label-position="left" class="dialog-form-item" prop="is_contain_afff" :size="size">
            <el-radio-group v-model="requestParam_addBuilding.is_contain_afff">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="建筑面积：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="建筑高度(米)：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_height" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
          </el-form-item>
          <el-form-item label="占地面积：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.cover_area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="楼层数：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_floor" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="地上几层：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_floor1" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="地下几层：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.building_floor2" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="安全出口数量：" class="dialog-form-item">
            <el-input-number v-model="requestParam_addBuilding.safety_exit_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="疏散楼梯个数：" class="dialog-form-item">
            <el-input-number v-model="requestParam_addBuilding.evacuation_staircase_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="消防电梯个数：" class="dialog-form-item">
            <el-input-number v-model="requestParam_addBuilding.fire_lift_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="避难层位置：" class="dialog-form-item">
            <el-input-number v-model="requestParam_addBuilding.refuge_layer" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="耐火等级：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.fire_rating" class="dialog-form-item" type="text" />
          </el-form-item>
          <el-form-item label="使用功能 ：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_addBuilding.use_function" class="dialog-form-item" type="text" />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingAdd">取消</el-button>
        <el-button v-waves :loading="isDialogAddBuildingLoadingShow" type="primary" @click.native="onBuildingAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isDialogEditBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="编辑建筑">
      <div class="building">
        <el-form ref="formEditBuilding" :model="requestParam_editBuilding" :rules="BuidlingInfoRules" label-width="100px">
          <el-form-item label="建筑名称：" class="dialog-form-item" prop="building" :size="size">
            <el-input v-model="requestParam_editBuilding.building" type="text" />
          </el-form-item>
          <el-form-item label="建筑地址：" prop="building_address" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_address" type="text" />
          </el-form-item>
          <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type_id" :size="size">
            <el-select v-model="requestParam_editBuilding.building_type_id" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item">
              <el-option v-for="item in buildingOptions" :key="item.building_type_id" :label="item.building_name" :value="item.building_type_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动消防设施：" label-position="left" class="dialog-form-item" prop="is_contain_afff" :size="size">
            <el-radio-group v-model="requestParam_editBuilding.is_contain_afff">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="建筑面积：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="建筑高度(米)：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_height" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
          </el-form-item>
          <el-form-item label="占地面积：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.cover_area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="楼层数：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_floor" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="地上几层：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_floor1" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="地下几层：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.building_floor2" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
          <el-form-item label="安全出口数量：" class="dialog-form-item">
            <el-input-number v-model="requestParam_editBuilding.safety_exit_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="疏散楼梯个数：" class="dialog-form-item">
            <el-input-number v-model="requestParam_editBuilding.evacuation_staircase_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="消防电梯个数：" class="dialog-form-item">
            <el-input-number v-model="requestParam_editBuilding.fire_lift_count" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="避难层位置：" class="dialog-form-item">
            <el-input-number v-model="requestParam_addBuilding.refuge_layer" :min="0" :size="size" />
          </el-form-item>
          <el-form-item label="耐火等级：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.fire_rating" type="text" />
          </el-form-item>
          <el-form-item label="使用功能 ：" class="dialog-form-item" :size="size">
            <el-input v-model="requestParam_editBuilding.use_function" class="dialog-form-item" type="text" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingEdit">取消</el-button>
        <el-button v-waves :loading="isDialogEditBuildingLoadingShow" type="primary" @click.native="onBuildingEdit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getBuildingInfoList, deleteBuildings, addBuilding, updateBuilding } from '@/api/building4'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
const initParams = {
  building: '',
  building_address:	'',
  building_type_id:	'',
  cover_area:	'',
  building_area:	'',
  building_height:	'',
  building_floor:	'',
  building_floor1:	'',
  building_floor2:	'',
  safety_exit_count: 0,
  evacuation_staircase_count:	0,
  fire_lift_count:	0,
  refuge_layer:	0,
  fire_rating:	'',
  use_function:	'',
  is_contain_afff:	1
}
export default {
  name: 'Building',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      size: 'small',
      multipleSelection: [],
      buildingInfoList: [],
      isBuildingInfoListLoadingShow: false,
      isDialogAddBuildingShow: false,
      isDialogAddBuildingLoadingShow: false,
      isDialogEditBuildingShow: false,
      isDialogEditBuildingLoadingShow: false,
      total: 0,
      isOrNotMap: ['无', '有'],
      buildingTypeMap: ['甲乙类产房', '其他厂房', '仓库', '民用建筑'],
      buildingOptions: [
        { building_type_id: 1, building_name: '甲乙类厂房' },
        { building_type_id: 2, building_name: '其他厂房' },
        { building_type_id: 3, building_name: '仓库' },
        { building_type_id: 4, building_name: '民用建筑' }
      ],
      tempFilterOptions: {
        building: undefined
      },
      requestParam_getBuildingInfoList: {
        building: undefined,
        page: 1,
        limit: 20
      },
      requestParam_addBuilding: initParams,
      requestParam_editBuilding: {
        building_id: undefined,
        building: undefined,
        building_address:	undefined,
        building_type_id:	undefined,
        cover_area:	undefined,
        building_area:	undefined,
        building_height:	undefined,
        building_floor:	undefined,
        building_floor1:	undefined,
        building_floor2:	undefined,
        safety_exit_count: undefined,
        evacuation_staircase_count:	undefined,
        fire_lift_count:	undefined,
        refuge_layer:	undefined,
        fire_rating:	undefined,
        use_function:	undefined,
        is_contain_afff:	undefined
      },

      BuidlingInfoRules: {
        building: [{ required: true, trigger: 'change', message: '请输入建筑物名称' }],
        building_address: [{ required: true, trigger: 'change', message: '请输入建筑地址' }],
        building_type_id: [{ required: true, trigger: 'change', message: '请选择建筑类型' }],
        is_contain_afff: [{ required: true, trigger: 'change', message: '请选择有无自动消防设施' }]
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
    parseInfnList(buildingList) {
      const infoList = buildingList.map(item => {
        const { building_id, building, label } = item
        const info = JSON.parse(label)
        const tabInfo = {
          building_id,
          building
        }
        return Object.assign(tabInfo, info)
      })
      return infoList
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
        this.buildingInfoList = this.parseInfnList(res.data.items)
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
    init() {
      this.requestParam_addBuilding = initParams
    },
    /**
     * @Description: 打开建筑添加对话框
     * @Date: 2019/6/28
     **/
    openDialogBuildingAdd() {
      this.init()
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
          const label = JSON.stringify({
            building_address:	this.requestParam_addBuilding.building_address,
            building_type_id: this.requestParam_addBuilding.building_type_id,
            cover_area:	this.requestParam_addBuilding.cover_area,
            building_area:	this.requestParam_addBuilding.building_area,
            building_height:	this.requestParam_addBuilding.building_height,
            building_floor:	this.requestParam_addBuilding.building_floor,
            building_floor1:	this.requestParam_addBuilding.building_floor1,
            building_floor2:	this.requestParam_addBuilding.building_floor2,
            safety_exit_count: this.requestParam_addBuilding.safety_exit_count,
            evacuation_staircase_count: this.requestParam_addBuilding.evacuation_staircase_count,
            fire_lift_count:	this.requestParam_addBuilding.fire_lift_count,
            refuge_layer:	this.requestParam_addBuilding.refuge_layer,
            fire_rating:	this.requestParam_addBuilding.fire_rating,
            use_function:	this.requestParam_addBuilding.use_function,
            is_contain_afff: this.requestParam_addBuilding.is_contain_afff
          })
          const Params = {
            project_id: this.project_id,
            building: this.requestParam_addBuilding.building,
            label
          }
          addBuilding(Params).then(() => {
            this.isDialogAddBuildingLoadingShow = false
            this.getBuildingInfoList()
            this.init()
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
      this.requestParam_editBuilding = info

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
          const label = JSON.stringify({
            building_address:	this.requestParam_editBuilding.building_address,
            building_type_id: this.requestParam_editBuilding.building_type_id,
            cover_area:	this.requestParam_editBuilding.cover_area,
            building_area:	this.requestParam_editBuilding.building_area,
            building_height:	this.requestParam_editBuilding.building_height,
            building_floor:	this.requestParam_editBuilding.building_floor,
            building_floor1:	this.requestParam_editBuilding.building_floor1,
            building_floor2:	this.requestParam_editBuilding.building_floor2,
            safety_exit_count: this.requestParam_editBuilding.safety_exit_count,
            evacuation_staircase_count: this.requestParam_editBuilding.evacuation_staircase_count,
            fire_lift_count:	this.requestParam_editBuilding.fire_lift_count,
            refuge_layer:	this.requestParam_editBuilding.refuge_layer,
            fire_rating:	this.requestParam_editBuilding.fire_rating,
            use_function:	this.requestParam_editBuilding.use_function,
            is_contain_afff: this.requestParam_addBuilding.is_contain_afff
          })
          const Params = {
            building_id: this.requestParam_editBuilding.building_id,
            building: this.requestParam_editBuilding.building,
            label
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

<style scoped lang="scss">
  .app-container {
    .demo-table-expand {
      width: 100%;
      color: #99a9bf;
      /deep/.el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
      }
      /deep/.demo-table-expand {
        width: 200px;
      }
    }
  }
    .building {
      /deep/.el-form-item__label {
        width: 128px !important;
        text-align: right;
        padding: 0;
      }
      /deep/.el-form-item__content{
        margin-left: 128px !important;
      }
    }
</style>
