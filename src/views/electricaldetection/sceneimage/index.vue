<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="tempFilterOptions.address" placeholder="测试地点" style="width:200px;" class="filter-item" @keyup.enter.native="onSearch" />
      <el-input v-model="tempFilterOptions.note" placeholder="额外备注" style="width:200px;" class="filter-item" @keyup.enter.native="onSearch" />
      <el-select v-model="paramsGetSceneImg.is_pass" placeholder="是否合格" filterable clearable style="width: 106px" class="filter-item" @change="passChange">
        <el-option v-for="item in passOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div> -->
    <!--任务列表-->
    <el-table
      v-loading="isSceneImgListLoading"
      :data="resistanceList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          <span @click="openDialogSceneImg(scope.row)"><i>{{ scope.row.project_name }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="说明" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.illustration || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建议" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.advise || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ getTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="checkImg(scope.row.image)">查看图片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetSceneImg.page" :limit.sync="paramsGetSceneImg.limit" @pagination="getSceneImg" />
    <el-dialog :visible.sync="dialogImgVisible" :append-to-body="true" :close-on-click-modal="true" title="现场图片">
      <img v-if="sceneImg" v-viewer :src="sceneImg" class="item-image">
      <el-image v-else class="item-image" />
    </el-dialog>
  </div>
</template>

<script>
import { getHistory3_4s, getHistory3_4sDetail } from '@/api/history3_4s'
import { Formattimestamp } from '@/utils/time'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tempFilterOptions: {
        address: undefined,
        note: undefined
      },
      // 检查项列表
      resistanceList: [],
      // 设备类型列表
      deviceTypeList: [],
      passMap: ['否', '是'],
      isButtonAddLoadingShow: false,
      isSceneImgListLoading: false,
      total: 0,
      passOptions: [
        { id: 0, name: '不合格' },
        { id: 1, name: '合格' }
      ],
      dialogImgVisible: false,
      paramsGetSceneImg: {
        project_id: undefined,
        page: 1,
        limit: 20,
        is_pass: undefined
      },
      sceneImg: ''
    }
  },
  computed: {
    ...mapGetters([
      'project_id',
      'system_type_options'
    ])
  },
  created() {
    this.getSceneImg()
  },
  methods: {
    checkImg(url) {
      this.dialogImgVisible = true
      // let arr = []
      // if (url) {
      //   arr = url.split(',')
      //   arr = arr.map(item => process.env.FILE_URL + item)
      // } else {
      //   arr = []
      // }
      // this.sceneImg = arr
      if (url) {
        this.sceneImg = process.env.VUE_APP_FILE_API + url
      }
    },
    getTime(time) {
      return Formattimestamp(time)
    },
    openDialogSceneImg({ history_id }) {
      getHistory3_4sDetail({ history_id }).then(res => {
        console.log(res)
      })
    },
    passChange(id) {
      this.paramsGetSceneImg.is_pass = (!id && id !== 0) ? undefined : id
      this.getSceneImg()
    },
    closeDialog() {
      this.dialogAddVisible = false
      this.dialogEditVisible = false
      this.$message({
        message: '取消删除',
        type: 'info'
      })
    },

    onSearch() {
      this.paramsGetSceneImg.note = this.tempFilterOptions.note || undefined
      this.paramsGetSceneImg.address = this.tempFilterOptions.address || undefined
      this.paramsGetSceneImg.page = 1
      this.getSceneImg()
    },

    // 获取接地电阻列表
    getSceneImg() {
      this.isSceneImgListLoading = true
      this.paramsGetSceneImg.project_id = this.project_id
      getHistory3_4s(this.paramsGetSceneImg).then(response => {
        this.isSceneImgListLoading = false
        this.total = response.data.total
        this.resistanceList = response.data.items
      }).catch(err => {
        console.log(err)
        this.isSceneImgListLoading = false
      })
    }
  }
}
</script>

 <style lang="scss" scoped>
  .item-image{
    display: flex;
    align-items: center;
    // margin-top: 5px;
    // margin-right: 5px;
    margin: 0 auto;
    width: 220px;
    height: 220px;
    // &:last-child {
    //   margin-right: 0;
    // }
  }
 </style>
