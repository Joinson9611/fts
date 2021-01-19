<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tempFilterOptions.device_name" placeholder="仪器名称" style="width:200px;" class="filter-item" @keyup.enter.native="onSearch" />
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isInfraredListLoading"
      :data="infraredList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="仪器名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogInfrared(scope.row)"><i>{{ scope.row.device_name }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="风速(m/s)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wind_speed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测距离(mm)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.detection_distance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="湿度(%)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.humidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境温度(℃)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.temperature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检定时间" align="center">
        <template slot-scope="scope">
          <span>{{ getTime(scope.row.testing_time) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetInfrared.page" :limit.sync="paramsGetInfrared.limit" @pagination="getInfrared" />
    <el-drawer
      title="详情"
      :visible.sync="dialogVisible"
      direction="ltr"
      size="60%"
    >
      <div class="history">
        <el-form label-position="left" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="仪器名称" class="dialog-form-item" prop="building">
                <span>{{ infraredInfo.device_name }}</span>
              </el-form-item>
              <el-form-item label="风速(m/s)" class="dialog-form-item">
                <span>{{ infraredInfo.wind_speed || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检测距离(mm)" class="dialog-form-item">
                <span>{{ infraredInfo.detection_distance || '-' }}</span>
              </el-form-item>
              <el-form-item label="湿度(%)" class="dialog-form-item">
                <span>{{ infraredInfo.humidity || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="环境温度(℃)" class="dialog-form-item">
                <span>{{ infraredInfo.temperature }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检定时间" class="dialog-form-item">
                <span>{{ getTime(infraredInfo.testing_time) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间" class="dialog-form-item">
                <span>{{ getTime(infraredInfo.create_time) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="数据列表" class="dialog-form-item" />
              <el-table
                v-loading="isInfraredDataListLoading"
                :data="infraredDataList"
                element-loading-text="Loading"
                style="width: 100%;"
                border
                fit
                highlight-current-row
              >
                <el-table-column label="序号" align="center" width="70">
                  <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
                </el-table-column>
                <el-table-column label="检测设备名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.testing_device_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="检测部位" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.detection_part }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="检测地址" width="140" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="负荷电流(A)" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.load_current }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="额定电流(A)" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.rated_current }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="温度(℃)" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.temperature }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="checkImg(scope.row.image)">查看图片</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--页码导航-->
          <pagination v-show="total>0" :total="total1" :page.sync="paramsGetInfraredData.page" :limit.sync="paramsGetInfraredData.limit" @pagination="getInfraredDevDataList" />
          <el-dialog :visible.sync="dialogImgVisible" :append-to-body="true" :close-on-click-modal="true" title="图片">
            <img v-if="image" v-viewer :src="image" class="item-image">
            <el-image v-else class="item-image" />
          </el-dialog>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Formattimestamp2 } from '@/utils/time'

import { getInfraredList, getInfraredDetail, getInfraredDevDataList } from '@/api/history3_3s'
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
      // 红外检测列表
      infraredList: [],
      infraredDataList: [],
      // 设备类型列表
      deviceTypeList: [],
      dialogVisible: false,
      passMap: ['否', '是'],
      isButtonAddLoadingShow: false,
      isInfraredListLoading: false,
      isInfraredDataListLoading: false,
      dialogImgVisible: false,
      total: 0,
      total1: 0,
      paramsGetInfrared: {
        project_id: undefined,
        page: 1,
        limit: 20,
        device_name: undefined
      },
      paramsGetInfraredData: {
        project_id: undefined,
        page: 1,
        limit: 20,
        device_id: undefined
      },
      infraredInfo: {
        device_name: undefined,
        wind_speed: undefined,
        detection_distance: undefined,
        humidity: undefined,
        temperature: undefined,
        testing_time: undefined
      },
      image: ''
    }
  },
  computed: {
    ...mapGetters([
      'project_id',
      'system_type_options'
    ])
  },
  created() {
    this.getInfrared()
  },
  methods: {
    checkImg(url) {
      this.dialogImgVisible = true
      if (url) {
        this.image = process.env.VUE_APP_FILE_API + url
      }
    },
    getTime(time) {
      return Formattimestamp2(time)
    },
    // 获取指定id的红外设备测出的数据列表
    getInfraredDevDataList() {
      this.isInfraredDataListLoading = true
      this.paramsGetInfraredData.project_id = this.project_id
      getInfraredDevDataList(this.paramsGetInfraredData).then(res => {
        this.isInfraredDataListLoading = false
        this.total1 = res.data.total
        this.infraredDataList = res.data.items
      }).catch(() => {
        this.isInfraredDataListLoading = false
      })
    },
    openDialogInfrared({ device_id }) {
      this.paramsGetInfraredData.device_id = device_id
      this.dialogVisible = true
      getInfraredDetail({ device_id }).then(res => {
        this.infraredInfo = res.data
        this.getInfraredDevDataList()
      })
    },
    passChange(id) {
      this.paramsGetInfrared.is_pass = (!id && id !== 0) ? undefined : id
      this.getInfrared()
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
      this.paramsGetInfrared.device_name = this.tempFilterOptions.device_name || undefined
      this.paramsGetInfrared.page = 1
      this.getInfrared()
    },

    // 获取接地电阻列表
    getInfrared() {
      this.isInfraredListLoading = true
      this.paramsGetInfrared.project_id = this.project_id
      getInfraredList(this.paramsGetInfrared).then(response => {
        this.isInfraredListLoading = false
        this.total = response.data.total
        this.infraredList = response.data.items
      }).catch(err => {
        console.log(err)
        this.isInfraredListLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .history {
    flex: 1;
    overflow: auto;
    .device-item {
      /deep/.el-divider--horizontal {
        margin: 0;
      }
      .item {
        .list{
          font-size: 14px;
          .title {
            height: 30px;
            line-height: 30px;
            color:#303133;
          }
          .content {
            height: 30px;
            line-height: 30px;
            color:#909399;
          }
        }
      }
    }
    /deep/.el-form-item__content {
      span {
        color: #99a9bf;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
  }
  .item-image{
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 220px;
    height: 220px;
  }
</style>
