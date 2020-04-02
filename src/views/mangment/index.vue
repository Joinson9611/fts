<template>
  <div class="platform">
    <el-tabs type="card">
      <el-tab-pane v-if="validatePer([0],Account_Type)" label="公司管理" lazy><company /></el-tab-pane>
      <el-tab-pane v-if="validatePer([0,1],Account_Type)" label="部门管理" lazy><department /></el-tab-pane>
      <el-tab-pane v-if="validatePer([0,1],Account_Type)" label="人员管理" lazy><staff /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import department from './components/department'
import company from './components/company'
import staff from './components/staff'
import { mapGetters } from 'vuex'

export default {
  name: 'Project',
  components: {
    department,
    company,
    staff
  },
  computed: {
    ...mapGetters([
      'Account_Type'
    ])
  },
  methods: {
    // 判断是否有权限
    validatePer(arrPer, level) {
      return arrPer.includes(level)
    }
  }
}
</script>

<style lang="scss" scoped>
  .platform {
    /deep/.el-tabs__content {
      height: 100%;
    }
  }
</style>

