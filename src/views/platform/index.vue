<template>
  <div class="platform">
    <el-tabs type="border-card">
      <el-tab-pane label="项目管理"><project /></el-tab-pane>
      <el-tab-pane label="公司管理"><company /></el-tab-pane>
      <el-tab-pane label="部门管理"><department /></el-tab-pane>
      <el-tab-pane label="人员管理"><staff /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import project from './components/project'
import department from './components/department'
import company from './components/company'
import staff from './components/staff'

export default {
  components: {
    project,
    department,
    company,
    staff
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

