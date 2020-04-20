<template>
  <div class="uploadFile">
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
  </div>
</template>

<script>
import waves from '@/directive/waves'
export default {
  name: 'Upload',
  directives: {
    waves
  },
  data() {
    return {
      isButtonUploadLoadingShow: false,
      isUploadButtonDisable: false
    }
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
    }
  },
  /**
     * @Description: 文件数量限制
     * @Date: 2020/4/10
     **/
  onUploadFileLimit() {
    this.$message({
      message: '只能上传一个文件',
      type: 'warning'
    })
  },
  /**
     * @Description: 文件上传操作
     * @Date: 2020/4/10
     **/
  UploadFile(content) {
    this.isButtonUploadLoadingShow = true
    const formData = new FormData()
    formData.append('excel', content.file, content.file.name)
    this.$emit('onUpload', formData)
  }
}
</script>

<style lang="scss" scoped>
  .dialog-footer {
    padding: 10px 20px 0 20px
  }
</style>
