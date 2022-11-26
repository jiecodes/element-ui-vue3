<template>
  <!-- 权限管理 权限列表 -->
  <div class="roles">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 行 -->
      <el-row>
        <!-- 列 -->
        <el-col>
          <!-- 表格 -->
          <el-table :data="rightsList" stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
              <!-- slot-scope="scope" 用插槽的形式获取 rightsList数据 -->
              <template slot-scope="scope">
                <!-- 标签 -->
                <el-tag>
                  <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                  <el-tag type="info" v-else-if="scope.row.level === '1'">二级</el-tag>
                  <el-tag type="warning" v-else>三级</el-tag>
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const {data: res} = await this.$http.get('rights/' + 'list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.$message.info(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 1rem;
  }
</style>