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
      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leader | leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测时段" align="center" width="210">
        <template slot-scope="scope">
          <span>{{ `${getTime(scope.row.testting_time)}~${ getTime(scope.row.testing_completion_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" width="120">
        <template slot-scope="scope">
          <i v-show="scope.row.finished_time" class="el-icon-time" />
          <span>{{ scope.row.finished_time ? getTime(scope.row.finished_time) : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成" align="center">
        <template slot-scope="scope">
          <span :style="{color:scope.row.is_finished? '#67C23A':'#F56C6C'}">{{ isFinished[scope.row.is_finished] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="102"
        fixed="right"
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
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetTasks.page" :limit.sync="paramsGetTasks.limit" @pagination="getTaskFire" />

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
              <el-form-item label="委托单位：" class="dialog-form-item" prop="constructing_unit" :size="size">
                <el-input v-model="paramsNewTasks.constructing_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="设计单位：" class="dialog-form-item" prop="designed_unit" :size="size">
                <el-input v-model="paramsNewTasks.designed_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="施工单位：" class="dialog-form-item" prop="construction_unit" :size="size">
                <el-input v-model="paramsNewTasks.construction_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="检测方案：" class="dialog-form-item" :size="size">
                <el-input class="dialog-form-item" disabled :placeholder="schemefileList.length===0?'请选择检测方案':schemefileList[0].name" type="text" style="width:200px" />
                <el-button v-if="fileTestingScheme.isExport" size="mini" type="primary" @click="exportFile('testing_scheme')">导出文件</el-button>
                <el-upload
                  ref="sUpload"
                  :show-file-list="false"
                  style="display:inline-block"
                  action="customize"
                  :on-change="handleFileChange"
                  :file-list="schemefileList"
                  :auto-upload="false"
                >
                  <el-button slot="trigger" size="mini" type="primary">浏览...</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="检测面积(平方米)：" class="dialog-form-item" prop="testing_area" :size="size">
                <el-input v-model="paramsNewTasks.testing_area" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="竣工日期：" class="dialog-form-item" prop="asbuild_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.asbuild_time"
                  placeholder="请选择竣工日期"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="竣工图纸提供情况：" class="dialog-form-item" prop="asbuild_drawings" :size="size">
                <el-input v-model="paramsNewTasks.asbuild_drawings" show-word-limit maxlength="25" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="建筑总面积(平方米)：" class="dialog-form-item" prop="total_building_area" :size="size">
                <el-input v-model="paramsNewTasks.total_building_area" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type" :size="size">
                <el-input v-model="paramsNewTasks.building_type" class="dialog-form-item" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="2" style="height:460px">
              <div class="divider">
                <el-divider direction="vertical" />
              </div>
            </el-col>
            <el-col :span="11">
              <el-form-item label="统一社会信用代码：" class="dialog-form-item" prop="constructing_unit_code" :size="size">
                <el-input v-model="paramsNewTasks.constructing_unit_code" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="建筑楼层：" class="dialog-form-item" prop="building_floors" :size="size">
                <el-input v-model="paramsNewTasks.building_floors" class="dialog-form-item" type="text" oninput="value=value.replace(/[^\d.]/g,'')" />
              </el-form-item>
              <el-form-item label="建筑高度(米)：" class="dialog-form-item" prop="building_hight" :size="size">
                <el-input v-model="paramsNewTasks.building_hight" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
              </el-form-item>
              <el-form-item label="检测时间：" class="dialog-form-item" prop="testting_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.testting_time"
                  placeholder="请选择检测时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="检测完成日期：" class="dialog-form-item" prop="testing_completion_time" :size="size">
                <el-date-picker
                  v-model="paramsNewTasks.testing_completion_time"
                  placeholder="请选择检测完成时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="联系人：" class="dialog-form-item" prop="contacts" :size="size">
                <el-input v-model="paramsNewTasks.contacts" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="联系电话：" class="dialog-form-item" prop="contact_number" :size="size">
                <el-input v-model="paramsNewTasks.contact_number" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="合同金额：" class="dialog-form-item" prop="contract_amount" :size="size">
                <el-input v-model="paramsNewTasks.contract_amount" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
              </el-form-item>
              <el-form-item label="合同扫描件：" class="dialog-form-item" :size="size">
                <el-input class="dialog-form-item" disabled :placeholder="contractfileList.length===0?'请选择合同扫描件':contractfileList[0].name" type="text" style="width:200px" />
                <el-button v-if="fileContractCopy.isExport" size="mini" type="primary" @click="exportFile('contract_copy')">导出文件</el-button>
                <el-upload
                  ref="cUpload"
                  :show-file-list="false"
                  style="display:inline-block"
                  action="customize"
                  :on-change="handleFileContractChange"
                  :file-list="contractfileList"
                  :auto-upload="false"
                  accept=".pdf,.docx,.doc"
                >
                  <el-button slot="trigger" size="mini" type="primary">浏览...</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="检测类型：" class="dialog-form-item" prop="testing_type_id" :size="size">
                <el-select v-model="paramsNewTasks.testing_type_id" filterable placeholder="请选择检测类型" style="width: 100%">
                  <el-option
                    v-for="item in testingTypeOptions"
                    :key="item.type_id"
                    :label="item.type_name"
                    :value="item.type_id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="检测范围：" class="dialog-form-item" prop="testing_scope" :size="size">
                <el-select v-model="paramsNewTasks.testing_scope" filterable placeholder="请选择检测范围" style="width: 100%">
                  <el-option
                    v-for="item in testingScopeOptions"
                    :key="item.type_id"
                    :label="item.type_name"
                    :value="item.type_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测部位：" class="dialog-form-item" prop="testing_part" :size="size">
                <el-input v-model="paramsNewTasks.testing_part" class="dialog-form-item" type="text" show-word-limit maxlength="45" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测批文：" class="dialog-form-item" prop="testing_appvoval" :size="size">
                <el-input v-model="paramsNewTasks.testing_appvoval" class="dialog-form-item" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测部位使用功能：" class="dialog-form-item" prop="testing_part_functiong" :size="size">
                <el-input v-model="paramsNewTasks.testing_part_functiong" show-word-limit maxlength="45" class="dialog-form-item" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测依据：" class="dialog-form-item" prop="testing_basis" :size="size">
                <el-input v-model="paramsNewTasks.testing_basis" class="dialog-form-item" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检测内容(系统)：" class="dialog-form-item" prop="system_id_list" :size="size">
                <el-select v-model="paramsNewTasks.system_id_list" filterable multiple placeholder="请选择需检测的系统" style="width: 100%">
                  <el-option
                    v-for="item in systemTypeOptions"
                    :key="item.system_type_id"
                    :label="item.system_type"
                    :value="item.system_type_id"
                  />
                </el-select>
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
              <el-form-item label="检测人员：" class="dialog-form-item" prop="testing_users" :size="size">
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
import { deleteTaskFire, updateTaskFire, detailTaskFire, addTaskFire, getTaskFire, generateReport } from '@/api/task1'
import { getUsersByCompany } from '@/api/user'
import { getSystemTypes } from '@/api/system'
import { Formattimestamp, Formattimestamp2 } from '@/utils/time'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Detectiontasks',
  components: { Pagination },
  directives: { waves },
  filters: {
    leader(leader) {
      return JSON.parse(leader).user_name
    }
  },
  data() {
    return {
      isFinished: ['否', '是'],
      testingTypeOptions: [
        { type_id: 0, type_name: '竣工检测' },
        { type_id: 1, type_name: '年度检测' }
      ],
      testingScopeOptions: [
        { type_id: 0, type_name: '整体检测' },
        { type_id: 1, type_name: '局部检测' }
      ],
      // 报告文件
      reportFile: {
        list: [],
        url: ''
      },

      // 检测方案文件列表
      schemefileList: [],
      // 合同扫描件列表
      contractfileList: [],

      isGenerateReportLoading: false,
      isButtonDownLoading: false,
      // 新建任务加载显示
      isNewLoading: false,
      task_id: undefined,
      // 保留检测方案文件信息
      fileTestingScheme: {
        name: '',
        isExport: false,
        url: undefined
      },
      // 保留合同扫描件文件信息
      fileContractCopy: {
        name: '',
        isExport: false,
        url: undefined
      },
      dialogVisible: false,
      userOptions: [],
      systemTypeOptions: [],
      size: 'mini',
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
        constructing_unit: [{ required: true, message: '请填写委托单位', trigger: 'blur' }],
        constructing_unit_code: [{ required: true, message: '请填写统一社会信用代码', trigger: 'blur' }],
        designed_unit: [{ required: true, message: '请填写设计单位', trigger: 'blur' }],
        construction_unit: [{ required: true, message: '请填写施工单位', trigger: 'blur' }],
        testing_area: [{ required: true, message: '请填写检测面积', trigger: 'blur' }],
        asbuild_time: [{ required: true, message: '请填写竣工日期', trigger: 'change' }],
        asbuild_drawings: [{ required: true, message: '请填写竣工图纸提供情况', trigger: 'blur' }],
        total_building_area: [{ required: true, message: '请填写建筑总面积', trigger: 'blur' }],
        building_type: [{ required: true, message: '请填写建筑类型', trigger: 'blur' }],
        building_floors: [{ required: true, message: '请填写建筑楼层', trigger: 'blur' }],
        building_hight: [{ required: true, message: '请填写建筑高度', trigger: 'blur' }],
        testting_time: [{ required: true, message: '请填写检测日期', trigger: 'change' }],
        testing_completion_time: [{ required: true, message: '请填写检测完成日期', trigger: 'change' }],
        contacts: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        contact_number: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        contract_amount: [{ required: true, message: '请填写合同金额(元)', trigger: 'blur' }],
        testing_type_id: [{ required: true, message: '请选择检测类型', trigger: 'blur' }],
        testing_scope: [{ required: true, message: '请选择检测范围', trigger: 'blur' }],
        testing_part: [{ required: true, message: '请填写检测部位', trigger: 'blur' }],
        testing_appvoval: [{ required: true, message: '请填写检测批文', trigger: 'blur' }],
        testing_part_functiong: [{ required: true, message: '请填写检测部位使用功能', trigger: 'blur' }],
        testing_basis: [{ required: true, message: '请填写检测依据', trigger: 'blur' }],
        system_id_list: [{ required: true, message: '请选择检测内容(需检测的系统)', trigger: 'blur' }],
        leader: [{ required: true, message: '请选择项目负责人', trigger: 'blur' }],
        auditor: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
        testing_users: [{ required: true, message: '请选择检测人员', trigger: 'blur' }]
      },

      paramsGetTasks: {
        project_id: undefined,
        page: 1,
        limit: 20
      },
      isEdit: false,
      // 检测任务的formdata对象
      taskFormData: new FormData(),

      paramsNewTasks: {
        project_id: undefined,
        label: undefined,
        constructing_unit: undefined, // 委托单位(建设单位)
        constructing_unit_code: undefined,
        designed_unit: undefined,	// 设计单位
        construction_unit: undefined,	// 施工单位(维保单位)
        testing_area: undefined,		// 检测面积(平方米)
        asbuild_time: undefined,	// 竣工日期
        asbuild_drawings: undefined,	// 竣工图纸提供情况
        total_building_area: undefined,	// 建筑总面积(平方米)
        building_type: undefined,	// 建筑类型
        building_floors: undefined,	// 建筑楼层
        building_hight: undefined,		// 建筑高度(米)
        testting_time: undefined, // 检测日期
        testing_completion_time: undefined, // 检测完成日期
        contacts: undefined,	// 联系人
        contact_number: undefined,	// 联系电话
        contract_amount: undefined,		// 合同金额(元)
        testing_type_id: undefined,	// 检测类型0=竣工检测、1=年度检测
        testing_scope: undefined,	// 检测范围0=整体检测、1=局部检测
        testing_part: undefined, // 检测部位
        testing_appvoval: undefined,	// 检测批文
        testing_part_functiong: undefined, // 检测部位使用功能
        testing_basis: undefined,	// 检测依据
        system_id_list: undefined,	// 检测内容(需检测的系统)
        leader: undefined,		// 项目负责人
        auditor: undefined,	// 审核人
        testing_users: undefined	// 检测人员(多个)
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
    this.getTaskFire()
    this.getSystemTypes()
    this.getUserList()
  },
  methods: {

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
    // 下载报告
    downloadReport() {
      if (this.reportFile.url !== '') window.open(this.reportFile.url)
      return
    },
    // 查看报告
    checkReport(info) {
      this.dialogVisible = true
      let fileInfo
      if (info.report_path === '') {
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
    // 导出文件
    exportFile(name) {
      if (name === 'contract_copy') {
        window.open(this.fileContractCopy.url)
      } else {
        window.open(this.fileTestingScheme.url)
      }
    },
    // 关闭窗口
    closeDialog() {
      if (this.isEdit) {
        this.init()
      } else {
        this.$refs.newTaskRuleForm.clearValidate()
      }
      this.isEdit = false
      this.fileTestingScheme.isExport = false
      this.fileContractCopy.isExport = false
    },
    // 检测文件是否符合条件
    fileCheck(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'doc'
      const extension2 = testmsg === 'docx'
      const extension3 = testmsg === 'pdf'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是 doc、docx、pdf格式',
          type: 'warning'
        })
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 处理检测方案文件改变的函数
    handleFileChange(file, fileList) {
      if (this.fileCheck(file)) {
        if (fileList.length === 1) {
          this.schemefileList = fileList
        } else {
          this.schemefileList = [fileList[1]]
        }
        this.fileTestingScheme.isExport = false
        this.taskFormData.set('testing_scheme', this.schemefileList[0].raw, this.schemefileList[0].name)
      } else {
        if (this.fileTestingScheme.isExport) {
          this.schemefileList = [{ name: this.fileTestingScheme.name }]
        } else {
          this.schemefileList = []
        }
      }
    },
    // 处理合同扫描件改变的函数
    handleFileContractChange(file, fileList) {
      if (this.fileCheck(file)) {
        if (fileList.length === 1) {
          this.contractfileList = fileList
        } else {
          this.contractfileList = [fileList[1]]
        }
        this.fileContractCopy.isExport = false
        this.taskFormData.set('contract_copy', this.contractfileList[0].raw, this.contractfileList[0].name)
      } else {
        if (this.fileContractCopy.isExport) {
          this.contractfileList = [{ name: this.fileContractCopy.name }]
        } else {
          this.contractfileList = []
        }
      }
    },
    // 获取用户列表
    getUserList() {
      getUsersByCompany({ company_id: this.company_id }).then(res => {
        this.userOptions = res.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ task_type_id: 1 }).then(res => {
        this.systemTypeOptions = res.data.items
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
          if (this.schemefileList.length === 0 || this.contractfileList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请添加检测方案文件或合同扫描件！'
            })
          } else {
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
              updateTaskFire(this.taskFormData).then(() => {
                this.isNewLoading = false
                this.$message({
                  type: 'success',
                  message: '编辑检测任务成功！'
                })
                this.getTaskFire()
                this.isNewLoading = false
                this.isNewDialogShow = false
              }).catch(() => {
                this.isNewLoading = false
              })
            } else {
              this.taskFormData.set('project_id', this.project_id)
              addTaskFire(this.taskFormData).then(() => {
                this.isNewLoading = false
                this.init()
                this.$message({
                  type: 'success',
                  message: '新建检测任务成功！'
                })
                this.getTaskFire()
                this.isNewLoading = false
                this.isNewDialogShow = false
              }).catch(() => {
                this.isNewLoading = false
              })
            }
          }
        }
      })
    },
    // 初始化表单
    init() {
      if (this.$refs.newTaskRuleForm !== undefined) this.$refs.newTaskRuleForm.resetFields()
      this.schemefileList = []
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
      this.fileTestingScheme.isExport = true
      this.fileContractCopy.isExport = true
      this.isNewDialogShow = true
      detailTaskFire({ task_id }).then(res => {
        const obj = {}
        const data = res.data
        for (const key in data) {
          if (!['project_id', 'id', 'testing_scheme', 'contract_copy', 'is_finished', 'extension', 'status'].includes(key)) {
            obj[key] = data[key]
          }
          if (['asbuild_time', 'testting_time', 'testing_completion_time'].includes(key)) {
            obj[key] = Formattimestamp2(data[key])
          }
          if (['leader', 'auditor', 'testing_users'].includes(key)) {
            obj[key] = JSON.parse(data[key])
          }
          if (key === 'system_id_list') {
            // 将字符串转化为数组并将将数组项映射成number类型
            obj[key] = data[key].split(',').map(item => item * 1)
          }
          if (key === 'testing_scheme') {
            const fileName = data[key].split('/').pop()
            this.fileTestingScheme.name = fileName
            this.fileTestingScheme.url = process.env.VUE_APP_FILE_API + data[key]
            this.schemefileList = [{ name: fileName }]
          }
          if (key === 'contract_copy') {
            const fileName = data[key].split('/').pop()
            this.fileContractCopy.name = fileName
            this.fileContractCopy.url = process.env.VUE_APP_FILE_API + data[key]
            this.contractfileList = [{ name: fileName }]
          }
        }
        this.paramsNewTasks = obj
      })
    },
    /**
     * @Description: 获取任务列表
     * @Date: 2019/5/7
     **/
    getTaskFire() {
      this.isTaskListLoadingShow = true
      this.paramsGetTasks.project_id = this.project_id
      getTaskFire(this.paramsGetTasks).then(response => {
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
      this.getTaskFire()
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
        deleteTaskFire(deleteParam).then(() => {
          this.isTaskListLoadingShow = false
          this.getTaskFire()
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
  /deep/.el-drawer__body{
    padding: 0;
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
      width: 148px;
      text-align: right;
      padding: 0;
    }
    /deep/.el-form-item__content{
      margin-left: 148px;
    }
    button {
      flex: 0 0 140px;
    }
  }
  .dialog-footer{
    flex: 0 0 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
