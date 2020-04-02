<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <el-input v-model="tempfilterOptions.company_name" clearable placeholder="公司名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch" />
        <el-input v-model="tempfilterOptions.department_name" clearable placeholder="部门名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch" />
        <!--筛选按钮-->
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <!--新建按钮-->
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogDepartmentAdd">新建部门</el-button>
        <!--删除按钮-->
        <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDeleteDepartments">删除部门</el-button>
      </div>
      <el-table
        v-loading="isDepartmentListLoadingShow"
        :data="departmentList"
        element-loading-text="加载中"
        style="width:100%;"
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
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{ scope.$index+(resquestGetDepartment.page - 1) * resquestGetDepartment.limit + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openDialogDepartmentEdit(scope.row)"><i>{{ scope.row.department_name }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="所属公司" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ getTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="resquestGetDepartment.page" :limit.sync="resquestGetDepartment.limit" @pagination="getDepartmentList" />
    </div>

    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddVisible" :append-to-body="true" :close-on-click-modal="false" title="新建部门">
      <el-form ref="formAddDepartment" :model="requestAddDepartment" :rules="DepartmentInfoRules" label-width="120px">
        <!--部门名称-->
        <el-form-item label="部门名称" class="dialog-form-item" prop="department_name">
          <el-input v-model="requestAddDepartment.department_name" type="text" />
        </el-form-item>
        <!--所属公司-->
        <el-form-item label="所属公司" class="dialog-form-item" prop="company_id">
          <el-select v-model="requestAddDepartment.company_id" placeholder="请选择所属公司">
            <el-option v-for="item in companyOptions" :key="item.company_id" :label="item.name" :value="item.company_id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogDepartmentAdd">取消</el-button>
        <el-button v-waves :loading="isButtonAddLoadingShow" type="primary" @click.native="onAddDepartment">确定</el-button>
      </div>
    </el-dialog>

    <!--弹出编辑窗口-->
    <el-dialog :visible.sync="dialogEditVisible" :append-to-body="true" :close-on-click-modal="false" title="编辑">
      <el-form ref="formEditDepartment" :model="requestEditDepartment" :rules="DepartmentInfoRules" label-width="120px">
        <!--公司名称-->
        <el-form-item label="部门名称" class="dialog-form-item" prop="department_name">
          <el-input v-model="requestEditDepartment.department_name" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogDepartmentEdit">取消</el-button>
        <el-button v-waves :loading="isButtonEditLoadingShow" type="primary" @click.native="onEditDepartment">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Formattimestamp } from '@/utils/time'
import { getCompanyByUser } from '@/api/company'
import { getDepartments, createDepartment, deleteDepartments, editDepartment } from '@/api/departments'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

export default {
  name: 'Department',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isDepartmentListLoadingShow: false,
      companyOptions: [],
      multipleSelection: [],
      departmentList: [],
      total: 0,

      tempfilterOptions: {
        company_name: undefined,
        department_name: undefined
      },
      resquestGetDepartment: {
        company_name: undefined,
        department_name: undefined,
        page: 1,
        limit: 20
      },

      DepartmentInfoRules: {
        company_id: [{ required: true, trigger: 'change', message: '请选择所属公司' }],
        department_name: [{ required: true, trigger: 'change', message: '请输入部门名称' }]
      },

      dialogAddVisible: false,
      isButtonAddLoadingShow: false,
      requestAddDepartment: {
        department_name: undefined,
        company_id: undefined
      },

      dialogEditVisible: false,
      isButtonEditLoadingShow: false,

      requestEditDepartment: {
        department_id: undefined,
        department_name: undefined,
        company_id: undefined
      }
    }
  },
  created() {
    this.getDepartmentList()
    this.getCompanyByUser()
  },
  methods: {
    /**
     * @Description: 获取部门列表
     * @Date: 2019/5/6
     **/
    getDepartmentList(val) {
      this.isDepartmentListLoadingShow = true
      if (val) this.resquestGetDepartment.limit = val.limit
      getDepartments(this.resquestGetDepartment).then(response => {
        this.total = response.data.total
        this.departmentList = response.data.items
        this.isDepartmentListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isDepartmentListLoadingShow = false
      })
    },
    /**
     * @Description: 根据用户获取公司列表
     * @Date: 2019/5/6
     **/
    getCompanyByUser() {
      getCompanyByUser().then(response => {
        this.companyOptions = response.data.items
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/6
     **/
    onSearch() {
      this.resquestGetDepartment.company_name = this.tempfilterOptions.company_name
      this.resquestGetDepartment.department_name = this.tempfilterOptions.department_name
      this.getDepartmentList()
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/5/6
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除指定部门
     * @Date: 2019/5/6
     **/
    onDeleteDepartments() {
      this.$confirm('确认删除选中部门吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          department_id_list: this.multipleSelection.map(item => item.department_id)
        }
        deleteDepartments(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '部门删除成功！'
          })
          this.getDepartmentList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    /**
     * @Description: 打开部门添加对话框
     * @Date: 2019/5/6
     **/
    openDialogDepartmentAdd() {
      if (this.$refs.formAddDepartment !== undefined) this.$refs.formAddDepartment.resetFields()
      this.requestAddDepartment.department_name = undefined
      this.requestAddDepartment.company_id = undefined
      this.getCompanyByUser()
      this.dialogAddVisible = true
    },
    /**
     * @Description: 关闭部门添加对话框
     * @Date: 2019/5/6
     **/
    closeDialogDepartmentAdd() {
      this.dialogAddVisible = false
    },
    /**
     * @Description: 部门添加事件
     * @Date: 2019/5/6
     **/
    onAddDepartment() {
      this.$refs.formAddDepartment.validate(valid => {
        if (valid) {
          this.isButtonAddLoadingShow = true
          createDepartment(this.requestAddDepartment).then(() => {
            this.$message({
              type: 'success',
              message: '部门添加成功！'
            })
            this.isButtonAddLoadingShow = false
            this.dialogAddVisible = false
            this.getDepartmentList()
          }).catch(err => {
            this.isButtonAddLoadingShow = false
            console.log(err)
          })
        }
      })
    },
    /**
     * @Description: 打开部门编辑对话框
     * @Date: 2019/5/6
     **/
    openDialogDepartmentEdit(info) {
      this.requestEditDepartment.company_id = info.company_id
      this.requestEditDepartment.department_name = info.department_name
      this.requestEditDepartment.department_id = info.department_id
      this.dialogEditVisible = true
    },
    /**
     * @Description: 关闭部门编辑对话框
     * @Date: 2019/5/6
     **/
    closeDialogDepartmentEdit() {
      this.dialogEditVisible = false
    },
    /**
     * @Description: 部门编辑事件
     * @Date: 2019/5/6
     **/
    onEditDepartment() {
      this.$refs.formEditDepartment.validate(valid => {
        if (valid) {
          this.isButtonEditLoadingShow = true
          editDepartment(this.requestEditDepartment).then(() => {
            this.$message({
              type: 'success',
              message: '部门编辑成功！'
            })
            this.isButtonEditLoadingShow = false
            this.getDepartmentList()
            this.dialogEditVisible = false
          }).catch(err => {
            this.isButtonEditLoadingShow = false
            console.log(err)
          })
        }
      })
    },
    /**
     * @Description: 事件格式转换
     * @Date: 2019/5/6
     **/
    getTime(time) {
      return Formattimestamp(time)
    }
  }
}
</script>

