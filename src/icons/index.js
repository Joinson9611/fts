import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

// 导入/svg文件夹下所有.svg结尾的图标
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
