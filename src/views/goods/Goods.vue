<template>
  <!-- 商品管理 商品列表 -->
  <div class="goods">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="40">
        <el-col :span="9">
          <!-- 清空 请求数据  clearable 清空input内的数据   @clear="getGoodsList" 内置的清空方法 重新请求数据    v-model="goodsInfo.query绑定query后 点击查询后调用获取商品数据方法 搜索数据显示  -->
          <el-input placeholder="请输入内容" v-model="goodsInfo.query"   clearable @clear="getGoodsList">
            <!-- @click="getGoodsList" 点击搜索数据 重新调用请求数据  根据后台携带的query参数查询 -->
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col> 
        <el-col :span="6">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table stripe border :data="goodsList" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100" ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="removeGoodsById(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 ¶Pagination  -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsInfo.pagenum"
      :page-sizes="[5, 10, 25, 50]"
      :page-size="goodsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background  >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 商品信息
      goodsInfo: {
        // 点击input 用于查询数据功能实现
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示几条数据
        pagesize: 10,
      },
      // 总页数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {
        params: this.goodsInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.$notify.info('获取商品列表数据成功')
      this.goodsList = res.data.goods
      this.total = res.data.total

    },
    // 分页   每页显示几条数据
    handleSizeChange(newsize) {
      console.log(newsize)
      this.goodsInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 当前页码
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.goodsInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 点击操作 删除按钮
    async removeGoodsById(row) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      console.log(confirm)
      // 点击 取消了
      if (confirm === 'cancel') return this.$alert('点击取消了')
      this.$message.info('删除成功了')
      // 然后 发起删除数据请求
      const {data: res} = await this.$http.delete(`goods/${row.goods_id}`)
      console.log(res + '根据商品id 发起删除商品数据')
      if(res.meta.status !== 200) return this.$message.error('删除商品数据失败')
      this.$message.success('删除商品数据成功了')
      this.getGoodsList()
    },
    // 点击添加按钮 到 add 页面
    goAddpage() {
      this.$router.push('/goods/add')
    },
  }
}
</script>

<style scoped>
.el-card {
  box-shadow: 0 0 9px 4px rgba(0,0,0,.3);
  margin-top: 1rem;
}
.el-table, 
.el-pagination {
  margin-top: 1rem;
}

</style>