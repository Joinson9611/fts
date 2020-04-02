<template>
  <div>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;" />
    <el-checkbox-group v-model="checkedItems" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="item in items" :key="item[id]" :label="item[type]">{{ city }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      required: true,
      type: Array
    },
    id: {
      type: String,
      default: 'id'
    },
    type: {
      type: String,
      default: 'name'
    },
    checkedParams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkAll: this.checkedParams.length === this.list.length,
      checkedItems: this.checkedParams,
      options: this.list,
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedItems = val ? this.checkedItems : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>
