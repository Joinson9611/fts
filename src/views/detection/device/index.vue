<template>
  <div class="app-container">
    <div class="filter-container">
      <!--任务筛选-->
      <div class="taskSelect">
        <span class="title">当前任务名称：</span>
        <el-select v-model="paramsGetDevice.task_id" placeholder="任务列表" filterable style="width: 190px" @change="taskChange" @visible-change="hasTask">
          <el-option v-for="item in taskOptions" :key="item.task_id" :label="item.name" :value="item.task_id" />
        </el-select>
      </div>
      <!--系统类型筛选-->
      <el-select v-model="paramsGetDevice.system_type_id" placeholder="系统类型" filterable clearable style="width: 244px" class="filter-item" @change="systemOptionsChange">
        <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
      </el-select>
      <!-- 设备类型筛选 -->
      <el-select v-model="paramsGetDevice.device_type_id" placeholder="设备类型" filterable clearable style="width: 175px" class="filter-item" @change="deviceOptionsChange">
        <el-option v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id" />
      </el-select>
      <!-- 是否符合入市筛选 -->
      <el-select v-model="paramsGetDevice.is_right" placeholder="是否符合入市" filterable clearable style="width: 130px" class="filter-item" @change="rightOptionsChange">
        <el-option v-for="item in rightOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <!-- 是否合格筛选 -->
      <el-select v-model="paramsGetDevice.is_certificate" placeholder="是否合格" filterable clearable style="width: 106px" class="filter-item" @change="certificateChange">
        <el-option v-for="item in certificateOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

    </div>
    <el-card shadow="never" class="device-list" body-style="padding: 0;">
      <div slot="header" class="clearfix">
        <span style="line-height: 29px">设备列表</span>
        <div class="button" style="float: right">
          <!--新建任务-->
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="openNewDevice">新建设备</el-button>
          <!--删除按钮-->
          <el-button v-waves :disabled="multipleSelection.length===0" style="margin-left:0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteDevice">删除设备</el-button>
        </div>
      </div>
      <!--任务列表-->
      <el-table
        v-loading="isDeviceListLoadingShow"
        :data="deviceTable"
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
          <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDevice.page - 1) * paramsGetDevice.limit + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="系统类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.system_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openEditDevice(scope.row)">{{ scope.row.device_type }}</a>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" width="55">
          <template slot-scope="scope">
            <span>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家/产品型号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.producer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出厂日期" align="center" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.product_time ? getTime(scope.row.product_time) : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="符合入市" align="center" width="80">
          <template slot-scope="scope">
            <span :style="{color:scope.row.is_right? '#67C23A': '#F56C6C'}">{{ rightMap[scope.row.is_right] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合格证" align="center" width="70">
          <template slot-scope="scope">
            <span :style="{color:scope.row.is_certificate? '#67C23A': '#F56C6C'}">{{ certificateMap[scope.row.is_certificate] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time? getTime(scope.row.create_time) : '/' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="paramsGetDevice.page" :limit.sync="paramsGetDevice.limit" @pagination="getDeviceInfoList" />
    </el-card>
    <!--设备窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :title="isEdit?'编辑':'新建'" @closed="closeDialog">
      <el-form ref="formDevice" :model="paramsDeviceInfo" :rules="deviceInfoRules" label-width="120px">
        <el-form-item label="系统类型：" class="dialog-form-item" prop="system_type_id">
          <el-select v-model="paramsDeviceInfo.system_type_id" placeholder="系统类型" filterable clearable style="width: 190px" class="filter-item" @change="systemDialogChange">
            <el-option v-for="item in systemListOptions" :key="item.system_type_id" :label="item.system_type" :value="item.system_type_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：" class="dialog-form-item" prop="device_type_id">
          <el-select v-model="paramsDeviceInfo.device_type_id" placeholder="设备类型" filterable clearable style="width: 175px" class="filter-item">
            <el-option v-for="item in deviceTypeDialogOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" class="dialog-form-item" prop="label">
          <el-input v-model="paramsDeviceInfo.label" class="dialog-form-item" type="text" />
        </el-form-item>
        <el-form-item label="生产厂家：" class="dialog-form-item" prop="producer">
          <el-input v-model="paramsDeviceInfo.producer" class="dialog-form-item" type="text" />
        </el-form-item>
        <el-form-item label="出厂日期：" class="dialog-form-item" prop="product_time">
          <el-date-picker
            v-model="paramsDeviceInfo.product_time"
            placeholder="请选择生产日期"
            style="width: 100%;"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="符合法定市场准入规则的证明文件：" label-width="276px" class="dialog-form-item" prop="is_right">
          <el-radio-group v-model="paramsDeviceInfo.is_right">
            <el-radio :label="1">符合</el-radio>
            <el-radio :label="0">不符合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否合格：" label-position="left" class="dialog-form-item" prop="is_certificate">
          <el-radio-group v-model="paramsDeviceInfo.is_certificate">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量：" class="dialog-form-item" prop="quantity">
          <el-input-number v-model="paramsDeviceInfo.quantity" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="dialogVisible = false">取消</el-button>
        <el-button v-waves type="primary" :loading="isLoading" @click.native="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTaskList } from '@/api/task1'
import { getDeviceFirefac, addDeviceFirefac, deleteDeviceFirefac, updateDeviceFirefac } from '@/api/device1'
import { getSystemTypes } from '@/api/system'
import { getDeviceTypes } from '@/api/device'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import { Formattimestamp2 } from '@/utils/time'

export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data() {
    return {
      rightMap: ['不符合', '符合'],
      certificateMap: ['不合格', '合格'],
      rightOptions: [{ id: 0, name: '不符合' }, { id: 1, name: '符合' }],
      certificateOptions: [{ id: 0, name: '不合格' }, { id: 1, name: '合格' }],
      // 新建中或编辑中
      isLoading: false,
      isEdit: false,
      total: 0,
      dialogVisible: false,
      // 设备信息列表
      deviceTable: [],
      isDeviceListLoadingShow: false,
      deviceInfoRules: {
        system_type_id: [{ required: true, message: '请选择系统类型', trigger: 'change' }],
        device_type_id: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        label: [{ required: true, message: '请填写描述', trigger: 'blur' }],
        producer: [{ required: true, message: '请填写生产厂家', trigger: 'blur' }],
        product_time: [{ required: true, message: '请选择出厂日期', trigger: 'blur' }],
        is_right: [{ required: true, message: '是否符合法定市场准入规则的证明文件', trigger: 'blur' }],
        is_certificate: [{ required: true, message: '是否合格', trigger: 'blur' }],
        quantity: [{ required: true, message: '请填写数量', trigger: 'blur' }]
      },
      tempFilterOptions: {
        task_id: undefined,
        system_type_id: undefined,
        device_type_id: undefined
      },
      paramsGetDevice: {
        task_id: undefined,
        page: 1,
        limit: 20,
        system_type_id: undefined,
        device_type_id: undefined
      },
      paramsDeviceInfo: {
        device_id: undefined,	// 任务ID
        system_type_id: undefined, // 系统ID
        device_type_id: undefined,		// 设备类型ID
        label: undefined,			// 备注
        producer: undefined,	// 产品型号/生产厂家
        product_time: undefined,	// 出厂日期
        is_right: undefined,		// 符合法定市场准入规则的证明文件，1=符合、0=不符合
        is_certificate: undefined,
        quantity: 0	 // 数量
      },
      taskInfo: {
        label: '',
        testting_time: '',
        testing_completion_time: ''
      },
      // 当前的task_id
      task_id: undefined,
      multipleSelection: [],
      // 任务列表
      taskOptions: [],
      // 系统列表
      systemListOptions: [],
      // 设备列表
      deviceTypeOptions: [],
      deviceTypeDialogOptions: []

    }
  },
  computed: {
    ...mapGetters([
      'project_id'
    ])
  },
  created() {
    this.getTaskList()
    this.getSystemTypes()
  },
  methods: {
    getTime(timeStamp) {
      return Formattimestamp2(timeStamp)
    },
    // 关闭对话框
    closeDialog() {
      if (this.isEdit) {
        this.init()
        this.isEdit = false
        if (this.$refs.formDevice !== undefined) this.$refs.formDevice.resetFields()
      }
    },
    // 打开编辑窗口
    openEditDevice(info) {
      this.dialogVisible = true
      this.isEdit = true
      this.paramsDeviceInfo.device_id = info.device_id
      this.paramsDeviceInfo.system_type_id = info.system_type_id
      this.paramsDeviceInfo.device_type_id = info.device_type_id
      this.paramsDeviceInfo.label = info.label
      this.paramsDeviceInfo.producer = info.producer
      this.paramsDeviceInfo.product_time = info.product_time
      this.paramsDeviceInfo.is_right = info.is_right
      this.paramsDeviceInfo.is_certificate = info.is_certificate
      this.paramsDeviceInfo.quantity = info.quantity
      this.getDeviceTypes2(info.system_type_id)
      this.paramsDeviceInfo.product_time = Formattimestamp2(this.paramsDeviceInfo.product_time)
    },
    // 任务列表改变
    taskChange(id) {
      this.task_id = id
      this.getDeviceInfoList()
    },
    hasTask(val) {
      if (val) {
        if (this.taskOptions.length === 0) this.$message({ type: 'warning', message: '你还未建立检测任务' })
      }
    },
    // 获取设备信息列表
    getDeviceInfoList() {
      this.isDeviceListLoadingShow = true
      getDeviceFirefac(this.paramsGetDevice).then(res => {
        this.total = res.data.total
        this.deviceTable = res.data.items
        this.isDeviceListLoadingShow = false
      }).catch(err => {
        console.error(err)
        this.isDeviceListLoadingShow = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    init() {
      for (const key in this.paramsDeviceInfo) {
        if (key !== 'device_id') {
          setTimeout(() => {
            this.paramsDeviceInfo[key] = undefined
          }, 0)
        }
        if (key === 'quantity') {
          setTimeout(() => {
            this.paramsDeviceInfo[key] = 0
          }, 0)
        }
      }
      this.paramsDeviceInfo.device_type_id = undefined
    },
    // 提交
    onSubmit() {
      this.$refs.formDevice.validate(valid => {
        if (valid) {
          this.isLoading = true
          if (this.isEdit) {
            updateDeviceFirefac(this.paramsDeviceInfo).then(() => {
              this.isLoading = false
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.getDeviceInfoList()
              this.init()
            }).catch(err => {
              this.$message.error('编辑失败')
              this.dialogVisible = false
              this.isLoading = false
              console.error(err)
            })
          } else {
            const params = {
              task_id: this.task_id,		// 任务ID
              system_type_id: this.paramsDeviceInfo.system_type_id,	// 系统ID
              device_type_id: this.paramsDeviceInfo.device_type_id,			// 设备类型ID
              label: this.paramsDeviceInfo.label,		// label
              producer: this.paramsDeviceInfo.producer,		// 产品型号/生产厂家
              product_time: this.paramsDeviceInfo.product_time,		// 出厂日期
              is_right: this.paramsDeviceInfo.is_right,		// 符合法定市场准入规则的证明文件，1=符合、0=不符合
              is_certificate: this.paramsDeviceInfo.is_certificate,	// 是否合规
              quantity: this.paramsDeviceInfo.quantity
            }
            addDeviceFirefac(params).then(() => {
              this.isLoading = false
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '新建成功'
              })
              this.getDeviceInfoList()
              this.init()
            }).catch(err => {
              this.$message.error('新建失败')
              this.dialogVisible = false
              this.isLoading = false
              console.error(err)
            })
          }
        }
      })
    },
    // getTaskDetail() {
    //   detailTaskFire({ task_id: this.task_id }).then(res => {
    //     this.taskInfo.label = res.data.label
    //     this.taskInfo.testing_completion_time = res.data.testing_completion_time
    //     this.taskInfo.testting_time = res.data.testting_time
    //   })
    // },
    // 获取系统列表
    getSystemTypes() {
      getSystemTypes({ task_type_id: 1 }).then(res => {
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
    getDeviceTypes2(id) {
      const params = {
        system_type_id: id
      }
      getDeviceTypes(params).then(response => {
        this.deviceTypeDialogOptions = response.data.items
      }).catch(err => {
        console.error(err)
      })
    },
    // 系统类型改变
    systemOptionsChange(id) {
      this.paramsGetDevice.device_type_id = undefined
      // 如果系统列表清空执行
      if (id === '') {
        this.paramsGetDevice.system_type_id = undefined
        this.deviceTypeOptions = []
      } else {
        this.getDeviceTypes(id)
      }
      this.paramsGetDevice.page = 1
      if (this.paramsGetDevice.task_id) this.getDeviceInfoList()
    },
    // 设备类型改变
    deviceOptionsChange(id) {
      if (id === '') {
        this.paramsGetDevice.device_type_id = undefined
      }
      this.paramsGetDevice.page = 1
      if (this.paramsGetDevice.task_id) this.getDeviceInfoList()
    },
    rightOptionsChange(id) {
      if (id === '') {
        this.paramsGetDevice.is_right = undefined
      }
      this.paramsGetDevice.page = 1
      if (this.paramsGetDevice.task_id) this.getDeviceInfoList()
    },
    certificateChange(id) {
      if (id === '') {
        this.paramsGetDevice.is_certificate = undefined
      }
      this.paramsGetDevice.page = 1
      if (this.paramsGetDevice.task_id) this.getDeviceInfoList()
    },
    // 对话框系统类型改变
    systemDialogChange(id) {
      this.paramsDeviceInfo.device_type_id = ''
      // 如果系统列表清空执行
      if (id === '') {
        this.deviceTypeDialogOptions = []
      } else this.getDeviceTypes2(id)
    },
    // 获取任务列表
    getTaskList() {
      getTaskList({ project_id: this.project_id }).then(res => {
        if (res.data.items.length !== 0) {
          this.taskOptions = res.data.items
          this.paramsGetDevice.task_id = res.data.items[0].task_id
          this.task_id = res.data.items[0].task_id
          this.getDeviceInfoList()
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 打开新建设备窗口
    openNewDevice() {
      if (this.taskOptions.length === 0) {
        this.$message({ type: 'warning', message: '你还未建立检测任务' })
      } else {
        if (this.$refs.formDevice !== undefined) this.$refs.formDevice.clearValidate()
        this.dialogVisible = true
      }
    },
    // 删除设备
    deleteDevice() {
      this.$confirm('确认删除选中的设备吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isTaskListLoadingShow = true
        const deleteParam = {
          device_id_list: this.multipleSelection.map(item => item.device_id)
        }
        deleteDeviceFirefac(deleteParam).then(() => {
          this.getDeviceInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .device-list {
    .button {
      float: right;
    }
  }
  .taskSelect{
    vertical-align: top;
    display: inline-block;
    font-size: 14px;
    /deep/.filter-item{
      margin-bottom: 0;
    }
  }
  .demo-table-expand {
    /deep/.el-form-item__label{
      color: #99a9bf;
    }
    font-size: 0;
  }
  .demo-table-expand label {
    width: 180px;
    text-align: right;

  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
