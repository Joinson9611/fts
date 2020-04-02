<template>
  <div class="app-container">

    <div class="filter-container">
      <!--新建任务-->
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openNewTaskDialog">新建任务</el-button>
      <!--删除按钮-->
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteTasks">删除任务</el-button>
    </div>

    <!--任务列表-->
    <el-table
      v-loading="isTaskListLoadingShow"
      :data="TaskList"
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
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(paramsGetTasks.page - 1) * paramsGetTasks.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="任务名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openEditTask(scope.row.task_id)"><i>{{ scope.row.name }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="任务描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.leader | leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评估时段" align="center" width="190">
        <template slot-scope="scope">
          <span>{{ `${getTime(scope.row.testting_time)}~${ getTime(scope.row.testing_completion_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.finished_time? getTime(scope.row.finished_time) : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成" align="center" width="80">
        <template slot-scope="scope">
          <span :style="{color:scope.row.is_finished? '#67C23A':'#F56C6C'}">{{ isFinished[scope.row.is_finished] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="102"
      >
        <template slot-scope="scope" class="tab-btn">
          <el-button
            class="btn"
            type="primary"
            size="mini"
            plain
            @click="checkReport(scope.row)"
          >
            查看报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetTasks.page" :limit.sync="paramsGetTasks.limit" @pagination="getTask" />

    <!-- 新建检测任务的窗口 -->
    <el-drawer
      ref="drawer"
      :title="isEdit?'任务编辑': '新建检测任务'"
      :visible.sync="isNewDialogShow"
      direction="ltr"
      size="100%"
      @closed="closeDialog"
    >
      <div class="task">
        <el-form ref="newTaskRuleForm" :model="paramsNewTasks" :rules="taskTules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="任务名称：" class="dialog-form-item" prop="name" :size="size">
                <el-input v-model="paramsNewTasks.name" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="任务描述：" class="dialog-form-item" prop="label" :size="size">
                <el-input v-model="paramsNewTasks.label" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="任务开始时间：" class="dialog-form-item" prop="testting_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.testting_time"
                  placeholder="请选择任务开始时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="任务结束时间：" class="dialog-form-item" prop="testing_completion_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.testing_completion_time"
                  placeholder="请选择任务结束时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="委托单位：" class="dialog-form-item" prop="constructing_unit" :size="size">
                <el-input v-model="paramsNewTasks.constructing_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="委托单位联系电话：" class="dialog-form-item" prop="constructing_contact_number" :size="size">
                <el-input v-model="paramsNewTasks.constructing_contact_number" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="委托单位地址：" class="dialog-form-item" prop="constructing_address" :size="size">
                <el-input v-model="paramsNewTasks.constructing_address" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="统一社会信用代码：" class="dialog-form-item" prop="constructing_unit_code" :size="size">
                <el-input v-model="paramsNewTasks.constructing_unit_code" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="设计单位：" class="dialog-form-item" prop="designed_unit" :size="size">
                <el-input v-model="paramsNewTasks.designed_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="施工单位：" class="dialog-form-item" prop="construction_unit" :size="size">
                <el-input v-model="paramsNewTasks.construction_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="管理单位：" class="dialog-form-item" prop="management_unit" :size="size">
                <el-input v-model="paramsNewTasks.management_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="建筑地址：" class="dialog-form-item" prop="building_address" :size="size">
                <el-input v-model="paramsNewTasks.building_address" class="dialog-form-item" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="2" style="height:505px">
              <div class="divider">
                <el-divider direction="vertical" />
              </div>
            </el-col>
            <el-col :span="11">
              <el-form-item label="消防验收日期：" class="dialog-form-item" prop="fire_acceptance_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.fire_acceptance_time"
                  placeholder="请选择消防验收日期"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="建筑名称：" class="dialog-form-item" prop="building_name" :size="size">
                <el-input v-model="paramsNewTasks.building_name" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="占地面积：" class="dialog-form-item" prop="area" :size="size">
                <el-input v-model="paramsNewTasks.area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
              </el-form-item>
              <el-form-item label="地上几层：" class="dialog-form-item" prop="building_floor1" :size="size">
                <el-input v-model="paramsNewTasks.building_floor1" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
              </el-form-item>
              <el-form-item label="地下几层：" class="dialog-form-item" prop="building_floor2" :size="size">
                <el-input v-model="paramsNewTasks.building_floor2" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
              </el-form-item>
              <el-form-item label="建筑面积：" class="dialog-form-item" prop="building_area" :size="size">
                <el-input v-model="paramsNewTasks.building_area" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
              </el-form-item>
              <el-form-item label="建筑高度(米)：" class="dialog-form-item" prop="building_hight" :size="size">
                <el-input v-model="paramsNewTasks.building_hight" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
              </el-form-item>
              <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type" :size="size">
                <el-select v-model="paramsNewTasks.building_type" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item">
                  <el-option v-for="item in buildingOptions" :key="item.building_type" :label="item.building_name" :value="item.building_type" />
                </el-select>
              </el-form-item>
              <el-form-item label="耐火等级：" class="dialog-form-item" prop="fire_rating" :size="size">
                <el-input v-model="paramsNewTasks.fire_rating" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="使用功能 ：" class="dialog-form-item" prop="use_function" :size="size">
                <el-input v-model="paramsNewTasks.use_function" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="评估范围 ：" class="dialog-form-item" prop="testing_scope" :size="size">
                <el-input v-model="paramsNewTasks.testing_scope" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="评估建筑面积(平方米) ：" class="dialog-form-item" prop="testing_area" :size="size">
                <el-input v-model="paramsNewTasks.testing_area" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="评估批文：" class="dialog-form-item" prop="testing_appvoval" :size="size">
                <el-input v-model="paramsNewTasks.testing_appvoval" class="dialog-form-item" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目负责人：" class="dialog-form-item" prop="leader" :size="size">
                <el-select v-model="paramsNewTasks.leader" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
                  <el-option
                    v-for="item in userOptions"
                    :key="item.user_id"
                    :label="item.user_name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核人：" class="dialog-form-item" prop="auditor" :size="size">
                <el-select v-model="paramsNewTasks.auditor" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
                  <el-option
                    v-for="item in userOptions"
                    :key="item.user_id"
                    :label="item.user_name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="评估人员：" class="dialog-form-item" prop="testing_users" :size="size">
                <el-select v-model="paramsNewTasks.testing_users" multiple filterable value-key="user_id" placeholder="请选择检测人员" style="width: 100%">
                  <el-option
                    v-for="item in userOptions"
                    :key="item.user_id"
                    :label="item.user_name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="isNewDialogShow = false">取消</el-button>
        <el-button type="primary" :loading="isNewLoading" @click="onNewSubmit">确定</el-button>
      </div>
    </el-drawer>
    <!--弹出查看报告窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="true" :title="'任务名称-'+reportFile.name">
      <el-table
        v-loading="isGenerateReportLoading"
        :data="reportFile.list"
        element-loading-text="Loading"
        style="width: 100%;"
        border
        fit
      >
        <el-table-column label="报告日期" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报告文件名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="downloadReport">{{ scope.row.filename }}</a>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves :loading="isGenerateReportLoading" type="primary" plain @click="generateReport">生成报告</el-button>
        <el-button v-waves :disabled="reportFile.list.length===0 || isGenerateReportLoading" plain type="success" @click="downloadReport">下载报告</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTask, newTask, detailTask, updateTask, deleteTask, generateReport } from '@/api/task4'
import { getUsersByCompany } from '@/api/user'
import { Formattimestamp, Formattimestamp2 } from '@/utils/time'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Detectiontasks',
  components: { Pagination },
  directives: { waves },
  filters: {
    leader(user) {
      if (user !== '') return JSON.parse(user).user_name
    }
  },
  data() {
    return {
      isFinished: ['否', '是'],
      buildingOptions: [
        { building_type: 1, building_name: '甲乙类厂房' },
        { building_type: 2, building_name: '其他厂房' },
        { building_type: 3, building_name: '仓库' },
        { building_type: 4, building_name: '民用建筑' }
      ],

      isGenerateReportLoading: false,
      isButtonDownLoading: false,
      // 新建任务加载显示
      isNewLoading: false,

      // 当前的任务ID
      task_id: undefined,
      dialogVisible: false,
      userOptions: [],
      systemTypeOptions: [],
      size: 'mini',
      // 报告加载显示
      isReportLoading: false,
      isNewDialogShow: false,
      isTasksDeleteShow: false,
      multipleSelection: [],
      TaskList: [],
      total: 0,
      isTaskListLoadingShow: true,
      tempFilterOptions: {
        task_name: undefined,
        task_type2_id: undefined,
        task_state2: undefined
      },

      taskTules: {
        name: [{ required: true, message: '请填写任务名称', trigger: 'blur' }],
        label: [{ required: true, message: '请填写任务描述', trigger: 'blur' }],
        area: [{ required: true, message: '请填写占地面积', trigger: 'blur' }],
        constructing_unit: [{ required: true, message: '请填写委托单位', trigger: 'blur' }],
        constructing_contact_number: [{ required: true, message: '请填写委托单位联系电话', trigger: 'blur' }],
        constructing_unit_code: [{ required: true, message: '请填写统一社会信用代码', trigger: 'blur' }],
        constructing_contacts: [{ required: true, message: '请填写委托单位联系人', trigger: 'blur' }],
        constructing_address: [{ required: true, message: '请填写委托单位地址', trigger: 'blur' }],
        management_unit: [{ required: true, message: '请填写管理单位', trigger: 'blur' }],
        designed_unit: [{ required: true, message: '请填写设计单位', trigger: 'blur' }],
        construction_unit: [{ required: true, message: '请填写施工单位', trigger: 'blur' }],
        building_address: [{ required: true, message: '请填写建筑地址', trigger: 'blur' }],
        building_type: [{ required: true, message: '请选择建筑类型', trigger: 'change' }],
        building_name: [{ required: true, message: '请填写建筑名称', trigger: 'blur' }],
        building_area: [{ required: true, message: '请填写建筑面积', trigger: 'blur' }],
        building_floor1: [{ required: true, message: '请填写地上几层', trigger: 'blur' }],
        building_floor2: [{ required: true, message: '请填写地下几层', trigger: 'blur' }],
        building_hight: [{ required: true, message: '请填写建筑高度', trigger: 'blur' }],
        testting_time: [{ required: true, message: '请选择任务开始时间', trigger: 'change' }],
        testing_completion_time: [{ required: true, message: '请选择任务结束时间', trigger: 'change' }],
        testing_scope: [{ required: true, message: '请选择检测范围', trigger: 'blur' }],
        testing_part: [{ required: true, message: '请填写检测部位', trigger: 'blur' }],
        testing_appvoval: [{ required: true, message: '请填写检测批文', trigger: 'blur' }],
        testing_area: [{ required: true, message: '请填写评估建筑面积(平方米)', trigger: 'blur' }],
        use_function: [{ required: true, message: '请填写使用功能', trigger: 'blur' }],
        fire_rating: [{ required: true, message: '请填写耐火等级', trigger: 'blur' }],
        fire_acceptance_time: [{ required: true, message: '请选择消防验收日期', trigger: 'change' }],
        leader: [{ required: true, message: '请选择项目负责人', trigger: 'blur' }],
        auditor: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
        testing_users: [{ required: true, message: '请选择评估人员', trigger: 'blur' }]
      },
      paramsGetTasks: {
        project_id: undefined,
        page: 1,
        limit: 20
      },

      reportFile: {
        is_reported: 0,
        list: [],
        url: ''
      },
      // 是否生成过报告
      is_reported: 0,
      // 报告生成时间
      report_time: undefined,
      isEdit: false,
      // 检测任务的formdata对象
      taskFormData: new FormData(),
      paramsNewTasks: {
        project_id: undefined,		// 项目ID
        name: undefined,			// 任务名称
        label: undefined,		// 任务描述
        constructing_unit: undefined, // 委托单位(建设单位)
        constructing_unit_code: undefined,	// 统一信用代码(建设单位)
        constructing_contacts: undefined, // 委托单位联系人
        constructing_contact_number: undefined, // 委托单位联系电话
        constructing_address: undefined,	// 委托单位地址
        designed_unit: undefined,	// 设计单位
        construction_unit: undefined, // 施工单位(维保单位)
        management_unit: undefined,	// 管理单位
        building_name: undefined,		// 建筑名称
        building_address: undefined,	// 建筑地址
        building_floor1: undefined,		// 地上几层
        building_floor2: undefined,	// 地下几层
        area: undefined,	// 占地面积(44)
        building_area: undefined, // 建筑面积(平方米)
        building_hight: undefined,		// 建筑高度(米)
        building_type: undefined,	// 建筑类型	1=甲乙类厂房、2=其他厂房、3=仓库、4=民用建筑
        fire_rating: undefined,	// 耐火等级
        use_function: undefined,		// 使用功能
        fire_acceptance_time: undefined,	// 消防验收日期
        testing_appvoval: undefined,	// 评估批文
        testing_scope: undefined,	// 评估范围
        testing_area: undefined,		// 评估建筑面积(平方米)
        leader: undefined,			// 项目负责人
        auditor: undefined,		// 审核人
        testing_users: undefined		// 评估人
      }
    }
  },
  computed: {
    ...mapGetters([
      'project_id',
      'company_id'
    ])
  },
  created() {
    this.getTask()
    this.getUserList()
  },
  methods: {
    // 关闭查看报告对话框
    closeReport() {
      this.report_time = undefined
      this.is_reported = 0
    },
    // 生成报告
    generateReport() {
      this.$confirm('是否生成新的报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isGenerateReportLoading = true
        generateReport({ task_id: this.reportFile.task_id }).then((res) => {
          const filename = res.data.report_path.split('/').pop()
          this.reportFile.list = [{
            time: Formattimestamp(res.data.report_time),
            filename
          }]
          this.getTask()
          this.reportFile.url = process.env.VUE_APP_FILE_API + res.data.report_path
          this.isGenerateReportLoading = false
          this.$message({
            type: 'success',
            message: '新报告生成，需要查看请下载该报告'
          })
        }).catch(err => {
          this.isGenerateReportLoading = false
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    downloadReport() {
      if (this.reportFile.url !== '') window.open(this.reportFile.url)
      return
    },
    // 查看报告
    checkReport(info) {
      this.dialogVisible = true
      let fileInfo
      // 已经生成过报告
      if (!info.is_reported) {
        fileInfo = {
          list: [],
          task_id: info.task_id,
          name: info.name
        }
      } else {
        const filename = info.report_path.split('/').pop()
        fileInfo = {
          list: [{
            time: Formattimestamp(info.report_time),
            filename
          }],
          task_id: info.task_id,
          name: info.name
        }
        fileInfo.url = process.env.VUE_APP_FILE_API + info.report_path
      }
      this.reportFile = fileInfo
    },
    // 关闭窗口
    closeDialog() {
      if (this.isEdit) {
        this.init()
      } else {
        this.$refs.newTaskRuleForm.clearValidate()
      }
      this.isEdit = false
    },
    // 获取用户列表
    getUserList() {
      getUsersByCompany({ company_id: this.company_id }).then(res => {
        this.userOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 打开新建检测任务窗口
    openNewTaskDialog() {
      this.isNewDialogShow = true
    },
    // 确定新建检测任务
    onNewSubmit() {
      this.$refs.newTaskRuleForm.validate(valid => {
        if (valid) {
          this.isNewLoading = true
          for (const key in this.paramsNewTasks) {
            if (['testing_users', 'leader', 'auditor'].includes(key)) {
              this.taskFormData.set(key, JSON.stringify(this.paramsNewTasks[key]))
            } else {
              this.taskFormData.set(key, this.paramsNewTasks[key])
            }
          }
          // 是否是编辑
          if (this.isEdit) {
            this.taskFormData.set('task_id', this.task_id)
            updateTask(this.taskFormData).then(() => {
              this.isNewLoading = false
              this.$message({
                type: 'success',
                message: '编辑任务成功！'
              })
              this.getTask()
              this.isNewLoading = false
              this.isNewDialogShow = false
            }).catch(() => {
              this.isNewLoading = false
            })
          } else {
            this.taskFormData.set('project_id', this.project_id)
            newTask(this.taskFormData).then(() => {
              this.isNewLoading = false
              this.$message({
                type: 'success',
                message: '新建任务成功！'
              })
              this.init()
              this.getTask()
              this.isNewLoading = false
              this.isNewDialogShow = false
            }).catch(() => {
              this.isNewLoading = false
            })
          }
        }
      })
    },
    // 初始化表单
    init() {
      if (this.$refs.newTaskRuleForm !== undefined) this.$refs.newTaskRuleForm.resetFields()
      // this.schemefileList = []
      this.contractfileList = []
      this.taskFormData = new FormData()
      for (const key in this.paramsNewTasks) {
        this.paramsNewTasks[key] = undefined
      }
    },
    getTime(time) {
      return Formattimestamp2(time)
    },
    // 打开编辑窗口
    openEditTask(task_id) {
      this.task_id = task_id
      this.isEdit = true
      this.isNewDialogShow = true
      detailTask({ task_id }).then(res => {
        const obj = {}
        const data = res.data
        for (const key in data) {
          if (!['project_id', 'id', 'is_finished'].includes(key)) {
            obj[key] = data[key]
          }
          if (['fire_acceptance_time', 'testting_time', 'testing_completion_time'].includes(key)) {
            obj[key] = Formattimestamp(data[key])
          }
          if (['leader', 'auditor', 'testing_users'].includes(key)) {
            obj[key] = JSON.parse(data[key])
          }
        }
        this.paramsNewTasks = obj
      })
    },
    /**
     * @Description: 获取任务列表
     * @Date: 2019/5/7
     **/
    getTask() {
      this.isTaskListLoadingShow = true
      this.paramsGetTasks.project_id = this.project_id
      getTask(this.paramsGetTasks).then(response => {
        this.TaskList = response.data.items
        this.total = response.data.total
        this.isTaskListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isTaskListLoadingShow = false
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/7
     **/
    onSearch() {
      this.paramsGetTasks.page = 1
      this.getTask()
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/5/7
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除任务
     * @Date: 2019/5/7
     **/
    deleteTasks() {
      this.$confirm('确认删除选中的任务吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isTaskListLoadingShow = true
        const deleteParam = {
          task_id_list: this.multipleSelection.map(item => item.task_id).toString(),
          project_id: this.selected_project_id
        }
        deleteTask(deleteParam).then(() => {
          this.isTaskListLoadingShow = false
          this.getTask()
        }).catch(err => {
          console.log(err)
          this.isTaskListLoadingShow = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item{
    margin-bottom: 15px;
  }
  /deep/.dialog-form-item {
    margin-right: 0;
  }
  .divider {
    height: 100%;
    width: 100%;
    text-align: center;
    /deep/.el-divider--vertical {
      margin: 0 auto;
      height: 100%;
    }
  }
  /deep/.el-dialog__body{
    padding-top: 0;
  }
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .task {
    padding: 20px 20px;
    overflow: auto;
    flex: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    display: flex;
    flex-direction: column;
    height: 100%;
    /deep/.el-form-item__label {
      width: 170px;
      text-align: right;
      padding: 0;
    }
    /deep/.el-form-item__content{
      margin-left: 170px;
    }
    button {
      flex: 0 0 140px;
    }
  }
  .reportTime {
    margin: 20px 0;
    .time {
      color: #909399
    }
  }
  .dialog-footer{
    flex: 0 0 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
