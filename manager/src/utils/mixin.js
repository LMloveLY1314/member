/**
 */

import Vue from 'vue'
import { Foundation } from '../ui-utils/index'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      // 日期选择器快捷选项
      MixinPickerShortcuts: [{
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    }
  },
  computed: {
    /**
     * 缓存页面数组
     * @returns {default.computed.cachedViews|(function())|Array|*|getters.cachedViews}
     */
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    /**
     * 返回默认时间 + 5分钟
     * 用于日期时间选择器的默认时间
     * @returns {string}
     * @constructor
     */
    MixinDefaultTime() {
      const today = new Date()
      let hours = today.getHours()
      let minutes = today.getMinutes() + 5
      let seconds = today.getSeconds()
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return hours + ':' + minutes + ':' + seconds
    }
  },
  methods: {
    /** 返回克隆后的对象 */
    MixinClone(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    /** 用于修改单条表格数据后，set到tableData中 */
    MixinSetTableData(tableData, idName, id, response) {
      const { data } = tableData
      const index = data.findIndex(item => item[idName] === id)
      Vue.set(data, index, response)
    },
    /** 用于判断表单是否为空 */
    MixinRequired(message, trigger) {
      return { required: true, pattern: /^\S.*$/gi, message: message + '【不能以空格开始】', trigger: trigger || 'blur' }
    },
    /** 格式化金钱 */
    MixinFormatPrice(row, column, cellValue, index) {
      if (typeof cellValue !== 'number') return ''
      return '￥' + Foundation.formatPrice(cellValue)
    },
    /** 格式化时间戳 */
    MixinUnixToDate(row, column, cellValue, index) {
      return Foundation.unixToDate(cellValue)
    },
    /**
     * 导出Excel
     * @param json   要导出的json数据
     * @param name   要导出的文件名
     * @param type   要导出的数据类型
     * @constructor
     */
    MixinExportJosnToExcel(json, name = 'data', type = 'application/octet-stream') {
      //json包含文件和每一列数据，wb：构造表格对象
      let wb = {
        SheetNames: [],
        Sheets: {},
        Props: { }
      }
      //如果json不是数组，转换成数组类型
      if (!Array.isArray(json)) json = [json]
     console.log(json)
      //遍历
      json.forEach(item => {
        //填充表格名
        wb.SheetNames.push(item.sheet_name)
        //填充表的数据：使用 XLSX.utils.json_to_sheet，json转为表格数据的工具
        //接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表
        wb.Sheets[item.sheet_name] = XLSX.utils.json_to_sheet(item.sheet_values, item.sheet_options)
        console.log(wb)
      })

      const wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary' }
      //将数据放入对象workBook的Sheets中等待输出
      let blob = new Blob([s2ab(XLSX.write(wb, wopts))], { type })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${name}.xlsx`
      link.click()
      // 释放资源
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)

      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length)
          const view = new Uint8Array(buf)
          for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        } else {
          const buf = new Array(s.length)
          for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
      }
    }
  }
}
