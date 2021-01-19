<template>
  <div>
    <table
      :class="{'top-border':deep==0,'left-border':deep==0}"
      class="infinite-split-table"
      cellpadding="0"
      cellspacing="0"
    >
      <template>
        <tr
          v-for="(line,key) in for_data"
          :key="key"
          :style="{height:typeof line[0].height!='undefined'?line[0].height:'auto'}"
          style="width: 100%;"
        >
          <td
            v-for="(item,key1) in line"
            :key="key1"
            :style="{width:typeof item.width!='undefined'?item.width:'auto'}"
            style="padding:0px"
          >
            <div v-if="item.type!='row'&&item.type!='column'" ref="text" class="text">
              <div v-if="item.type=='label'" :style="{width: typeof !item.width ? item.innerwidth: '100px'}" class="inner">
                <span :style="{color: item.color || 'black'}">
                  {{ item.data }}
                </span>
              </div>
            </div>
            <infinite-split-table
              v-else
              :data="item"
              :deep="deep+1"
            />
          </td>
        </tr>
      </template>
    </table>
  </div>

</template>
<script>
export default {
  name: 'InfiniteSplitTable',
  props: {
    data: {
      type: Object,
      required: true
    },
    deep: {
      type: Number,
      required: true
    }
  },
  computed: {
    for_data() {
      const type = this.data.type
      const data = this.data.data
      const result = []
      if (type === 'row') {
        result.push(data)
      } else if (type === 'column') {
        for (let i = 0; i < data.length; i++) {
          result.push([data[i]])
        }
      }
      return result
    }
  }
}
</script>
<style scoped lang="scss">
  $borderColor: #000;
  $borderWidth: 1px;
  .infinite-split-table{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .left-border{
    border-left: $borderWidth solid $borderColor;// 左边框宽度
  }
  .top-border{
    border-top: $borderWidth solid $borderColor;
  }
  .text{
    font-size: 2px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 14px 5px;
    .inner {
      width: 95px;
      text-align: center;
      word-wrap: break-word;
      word-break: break-all;
    }
    box-sizing: border-box;
    border-right:  $borderWidth solid $borderColor;
    border-bottom:  $borderWidth solid $borderColor;
    height: 100%;
    min-height: 20px;
  }
</style>

