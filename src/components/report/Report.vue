<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 1100px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
// 引入 ECharts
import * as echarts from 'echarts'
// 引入 lodash   进行对象合并const newOjb = _.merge(ojb1,ojb2)
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      // 服务器请求回来的配置对象
      getOption: {},
      // 需要合并的配置对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 组件在内存中创建完成 已经获取数据 可以发起Ajax
  created() {
    // this.getData()
    // console.log(this.getOption)
  },
  // 组件初次在页面是渲染完成 可以操作dom
  async mounted() {
    // 获取服务端配置数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.$message.success(res.meta.msg)
    this.getOption = res.data

    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 合并配置对象
    const newOptions = _.merge(this.getOption, this.options)
    // console.log(newOptions)
    // 绘制图表
    myChart.setOption(newOptions)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
