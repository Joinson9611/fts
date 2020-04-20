<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openNewProjectDialog">新建项目</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteProjects">删除项目</el-button>
    </div> -->
    <el-card shadow="never" class="project-list" body-style="padding: 0;">
      <div slot="header" class="clearfix">
        <span style="line-height: 29px">项目列表</span>
        <div class="button" style="float: right">
          <!--新建-->
          <el-button v-waves class="filter-item" style="margin-left: 10px" size="small" type="primary" icon="el-icon-plus" @click="openNewProjectDialog">新建项目</el-button>
          <!--删除-->
          <el-button v-waves :disabled="multipleSelection.length===0" size="small" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteProjects">删除项目</el-button>
        </div>
      </div>
      <!--项目列表-->
      <el-table
        v-loading="isProjectListLoadingShow"
        :data="ProjectList"
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
          <template slot-scope="scope"><span>{{ scope.$index+(paramsGetProjects.page - 1) * paramsGetProjects.limit + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openEditProject(scope.row.project_id)"><i>{{ scope.row.name }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="项目描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评估时段" align="center" width="190">
          <template slot-scope="scope">
            <span>{{ `${getTime(scope.row.testing_time)}~${ getTime(scope.row.testing_completion_time)}` }}</span>
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
          width="210"
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
            <el-button
              class="btn"
              type="primary"
              size="mini"
              @click="enterProject(scope.row.project_id)"
            >
              进入项目
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="paramsGetProjects.page" :limit.sync="paramsGetProjects.limit" @pagination="getProject" />
    </el-card>
    <!-- 新建检测项目的窗口 -->
    <el-drawer
      ref="drawer"
      :visible.sync="isNewDialogShow"
      direction="ltr"
      size="100%"
      @closed="closeDialog"
    >
      <template slot="title">
        <div class="content">
          {{ isEdit ? '编辑项目' : '新建项目' }}
        </div>
        <div class="button" style="text-align:right;margin-right:15px">
          <el-button type="success" plain @click="exportTemp">导出项目信息</el-button>
          <el-button type="success" plain @click="dialogImportVisible = true">导入项目信息</el-button>
        </div>
      </template>
      <div class="project">
        <el-form ref="newProjectRuleForm" :model="paramsNewProjects" :rules="taskTules">
          <div class="title">项目信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：" class="dialog-form-item" prop="name" :size="size">
                <el-input v-model="paramsNewProjects.name" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="项目描述：" class="dialog-form-item" prop="label" :size="size">
                <el-input v-model="paramsNewProjects.label" class="dialog-form-item" type="text" />
              </el-form-item>
              <amap v-if="isNewDialogShow" :position="pos" @getPos="getPos" />
              <el-form-item label="项目开始时间：" class="dialog-form-item" prop="testing_time" :size="size">
                <el-date-picker
                  v-model="paramsNewProjects.testing_time"
                  placeholder="请选择项目开始时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="项目结束时间：" class="dialog-form-item" prop="testing_completion_time" :size="size">
                <el-date-picker
                  v-model="paramsNewProjects.testing_completion_time"
                  placeholder="请选择项目结束时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="委托单位：" class="dialog-form-item" prop="constructing_unit" :size="size">
                <el-input v-model="paramsNewProjects.constructing_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="委托单位联系电话：" class="dialog-form-item" prop="constructing_contact_number" :size="size">
                <el-input v-model="paramsNewProjects.constructing_contact_number" oninput="value=value.replace(/[^\d.]/g,'')" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="委托单位联系人：" class="dialog-form-item" prop="constructing_contacts" :size="size">
                <el-input v-model="paramsNewProjects.constructing_contacts" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="委托单位地址：" class="dialog-form-item" prop="constructing_address" :size="size">
                <el-input v-model="paramsNewProjects.constructing_address" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="统一社会信用代码：" class="dialog-form-item" prop="constructing_unit_code" :size="size">
                <el-input v-model="paramsNewProjects.constructing_unit_code" class="dialog-form-item" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设计单位：" class="dialog-form-item" prop="designed_unit" :size="size">
                <el-input v-model="paramsNewProjects.designed_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="施工单位：" class="dialog-form-item" prop="construction_unit" :size="size">
                <el-input v-model="paramsNewProjects.construction_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="管理单位：" class="dialog-form-item" prop="management_unit" :size="size">
                <el-input v-model="paramsNewProjects.management_unit" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="竣工图纸提供情况：" class="dialog-form-item" prop="asbuild_drawings" :size="size">
                <el-input v-model="paramsNewProjects.asbuild_drawings" show-word-limit maxlength="25" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="竣工日期：" class="dialog-form-item" prop="asbuild_time" :size="size">
                <el-date-picker
                  v-model="paramsNewProjects.asbuild_time"
                  placeholder="请选择竣工日期"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="消防验收日期：" class="dialog-form-item" prop="fire_acceptance_time" :size="size">
                <el-date-picker
                  v-model="paramsNewProjects.fire_acceptance_time"
                  placeholder="请选择消防验收日期"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="建筑类型：" class="dialog-form-item" prop="building_type_id" :size="size">
                <el-select v-model="paramsNewProjects.building_type_id" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item">
                  <el-option v-for="item in buildingOptions" :key="item.building_type_id" :label="item.building_name" :value="item.building_type_id" />
                </el-select>
              </el-form-item>
              <el-form-item label="评估范围 ：" class="dialog-form-item" prop="testing_scope" :size="size">
                <el-input v-model="paramsNewProjects.testing_scope" class="dialog-form-item" type="text" />
              </el-form-item>
              <el-form-item label="评估建筑面积(平方米) ：" class="dialog-form-item" prop="testing_area" :size="size">
                <el-input v-model="paramsNewProjects.testing_area" class="dialog-form-item" oninput="value=value.replace(/[^\d.]/g,'')" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="评估批文：" class="dialog-form-item" prop="testing_appvoval" :size="size">
                <el-input v-model="paramsNewProjects.testing_appvoval" class="dialog-form-item" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="title">检测人员信息</div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目负责人：" class="dialog-form-item" prop="leader" :size="size">
                <el-select v-model="paramsNewProjects.leader" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
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
                <el-select v-model="paramsNewProjects.auditor" filterable value-key="user_id" placeholder="请选择项目负责人" style="width: 100%">
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
                <el-select v-model="paramsNewProjects.testing_users" multiple filterable value-key="user_id" placeholder="请选择检测人员" style="width: 100%">
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
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="true" :title="'项目名称-'+reportFile.name">
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
    <!--弹出导入窗口-->
    <el-dialog :visible.sync="dialogImportVisible" :append-to-body="true" :close-on-click-modal="false" style="text-align: center; min-width: 800px">
      <el-upload
        ref="upload"
        :multiple="false"
        :auto-upload="false"
        :on-change="onUploadChange"
        :before-upload="onUploadFileCheck"
        :before-remove="onUploadFileRemove"
        :on-exceed="onUploadFileLimit"
        :http-request="UploadFile"
        :limit="1"
        drag
        accept=".xls,.xlsx"
        action="customize"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">请上传有效的excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click.native="onUploadButtonCancel">取消</el-button>
        <el-button
          v-waves
          :loading="isButtonUploadLoadingShow"
          :disabled="isUploadButtonDisable"
          type="primary"
          @click.native="onUploadButtonSubmit"
        >上传
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, newProject, detailProject, updateProject, deleteProject, generateReport, exportTemp, importTemp } from '@/api/project4s'
import { getUsersByCompany } from '@/api/user'
import { Formattimestamp, Formattimestamp2 } from '@/utils/time'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import amap from '@/components/amap'

export default {
  name: 'Securitytasks',
  components: { Pagination, amap },
  directives: { waves },
  data() {
    return {
      isFinished: ['否', '是'],
      buildingOptions: [
        { building_type_id: 1, building_name: '甲乙类厂房' },
        { building_type_id: 2, building_name: '其他厂房' },
        { building_type_id: 3, building_name: '仓库' },
        { building_type_id: 4, building_name: '民用建筑' }
      ],
      pos: {
        sname: '', // 地点名称
        slat: 0, // 纬度
        slon: 0 // 经度
      },
      dialogImportVisible: false,
      isButtonUploadLoadingShow: false,
      isUploadButtonDisable: false,
      isGenerateReportLoading: false,
      isButtonDownLoading: false,
      // 新建项目加载显示
      isNewLoading: false,
      dialogVisible: false,
      userOptions: [],
      systemTypeOptions: [],
      size: 'mini',
      // 报告加载显示
      isReportLoading: false,
      isNewDialogShow: false,
      isProjectsDeleteShow: false,
      multipleSelection: [],
      ProjectList: [],
      total: 0,
      isProjectListLoadingShow: true,
      tempFilterOptions: {
        task_name: undefined,
        task_type2_id: undefined,
        task_state2: undefined
      },

      taskTules: {
        name: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        label: [{ required: true, message: '请填写项目描述', trigger: 'blur' }],
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
        building_type_id: [{ required: true, message: '请选择建筑类型', trigger: 'change' }],
        building_name: [{ required: true, message: '请填写建筑名称', trigger: 'blur' }],
        building_area: [{ required: true, message: '请填写建筑面积', trigger: 'blur' }],
        building_floor1: [{ required: true, message: '请填写地上几层', trigger: 'blur' }],
        building_floor2: [{ required: true, message: '请填写地下几层', trigger: 'blur' }],
        building_height: [{ required: true, message: '请填写建筑高度', trigger: 'blur' }],
        testing_time: [{ required: true, message: '请选择项目开始时间', trigger: 'change' }],
        testing_completion_time: [{ required: true, message: '请选择项目结束时间', trigger: 'change' }],
        testing_scope: [{ required: true, message: '请选择检测范围', trigger: 'blur' }],
        testing_part: [{ required: true, message: '请填写检测部位', trigger: 'blur' }],
        testing_appvoval: [{ required: true, message: '请填写检测批文', trigger: 'blur' }],
        testing_area: [{ required: true, message: '请填写评估建筑面积(平方米)', trigger: 'blur' }],
        use_function: [{ required: true, message: '请填写使用功能', trigger: 'blur' }],
        fire_rating: [{ required: true, message: '请填写耐火等级', trigger: 'blur' }],
        fire_acceptance_time: [{ required: true, message: '请选择消防验收日期', trigger: 'change' }],
        leader: [{ required: true, message: '请选择项目负责人', trigger: 'blur' }],
        auditor: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
        testing_users: [{ required: true, message: '请选择评估人员', trigger: 'blur' }],
        asbuild_time: [{ required: true, message: '请选择竣工日期', trigger: 'change' }],
        asbuild_drawings: [{ required: true, message: '请填写竣工图纸提供情况', trigger: 'blur' }]
      },
      paramsGetProjects: {
        company_id: undefined,
        page: 1,
        limit: 20
      },

      reportFile: {
        is_reported: 0,
        list: [],
        project_id: undefined,
        url: ''
      },
      // 是否生成过报告
      is_reported: 0,
      // 报告生成时间
      report_time: undefined,
      isEdit: false,
      // 检测项目的formdata对象
      taskFormData: new FormData(),
      paramsNewProjects: {
        name: undefined,			// 项目名称
        label: undefined,		// 项目描述
        constructing_unit: undefined, // 委托单位(建设单位)
        constructing_unit_code: undefined,	// 统一信用代码(建设单位)
        constructing_contacts: undefined, // 委托单位联系人
        constructing_contact_number: undefined, // 委托单位联系电话
        constructing_address: undefined,	// 委托单位地址
        designed_unit: undefined,	// 设计单位
        construction_unit: undefined, // 施工单位(维保单位)
        management_unit: undefined,	// 管理单位
        // building_name: undefined,		// 建筑名称’
        // building_address: undefined,	// 建筑地址
        // building_floor1: undefined,		// 地上几层
        // building_floor2: undefined,	// 地下几层
        asbuild_time: undefined, // 竣工日期
        asbuild_drawings: undefined,	// 竣工图纸提供情况
        // area: undefined,	// 占地面积(44)
        // building_area: undefined, // 建筑面积(平方米)
        // building_height: undefined,		// 建筑高度(米)
        building_type_id: undefined,	// 建筑类型	1=甲乙类厂房、2=其他厂房、3=仓库、4=民用建筑
        // fire_rating: undefined,	// 耐火等级
        // use_function: undefined,		// 使用功能
        fire_acceptance_time: undefined,	// 消防验收日期
        testing_appvoval: undefined,	// 评估批文
        testing_scope: undefined,	// 评估范围
        testing_area: undefined,		// 评估建筑面积(平方米)
        testing_time: undefined,
        testing_completion_time: undefined,
        leader: undefined,			// 项目负责人
        auditor: undefined,		// 审核人
        testing_users: undefined		// 评估人
      }
    }
  },
  computed: {
    ...mapGetters([
      'company_id'
    ])
  },
  created() {
    this.getProject()
    this.getUserList()
  },
  methods: {
    onUploadChange() {
      this.isUploadButtonDisable = false
    },
    /**
     * @Description: 上传对话框文件删除时回调
     * @Date: 2019/5/5
     **/
    onUploadFileRemove() {
      this.isUploadButtonDisable = true
    },
    /**
     * @Description: 取消上传操作
     * @Date: 2019/5/5
     **/
    onUploadButtonCancel() {
      this.dialogImportVisible = false
    },
    /**
     * @Description: 上传文件事件
     * @Date: 2019/5/5
     **/
    onUploadButtonSubmit() {
      this.$refs.upload.submit()
    },
    /**
     * @Description: 上传文件类型大小限制
     * @Date: 2019/5/5
     **/
    onUploadFileCheck(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'warning'
        })
      }
      return extension || extension2 && isLt2M
    },
    /**
     * @Description: 文件数量限制
     * @Date: 2019/5/5
     **/
    onUploadFileLimit() {
      this.$message({
        message: '只能上传一个文件',
        type: 'warning'
      })
    },
    /**
     * @Description: 文件上传操作
     * @Date: 2019/5/5
     **/
    UploadFile(content) {
      this.isButtonUploadLoadingShow = true
      const formData = new FormData()
      formData.append('excel', content.file, content.file.name)
      importTemp(formData).then((res) => {
        const data = res.data
        for (const key in data) {
          if (['asbuild_time', 'testing_time', 'testing_completion_time', 'fire_acceptance_time'].includes(key)) {
            this.paramsNewProjects[key] = Formattimestamp2(data[key])
          } else {
            this.paramsNewProjects[key] = data[key]
          }
        }
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.isButtonUploadLoadingShow = false
        this.dialogImportVisible = false
      }).catch(err => {
        console.error(err)
        this.isButtonUploadLoadingShow = false
      })
    },
    enterProject(pid) {
      this.$store.dispatch('user/SelectProject', pid).then(() => {
        this.$store.dispatch('RemoveRoutes').then(() => {
          this.$router.push({ path: '/projects/info' })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    exportTemp() {
      exportTemp({ project_id: this.project_id }).then(res => {
        this.$message({ type: 'success', message: '导出成功' })
        const fileName = (this.paramsNewProjects.name || '安全评估') + '.xlsx'
        const fileDownload = require('js-file-download')
        fileDownload(res.data, fileName)
      }).catch(err => {
        console.error(err)
      })
    },
    uploadFile(formData) {
      importTemp(formData).then(res => {
        console.log('导入成功')
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取从amap组件得到的位置信息
    getPos(pos) {
      this.paramsNewProjects.longitude = pos.slon
      this.paramsNewProjects.latitude = pos.slat
      this.paramsNewProjects.address = pos.sname
    },
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
        generateReport({ project_id: this.reportFile.project_id }).then((res) => {
          const filename = res.data.report_path.split('/').pop()
          this.reportFile.list = [{
            time: Formattimestamp(res.data.report_time),
            filename
          }]
          this.getProject()
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
          project_id: info.project_id,
          name: info.name
        }
      } else {
        const filename = info.report_path.split('/').pop()
        fileInfo = {
          list: [{
            time: Formattimestamp(info.report_time),
            filename
          }],
          project_id: info.project_id,
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
        this.$refs.newProjectRuleForm.clearValidate()
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
    // 打开新建检测项目窗口
    openNewProjectDialog() {
      this.project_id = ''
      this.pos.slon = 0
      this.pos.slat = 0
      this.pos.sname = ''
      this.isNewDialogShow = true
    },
    // 确定新建检测项目
    onNewSubmit() {
      this.$refs.newProjectRuleForm.validate(valid => {
        if (valid) {
          if (this.paramsNewProjects.address && this.paramsNewProjects.longitude) {
            this.isNewLoading = true
            for (const key in this.paramsNewProjects) {
              if (['testing_users', 'leader', 'auditor'].includes(key)) {
                this.taskFormData.set(key, JSON.stringify(this.paramsNewProjects[key]))
              } else {
                this.taskFormData.set(key, this.paramsNewProjects[key])
              }
            }
            // 是否是编辑
            if (this.isEdit) {
              this.taskFormData.set('project_id', this.project_id)
              updateProject(this.taskFormData).then(() => {
                this.isNewLoading = false
                this.$message({
                  type: 'success',
                  message: '编辑项目成功！'
                })
                this.getProject()
                this.isNewLoading = false
                this.isNewDialogShow = false
              }).catch(() => {
                this.isNewLoading = false
              })
            } else {
              newProject(this.taskFormData).then(() => {
                this.isNewLoading = false
                this.$message({
                  type: 'success',
                  message: '新建项目成功！'
                })
                this.init()
                this.getProject()
                this.isNewLoading = false
                this.isNewDialogShow = false
              }).catch(() => {
                this.isNewLoading = false
              })
            }
          } else {
            this.$message({ type: 'warning', message: '请完善项目地址' })
          }
        } else {
          this.$message({ type: 'warning', message: '请完善项目信息' })
        }
      })
    },
    // 初始化表单
    init() {
      if (this.$refs.newProjectRuleForm !== undefined) this.$refs.newProjectRuleForm.resetFields()
      // this.schemefileList = []
      this.contractfileList = []
      this.taskFormData = new FormData()
      for (const key in this.paramsNewProjects) {
        this.paramsNewProjects[key] = undefined
      }
    },
    getTime(time) {
      return Formattimestamp2(time)
    },
    // 打开编辑窗口
    openEditProject(project_id) {
      this.project_id = project_id
      this.isEdit = true
      this.isNewDialogShow = true
      detailProject({ project_id }).then(res => {
        const obj = {}
        const data = res.data
        this.pos.slon = data.longitude
        this.pos.slat = data.latitude
        this.pos.sname = data.address
        for (const key in data) {
          if (!['project_id', 'id', 'is_finished'].includes(key)) {
            obj[key] = data[key]
          }
          if (['fire_acceptance_time', 'testing_time', 'testing_completion_time', 'asbuild_time'].includes(key)) {
            obj[key] = Formattimestamp(data[key])
          }
          if (['leader', 'auditor', 'testing_users'].includes(key)) {
            obj[key] = JSON.parse(data[key])
          }
        }
        this.paramsNewProjects = obj
      })
    },
    /**
     * @Description: 获取项目列表
     * @Date: 2019/5/7
     **/
    getProject() {
      this.isProjectListLoadingShow = true
      this.paramsGetProjects.company_id = this.company_id
      getProject(this.paramsGetProjects).then(response => {
        this.ProjectList = response.data.items
        this.total = response.data.total
        this.isProjectListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isProjectListLoadingShow = false
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/7
     **/
    onSearch() {
      this.paramsGetProjects.page = 1
      this.getProject()
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/5/7
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除项目
     * @Date: 2019/5/7
     **/
    deleteProjects() {
      this.$confirm('确认删除选中的项目吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isProjectListLoadingShow = true
        const deleteParam = {
          project_id_list: this.multipleSelection.map(item => item.project_id).toString(),
          project_id: this.selected_project_id
        }
        deleteProject(deleteParam).then(() => {
          this.isProjectListLoadingShow = false
          this.getProject()
        }).catch(err => {
          console.log(err)
          this.isProjectListLoadingShow = false
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
  // /deep/.el-dialog__body{
  //   padding-top: 0;
  // }
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .project {
    overflow: auto;
    flex: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
      width: 100%;
      height: 50px;
      font-size: 17px;
      line-height: 50px;
      color: #666c75;
      padding-left: 25px;
      font-weight: 500;
      border-top:1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 15px;
    }
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
