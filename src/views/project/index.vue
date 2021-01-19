<template>
  <div class="app-main">
    <div class="app-title-item">
      <!-- <span class="company-text">{{ user_company || '开拓网络技术有限公司' }}</span> -->
      <span class="tip-text title">欢迎使用利盾消防检测系统</span>
      <!-- <span class="tip-text">选中对应项目可以查看项目详细信息</span> -->
    </div>
    <div v-if="isMangmentShow" class="app-button-item">
      <div style="color:#909399;margin-bottom: 10px">-点击下方按钮可以对公司部门及人员进行管理-</div>
      <el-button v-waves type="primary" plain @click="toMangmentPage">公司以及人员管理</el-button>
    </div>
    <div class="app-project_item">
      <span style="color:#909399">-请在下方选择您需要的进入的项目模块-</span>
      <ul class="project-list">
        <li v-for="item in itemList" :key="item.item_id" class="item">
          <div class="circle" @click="onItemSelected(item.item_id)">
            <Icon class="icon" :icon-class="item.icon" />
          </div>
          <div class="name">{{ item.item_name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Icon from '@/components/SvgIcon'
export default {
  components: {
    Icon
  },
  directives: { waves },
  data() {
    return {
      itemList: [
        { item_id: 1, item_name: '设施检测', icon: 'fire' },
        // { item_id: 2, item_name: '维保' },
        { item_id: 3, item_name: '电器检测', icon: 'electricaldetection' },
        { item_id: 4, item_name: '安全评估', icon: 'security' }
        // { item_id: 5, item_name: '三小场所', icon: 'place' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type'
    ]),
    isMangmentShow: function() {
      return this.validatePer([0, 1], this.Account_Type)
    }
  },
  methods: {
    // 判断是否有权限
    validatePer(arrPer, level) {
      return arrPer.includes(level)
    },
    getItemImageUrl(id) {
      return require('@/assets/project_image/' + id + '.png')
    },
    /**
     * @Description: 获取各个项目的图片url
     * @Date: 2019/5/6
     **/
    getProjectImageUrl(ID) {
      return process.env.PROJECT_IMAGE_URL + ID + '.jpg'
    },
    /**
     * @Description: 去往管理页面
     * @Date: 2019/5/6
     **/
    toMangmentPage() {
      this.$router.push({ path: '/mangment' })
    },
    /**
     * @Description: 模块选择
     * @Date: 2019/3/10
     **/
    onItemSelected(id) {
      if (this.validatePer([0, 2], this.Account_Type)) {
        this.$store.dispatch('user/selectProjectType', id).then(() => {
          this.$router.push({
            path: '/project/project' + id,
            query: {
              pid: id
            }
          })
        })
      } else {
        this.$message({ type: 'error', message: '无权限' })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
  .box-card-component{
    .el-card__header {
      padding: 0!important;
    }
    .el-card__body {
      padding: 0!important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main{
    padding: 12px 24px 32px 24px;
  }
  .project-list {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    .item {
      margin-right: 30px;
      .circle {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #EBEEF5;
        border-radius: 50%;
        width: 100px;
        height: 100px;
        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
        .icon {
          font-size: 50px;
        }
      }
      .name {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
  .app-title-item {
    margin-left: 10px;
    margin-bottom: 30px;
    margin-top: 12px;
    .company-text{
      line-height: 48px;
      display: block;
      font-size: 26px;
      font-weight: 600;
    }
    .title {
      color: #409EFF;
      font-size: 30px;
      font-weight: 2000;
    }
    .tip-text{
      text-align: center;
      display: block;
      line-height: 36px;
    }
  }
  .app-button-item {
    margin-bottom: 10px;
  }
  .app-project_item {
    margin-left: 0;
    .project-image {
      width: 200px;
      height: 200px;
    }
  }
  .box-card-component {
    padding: 0;
    margin: 10px;
    height: 280px;
    text-align: center;
    width: 240px;
    float: left;
    cursor: pointer;
    .box-card-header {
      position: relative;
      height: 220px;
      // img {
      //   width: 100%;
      //   height: 100%;
      //   transition: all 0.2s linear;
      //   &:hover {
      //      transform: scale(1.1, 1.1);
      //      filter: contrast(130%);
      //   }
      // }
    }
    .box-card-body {
      text-align:center;
      line-height: 60px;
      .project-name-item {
        font-size: 18px;
        color: #24292e;
      }
    }
  }
</style>
