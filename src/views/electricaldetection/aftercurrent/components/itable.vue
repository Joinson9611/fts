<template>
  <div class="app-container">
    <iTable :data="tree_data" :deep="0" />
  </div>
</template>

<script>
const width = '30px'
import { Formattimestamp2 } from '@/utils/time'
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
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.name
              },
              {
                id: 3,
                type: 'label',
                data: '检定时间',
                width: '90px'
              },
              {
                id: 11,
                type: 'label',
                data: this.getTime(this.tableinfo.testing_time)
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
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.weather
              },
              {
                id: 3,
                type: 'label',
                data: '额定电压（V）',
                width: '90px'
              },
              {
                id: 11,
                type: 'label',
                data: this.tableinfo.rated_voltage
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
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.testing_address
              },
              {
                id: 3,
                type: 'label',
                data: '触发电流（mA）',
                width: '90px'
              },
              {
                id: 11,
                type: 'label',
                data: this.tableinfo.trigger_current
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
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.device_name
              },
              {
                id: 3,
                type: 'label',
                data: '型号/规格',
                width: '90px'
              },
              {
                id: 11,
                type: 'label',
                data: this.tableinfo.device_type
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
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.testing_id
              },
              {
                id: 3,
                type: 'label',
                data: '触发时间',
                width: '90px'
              },
              {
                id: 11,
                type: 'label',
                data: this.tableinfo.trigger_time
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
                width: '90px'
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
                        data: '无触发测试(x1/2)'
                      },
                      {
                        id: 3,
                        type: 'label',
                        data: '触发测试(x1)'
                      }, {
                        id: 3,
                        type: 'label',
                        data: '快速触发测试(x5)'
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
                        data: this.tableinfo.trigger_current_1 || '/'
                      },
                      {
                        id: 3,
                        type: 'label',
                        data: this.tableinfo.trigger_current_2 || '/'
                      }, {
                        id: 3,
                        type: 'label',
                        data: this.tableinfo.trigger_current_3 || '/'
                      }
                    ]
                  },
                  {
                    id: 3,
                    type: 'label',
                    data: '相位角设为（°）'
                  },
                  {
                    id: 3,
                    type: 'row',
                    data: [
                      {
                        id: 3,
                        type: 'row',
                        data: [
                          {
                            id: 3,
                            type: 'label',
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            id: 3,
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
                          },
                          {
                            id: 3,
                            type: 'label',
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            id: 3,
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
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
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            id: 3,
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
                          },
                          {
                            id: 3,
                            type: 'label',
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            id: 3,
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
                          }
                        ]
                      },
                      {
                        id: 3,
                        type: 'row',
                        data: [
                          {
                            type: 'label',
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
                          },
                          {
                            type: 'label',
                            data: '0',
                            innerwidth: width,
                            width: '25%'
                          }, {
                            type: 'label',
                            data: '180',
                            innerwidth: width,
                            width: '25%'
                          }
                        ]
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
                data: '触发情况',
                width: '90px'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.trigger_situation_1 || '/'
              },
              {
                id: 3,
                type: 'label',
                data: this.tableinfo.trigger_situation_2 || '/'
              },
              {
                id: 11,
                type: 'label',
                data: this.tableinfo.trigger_situation_3 || '/'
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
                data: '触发时间（ms）',
                width: '90px'
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_1_1 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_1_2 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_1_3 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_1_4 || '/',
                    innerwidth: width,
                    width: '25%'
                  }
                ]
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_2_1 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_2_2 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_2_3 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_2_4 || '/',
                    innerwidth: width,
                    width: '25%'
                  }
                ]
              },
              {
                type: 'row',
                data: [
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_3_1 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_3_2 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_3_3 || '/',
                    innerwidth: width,
                    width: '25%'
                  },
                  {
                    id: 2,
                    type: 'label',
                    data: this.tableinfo.trigger_time_3_4 || '/',
                    innerwidth: width,
                    width: '25%'
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
                data: '结果判定',
                width: '90px'
              },
              {
                type: 'label',
                data: this.tableinfo.is_pass ? '正常' : '异常',
                color: this.tableinfo.is_pass ? '#67C23A' : '#F56C6C'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    getTime(time) {
      return Formattimestamp2(time)
    }
  }
}
</script>

