<template>
  <div class="box">
    <img src="https://files.jb51.net/images/xgimg/bcimg1.png" alt="">
    <viewer :images="imageUrl">
      <img v-for="(url,index) in imageUrl" :key="index" :src="url" class="image">
      <!-- <img :src="imageUrl[0]" class="image"> -->
    </viewer>
    <el-button @click="f">
      dianji
    </el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      imageUrl: ['https://files.jb51.net/images/xgimg/bcimg1.png']
    }
  },
  methods: {
    f() {
      window.open('http://192.168.3.101/fts/public/testing_scheme/1/20191106/APP研发.docx')
    }
  }
}
</script>

<style>
.box{
  overflow: auto;
  width: 200px;
  height: 200px;
  background-color: red;
}
.inner{
  width: 400px;
  height: 400px;
  background-color: pink;
}
</style>
