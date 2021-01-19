<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="isDialogInstrumentShow = true">新建</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onInstrumentDelete">删除</el-button>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isListLoadingShow"
      :data="instrumenlist"
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
        <template slot-scope="scope">
          <span>{{ scope.$index+(paramsGetInstrument.page - 1) * paramsGetInstrument.limit + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column label="仪器名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="onInstrumentEdit(scope.row)"><i>{{ scope.row.name }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="用途描述" align="center">
        <template slot-scope="scope">
          <span><i>{{ scope.row.note || '-' }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span><i class="el-icon-time" />{{ formateTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetInstrument.page" :limit.sync="paramsGetInstrument.limit" @pagination="getInstrumentList" />
    <el-dialog :visible.sync="isDialogInstrumentShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑检测仪器' : '新建检测仪器' " @closed="closeDialogGroup">
      <el-form ref="formdata" :model="instrumentInfo" :rules="instrumentRules" label-width="120px">
        <el-form-item label="仪器名称：" class="dialog-form-item" prop="name">
          <el-input v-model="instrumentInfo.name" />
        </el-form-item>
        <el-form-item label="用途描述：" class="dialog-form-item" prop="note">
          <el-input v-model="instrumentInfo.note" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogInstrumentShow = false">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Formattimestamp } from '@/utils/time'
import { getInstrumentList, addInstrument, updateInstrument, deleteInstrument } from '@/api/instrumentation3s'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      instrumentRules: {
        name: { required: true, message: '请填写仪器名称', trigger: 'blur' }
      },
      passOptions: [
        { id: 0, name: '不合格' },
        { id: 1, name: '合格' }
      ],
      isEdit: false,
      isButtonLoadingShow: false,
      instrumenlist: [],
      isDialogInstrumentShow: false,
      isListLoadingShow: false,
      multipleSelection: [],
      tempFilterOptions: {
        address: undefined,
        note: undefined
      },
      // 检测仪器总数
      total: 0,
      // 请求检测仪器列表信息参数
      paramsGetInstrument: {
        project_id: undefined,
        page: 1,
        limit: 20,
        address: undefined,
        note: undefined,
        is_pass: undefined
      },
      instrumentInfo: {
        project_id: undefined,
        name: undefined,
        note: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['project_id'])
  },
  created() {
    this.getInstrumentList()
  },
  methods: {
    passChange(id) {
      this.paramsGetInstrument.is_pass = (!id && id !== 0) ? undefined : id
      this.getInstrumentList()
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    // 提交表单
    onSumbit() {
      this.$refs.formdata.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const params = {
              instrumentation_id: this.instrumentInfo.instrumentation_id,
              project_id: this.project_id,
              name: this.instrumentInfo.name,
              note: this.instrumentInfo.note
            }
            updateInstrument(params).then(() => {
              this.isDialogInstrumentShow = false
              this.getInstrumentList()
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          } else {
            const params = {
              project_id: this.project_id,
              note: this.instrumentInfo.note,
              name: this.instrumentInfo.name
            }
            addInstrument(params).then(() => {
              this.isDialogInstrumentShow = false
              this.getInstrumentList()
              this.$message({
                type: 'success',
                message: '新建成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    newGroup() {
      this.isDialogInstrumentShow = true
    },
    onInstrumentEdit(info) {
      this.isDialogInstrumentShow = true
      this.isEdit = true
      this.instrumentInfo.instrumentation_id = info.instrumentation_id
      this.instrumentInfo.name = info.name
      this.instrumentInfo.note = info.note
    },
    closeDialogGroup() {
      if (this.isEdit) {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.resetFields()
        this.init()
      } else {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.clearValidate()
      }
      this.isEdit = false
    },
    init() {
      this.instrumentInfo.name = undefined
      this.instrumentInfo.user_list = undefined
      this.instrumentInfo.note = undefined
    },
    onInstrumentDelete() {
      this.$confirm('确认删除选中的检测仪器吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          instrumentation_id_list: this.multipleSelection.map(item => item.instrumentation_id).toString(),
          project_id: this.project_id
        }
        deleteInstrument(deleteParam).then(() => {
          this.isListLoadingShow = false
          this.getInstrumentList()
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },
    getInstrumentList() {
      this.paramsGetInstrument.project_id = this.project_id
      this.isListLoadingShow = true
      getInstrumentList(this.paramsGetInstrument).then(res => {
        this.isListLoadingShow = false
        this.total = res.data.total
        this.instrumenlist = res.data.items
      }).catch(err => {
        console.error(err)
        this.isListLoadingShow = false
      })
    },
    formateTime(timpstamp) {
      return Formattimestamp(timpstamp)
    }
  }
}
</script>

<style>

</style>
