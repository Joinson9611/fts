<template>
  <div class="app-container">
    <iTable :data="tree_data" :deep="0" />
  </div>
</template>

<script>
import iTable from '@/components/infinite-split-table'
export default {
  components: {
    iTable
  },
  props: {
    tableinfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: 1,
      tree_data: {
        type: 'column',
        id: 0,
        data: [
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '检测仪器',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '检定时间',
                width: '100px'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '天气',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '额定电压（V）',
                width: '100px'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '检测地点',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '触发电流（mA）',
                width: '100px'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '设备名称',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '型号/规格',
                width: '100px'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '设备编号',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '触发时间',
                width: '100px'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },

          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '漏电触发电流（mA）',
                width: '100px'
              },
              {
                type: 'column',
                data: [
                  {
                    id: 3,
                    type: 'label',
                    data: '检测结果'
                  },
                  {
                    id: 3,
                    type: 'row',
                    data: [
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      },
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }, {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }
                    ]
                  },
                  {
                    id: 3,
                    type: 'row',
                    data: [
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      },
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }, {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }
                    ]
                  },
                  {
                    id: 3,
                    type: 'label',
                    data: '111111111111'
                  },
                  {
                    id: 3,
                    type: 'row',
                    data: [
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      },
                      {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }, {
                        id: 3,
                        type: 'label',
                        data: '111111111111'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '检测仪器',
                width: '100px'
              },
              {
                id: 3,
                type: 'label',
                data: '111111111111'
              },
              {
                id: 3,
                type: 'label',
                data: '检测距离（mm）'
              },
              {
                id: 11,
                type: 'label',
                data: '7'
              }
            ]
          },
          {
            id: 1,
            type: 'row',
            data: [
              {
                id: 2,
                type: 'label',
                data: '检测仪器',
                width: '100px'
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  }
                ]
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  }
                ]
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: '0',
                    innerwidth: '25%'
                  }
                ]
              }
            ]
          },
          {
            type: 'row',
            data: [
              {
                type: 'label',
                data: '判定结果',
                width: '100px'
              },
              {
                type: 'label',
                data: '判定结果'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

