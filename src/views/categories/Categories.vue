<template>
  <!-- 商品管理 商品分类 -->
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类 -->
      <el-button @click="addCategories" class="buttonTop" type="primary">添加分类</el-button>
      <!-- 行 -->
      <el-row>
        <!-- 列 -->
        <el-col  >
        </el-col>
      </el-row>
      <!-- 导入的第三方插件 树形控件   selection选择框   expand 展开符    -->
      <tree-table :data="categoriesList" :columns="columns" show-index :selection-type="false" :expand-type="false" index-text="#" border :show-row-hover="false" >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: lightblue" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag type="info" v-else-if="scope.row.cat_level == '1'">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="orders" slot-scope="scope">
          <!-- 美化标签 -->
          <!-- <pre>
            {{scope.row}}
          </pre> -->
          <el-button @click="ShowCategoriesDialog(scope.row.cat_id)" size="mini" type="success">编辑</el-button>
          <el-button @click="removeInfoById(scope.row.cat_id)" size="mini" type="danger">删除</el-button>
        </template>
      </tree-table>

      <!-- Pagination 分页    size-change 监听 每页有几条数据 发生的改变    current-change 当前页码值 发生改变触发-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类按钮 -->
    <el-dialog title="添加分类" :visible.sync="categoriesDialogVisible" width="40%" @close="categoriesDialogClose" >
      <el-form :model="addCategoriesForm" :rules="addCategoriesFormRules" ref="addCategoriesFormRef" label-width="100px" >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- Cascader 级联选择器  options指定数据源 props指定配置对象  v-model双向绑定数据到显示框中 change数据发生改变触发 -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="{ ...cascaderProps,expandTrigger: 'hover', checkStrictly: 'true' }" @change="parentCateChanged" clearable show-all-levels></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="categoriesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoriesY">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击操作修改按钮 弹出对话框 -->
    <el-dialog title="分类名称" :visible.sync="isShowCategoriesEditDialog" width="40%" >
      <el-form :model="CategoriesEditForm" :rules="isShowCategoriesFormRules" ref="isShowCategoriesFormRef" label-width="100px" >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="CategoriesEditForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="isShowCategoriesEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategoriesEditForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击操作删除按钮 弹出对话框 -->
    <el-dialog title="分类名称" :visible.sync="isShowCategoriesEditDialog" width="40%" >
      <el-form :model="CategoriesEditForm" :rules="isShowCategoriesFormRules" ref="isShowCategoriesFormRef" label-width="100px" >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="CategoriesEditForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="isShowCategoriesEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategoriesEditForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        // 有几层
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页有几条数据
        pagesize: 5
      },
      // 商品分类数据
      categoriesList: [],
      // 总数据条数
      total: 0,
      // 导入的树形控件 指定列
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      // 自定义模板
      {
        label: '是否有效',
        // 表示 当前列 定义为模板列
        type: 'template',
        // 表示 当前这一列使用的模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 表示 当前列 定义为模板列
        type: 'template',
        // 表示 当前这一列使用的模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 表示 当前列 定义为模板列
        type: 'template',
        // 表示 当前这一列使用的模板名称
        template: 'orders'
      }
      ],

      // 添加分类 对话框
      categoriesDialogVisible : false,
      // 添加分类表单的数据对象  添加分类按钮
      addCategoriesForm: {
        // 添加分类名称
        cat_name: '',
        // 父级分类id 0表示一级父级
        cat_pid: 0,
        // 分类等级 默认添加的是一级分类
        cat_level: 0,
      },
      // 添加分类表单 验证
      addCategoriesFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },

      // 级联选择器  父级分类列表
      parentCateList: [],
      // 指定级联选择器配置对象
      cascaderProps: {
        // 选中的值
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 嵌套的属性
        children: 'children'
      },
      // 选中的父级分类id数组
      selectedKeys: [],

      // 点击操作里面的编辑按钮 是否显示对话框
      isShowCategoriesEditDialog: false,
      // 根据id请求到的数据 保存
      CategoriesEditForm: '',
      // 验证规则
      isShowCategoriesFormRules: {
        cat_name: [
           { required: true, message: '输入用户名', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
      },

      // 点击操作里面的编辑按钮  删除信息对话框
      isDangerEditDialog : false
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    // 获取商品分类数据
    async getCategoriesList() {
      // get 请求需要传递参数 params
      const { data: res} = await this.$http.get('categories', {params: this.queryInfo} )
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.$notify.success(res.meta.msg + '分类数据')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件     当前点击的 每页有几条数据 触发  newPageSize 当前 每页有几条数据
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCategoriesList()
    },
    // 监听 pagenum(当前页码值) 改变的事件  当前点击 页码值 触发    newPageNum 当前所有的页码值
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCategoriesList()
    },

    // 点击 添加分类按钮
    addCategories() {
      // 获取分类数据
      this.getParentCateList()
      // 显示添加分类 对话框 
      this.categoriesDialogVisible = true
    },
    // 获取添加分类数据 点击添加分类按钮
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      console.log(res)
      this.parentCateList = res.data
    }, 
    // 级联选择器数据发生改变触发  @change      b站 P108
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 添加分类数据 判断分类id和分类等级 如果选中的父级分类数组长度 大于0表示不是一级分类  否则是一级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCategoriesForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCategoriesForm.cat_level = this.selectedKeys.length
      } else {
        // 否者是一级分类
        this.addCategoriesForm.cat_pid = 0
        this.addCategoriesForm.cat_level = 0
      }
    },
    // 点击添加按钮 弹出的对话框确认
    addCategoriesY() {
      // console.log(this.addCategoriesForm)
      // 提交前先进行验证表单
      this.$refs.addCategoriesFormRef.validate(async valid => {
        if (!valid) return      // valid表示验证通过    验证未通过 return
        // 验证通过发起请求   this.addCategoriesForm 请求体
        const {data: res} = await this.$http.post('categories', this.addCategoriesForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类数据失败')
        this.$message.success(res.meta.msg + '分类数据添加成功')
        this.getCategoriesList() 
        this.categoriesDialogVisible = false
      })
    },
    // 分类对话框关闭 触发
    categoriesDialogClose() {
      // 获取到需要清空的元素
      this.$refs.addCategoriesFormRef.resetFields()
      // 重置级联选择框  重置里面的属性
      this.addCategoriesForm.cat_pid = 0
      this.addCategoriesForm.cat_level = 0
      this.selectedKeys = []
    },

    // 点击操作里面的编辑按钮
    async ShowCategoriesDialog(id) {
      const {data: res} = await this.$http.get('categories/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取修改分类数据失败')
      this.CategoriesEditForm = res.data
      // 弹出编辑对话框
      this.isShowCategoriesEditDialog = true
    },
    // 点击操作里面的编辑按钮 里面的确定
    addCategoriesEditForm() {
      // 验证表单内容
      this.$refs.isShowCategoriesFormRef.validate(async valid => {
        // 没验证通过
        if (!valid) {
          return this.$message.error('请填写正确的验证规则')
        } else {
          // 调用修改分类表单请求
          const {data :res} = await this.$http.put('categories/' + this.CategoriesEditForm.cat_id, { 
            cat_name: this.CategoriesEditForm.cat_name
          })
          console.log(res)
          // 提示修改分类数据成功
          this.$notify.info(res.meta.msg)
        }
        // 重新获取数据
        this.getCategoriesList()
        // 关闭编辑对话框
        this.isShowCategoriesEditDialog = false
      })
    },
    // 点击操作里面的删除按钮
    async removeInfoById(id) {
      // 弹出删除信息对话框
      this.isDangerEditDialog = true
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      // }).catch(err => {
      //   return err
      // })
      }).catch(err => err)
      console.log(confirmResult)
      // 点击确认 返回 confirm
      // 点击取消 返回 cancel
      if (confirmResult !== 'confirm') return this.$notify.info('点击了取消')
      this.$message.success('点击确认 删除成功了')
      // 发送请求 进行删除用户信息
      const {data: res} = await this.$http.delete('categories/' + id)
      console.log(res)
      // 刷新用户列表
      this.getCategoriesList()
      // 关闭 弹框
      this.isDangerEditDialog = false
    },
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 1rem;
  }
  .buttonTop {
    margin-bottom: 1rem;
  }
  .el-pagination {
    margin: 1rem 0;
  }
  .el-cascader {
    width: 100%;
  }
</style>