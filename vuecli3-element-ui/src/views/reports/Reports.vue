<template>
  <!-- 数据统计 数据报表 -->
  <div class="reports">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 2 为 ECharts 准备一个定义了宽高的 DOM -->
       <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1 导入echarts
import * as echarts from 'echarts'
// 导入js库 用于俩个options数组合并
import _ from 'lodash'


export default {
  data() {
    return {
      // 图表需要合并的数据
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
  created() {},
  // 页面元素渲染完毕了 
  async mounted() {
    // 3 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      const {data: res} = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error('获取数据统计数据失败')
      this.$message.success('获取数据统计数据成功了')
      console.log(res.data)

      // es6合并数组
      // const result = {...this.options, ...res.data}
      // 浅拷贝 合并数组
      // const result = Object.assign(this.options, res.data)
      // lodash 里面的方法 合并数组
      const result = _.merge(this.options, res.data)

      // 4 指定图表的配置项和数据
      // var option = {
      //   title: {
      //     text: 'ECharts 入门示例'
      //   },
      //   tooltip: {},
      //   legend: {
      //     data: ['销量']
      //   },
      //   xAxis: {
      //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      //   },
      //   yAxis: {},
      //   series: [
      //     {
      //       name: '销量',
      //       type: 'bar',
      //       data: [5, 20, 36, 10, 10, 20]
      //     }
      //   ]
      // };

      // 5 使用刚指定的配置项和数据显示图表。
      // 使用官方显示
      // myChart.setOption(option);
      // 没有合并数组 只是使用了链接里面的
      // myChart.setOption(res.data);
      // 合并数组后的
      myChart.setOption(result);
  },
  methods: {
    
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 1rem;
}
</style>