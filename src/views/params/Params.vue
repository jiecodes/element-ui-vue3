<template>
  <!-- 商品管理  分类参数 -->
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- Alert 警告 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col :span="24">
          <span>选择商品分类</span>
          <!-- 选择商品分类级联选择器   options数据源 props配置级联选择框 v-model把选中的id值双向绑定到数据中     -->
          <el-cascader v-model="selectCateKeys" :options="categoriesList" :props="{ ...categoriesProps,expandTrigger: 'hover' }" @change="CategoriesHandleChange" ></el-cascader>
        </el-col>
      </el-row>
      <el-button  type="primary" class="btnCenter">添加参数</el-button>
      <!-- tabs 标签页 v-model双向数据绑定(当前激活名称动态绑定到对应名称上)  -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
        <el-button @click="addDialogClose" :disabled="isBtnDisabled" type="primary" class="btnBottom">添加参数</el-button>
          <!-- table 表格 -->
          <el-table :data="manyTabData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <!-- 获取manyTabData里面的数据 -->
                <!-- {{scope.row}} -->
                <!-- 展示的tag标签 循环出来的  -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index, scope.row)"  type="success" closable>{{item}}</el-tag>
                <!-- 加上scope.row.inputVisible(为true 展示input) 为了选中这一行数据  -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row.attr_id)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button @click="RemoveEditParams(scope.row.attr_id)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="addDialogClose" :disabled="isBtnDisabled" type="primary" class="btnBottom">添加属性</el-button>
          <!-- table 表格 -->
          <el-table :data="onlyTabData" stripe border>
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <!-- 获取onlyTabData里面的数据 -->
                <!-- {{scope.row}} -->
                <!-- 展示的tag标签 循环出来的  -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index, scope.row)"  type="success" closable>{{item}}</el-tag>
                <!-- 加上scope.row.inputVisible(为true 展示input) 为了选中这一行数据  -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row.attr_id)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button @click="RemoveEditParams(scope.row.attr_id)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 点击添加参数/添加属性 弹出的对话框 -->
      <el-dialog
        :title="'添加 '+ tabText"  
        :visible.sync="paramsDialogVisible"
        width="30%"
        @close="tabDialogClose">
        <el-form :model="tabForm" :rules="tabRules" ref="tabFormRef" label-width="100px">
          <el-form-item label="活动名称" prop="attr_name">
            <el-input v-model="tabForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="paramsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 点击动态参数 修改按钮 弹出的对话框 -->
      <el-dialog
        title="修改动态参数"  
        :visible.sync="editParamsDialogVisible"
        width="30%" 
        @close="editParamsDialogClose">
        <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsFormRef" label-width="100px">
          <el-form-item label="活动名称" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParamsY">确 定</el-button>
        </span>
      </el-dialog>

      
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表数据
      categoriesList: [],
      // 级联选择框配置对象
      categoriesProps: {
        // 选中的值
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 嵌套的属性
        children: 'children'
      },
      // 级联选择框双向绑定到的数据
      selectCateKeys: [],

      // tabs标签  当前被激活页签的名称
      activeName: 'many',
      // 动态参数 分类参数列表
      manyTabData: [],
      // 静态属性 分类参数列表
      onlyTabData: [],

      // 点击添加参数/添加属性 弹出对话框
      paramsDialogVisible: false,
      // 点击添加参数/添加属性 验证规则
      tabRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      // 点击添加参数/添加属性 添加时的数据
      tabForm: {
        attr_name: ''
      },

      // 动态参数里面的 点击修改按钮弹出 对话框
      editParamsDialogVisible: false,
      // 点击添加动态参数 里面的修改按钮 修改时的数据
      editParamsForm: {
        attr_name: ''
      },
      // 点击添加动态参数 里面的修改按钮 修改时的数据 验证规则
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      
      // table表格里面的展开行 切换按钮和input显示
      inputVisible: false,
      //  input绑定的数据  文本框输入的内容
      inputValue: '',
      

    };
  },
  created() {
    // 发起获取 分类列表数据
    this.getCategoriesList();
  },
  methods: {
    // 获取商品分类列表数据 级联选择框使用
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表数据失败");
      this.$message.info(res.meta.msg + '  cascader级联选择器 商品分类列表数据 101');
      this.categoriesList = res.data;
    },
    // 级联选择框发出改变触发 change 
    CategoriesHandleChange() {
      console.log(this.selectCateKeys)
      this.getParamsList()
      
    },
    
    // tabs页签 被点击触发的事件  
    handleTabsClick() {
      // 为请求数据 参数做准备 请求数据参数(sel)
      console.log(this.activeName)
      this.getParamsList()
      
    },
    // 获取参数列表数据
    async getParamsList() {
      // 解决 点击三级分类后 在点击二级分类数据不会清空
      if (this.selectCateKeys.length !== 3) {
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // 根据所选分类id 发送请求分类参数列表
      const {data: res} = await this.$http.get(`categories/${this.categoriesId}/attributes`, {
        params: {sel: this.activeName}
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.info('获取分类参数列表失败')
      // 实现table表格第一列中的 expand 放置的标签数据
      res.data.forEach(item => {
        // attr_vals 字符串转换为数组 split分隔    三元表达式:解决没有数据时,渲染出空tag标签
        // item.attr_vals字符串有数据 返回true  没有数据 返回false
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 解决添加输入框内容一样的问题  给每一个input提供 v-mode和v-if值
        // 控制每一项的input显示与隐藏
        item.inputVisible = false,
        // 文本框输入的值
        item.inputValue = ''
      })
      // 获取到的数据 有动态参数 和 静态属性 把俩个数据分别保存到数据中  many动态参数
      if (this.activeName == 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 点击添加参数/添加属性 弹出对话框
    addDialogClose() {
      // 显示对话框
      this.paramsDialogVisible = true
    },
    // 点击添加参数/添加属性 对话框关闭 触发
    tabDialogClose() {
      // 重置表单
      this.$refs.tabFormRef.resetFields()
    },
    // 点击添加参数/添加属性 对话框 里面的确定
    addParams() {
      // 对dialog下的from表单进行验证
      this.$refs.tabFormRef.validate(async valid => {
        // 当 valid为false 验证不通过
        if (!valid) return this.$message.error('填写正确的表单内容')
        // 否则验证通过  发起添加参数请求  {} 内是表单请求体  attr_sel [only,many]
        const {data: res} = await this.$http.post(`categories/${this.categoriesId}/attributes`, {
          attr_name: this.tabForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res)
        if (res.meta.status !== 201 ) return this.$notify.error('获取修改参数失败')
        this.$message.success('修改动态参数或静态属性成功')
        this.paramsDialogVisible = false
        // 刷新tabs下的数据列表
        this.getParamsList()
      })
    },
    // 关闭编辑对话框 触发的事件
    editParamsDialogClose() {
      // 关闭对话框 重置表单
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击动态参数 编辑按钮
    async editParams(attr_id) {
      // 发起请求 根据id查询分类参数
      const {data: res} = await this.$http.get(`categories/${this.categoriesId}/attributes/${attr_id}`, {
        params: {attr_sel: this.activeName}
      })
      if (res.meta.status !== 200) return this.$message.info('获取动态参数失败')

      console.log(res)
      // 把数据添加到data中
      this.editParamsForm = res.data

      this.editParamsDialogVisible = true
      // 获取根据id查询到的数据
    },
    // 点击动态参数 编辑按钮 里面的确认按钮
    editParamsY() {
      // 1 进行表单预验证
      this.$refs.editParamsFormRef.validate(async valid => {
        // 如果valid是 false
        if(!valid)  return '进行正确的表单填写'
        // 验证完毕 发送提交信息参数请求  {} 内请求体
        const {data: res} = await this.$http.put(`categories/${this.categoriesId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName,
        })
        console.log(res)
        if( res.meta.status !== 200) return this.$message.error('编辑数据失败')
        this.$message.success('编辑数据成功')
        this.getParamsList()
        this.editParamsDialogVisible = false
      })
    },
    
    // 点击动态参数 删除按钮
    async RemoveEditParams(attr_id) {
      // 弹框 询问用户是否删除
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
      // 发送请求 进行删除用户信息
      const {data: res} = await this.$http.delete(`categories/${this.categoriesId}/attributes/${attr_id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除分类参数失败')
      }
      this.$message.success('删除分类参数成功')
      this.getParamsList()
      
    },
    // table表格里面的展开行 input输入框 按下enter键 失去焦点都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        // 输入内容
        row.inputValue = ''
        // 显示按钮
        row.inputVisible = false
        return
      }
      // 输入内容 除空格外 添加到attr_vals数组中
      row.attr_vals.push(row.inputValue.trim())
      // 添加输入内容后 重置输入内容
      row.inputValue = ''
      // 隐藏输入框
      row.inputVisible = false
      // 发起数据请求 把输入内容保存到数据库
      this.saveAttrVals(row)
    },
    // 点击button按钮 切换input输入框
    showInput(row) {
      // row. 解决输入数据 影响别的数据 
      row.inputVisible = true;
      // 点击input自动聚集焦点   页面上的数据重新渲染之后触发 $nextTick
      // 第一个$refs获取input组件 第二个$refs获取input组件上的dom元素
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击tag 删除按钮
    handleClose(index, row) {
      row.attr_vals.splice(row.attr_vals.indexOf(index), 1);
      // 把修改的数据保存到数据库中
      this.saveAttrVals(row)
    },
    // 发起请求   对tag标签内容 修改同步到数据库
    async saveAttrVals(row) {
      const {data: res} = await this.$http.put(`categories/${this.categoriesId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('添加输入内容失败')
      this.$notify.success('添加输入内容成功')
    }
  },

  computed: {
    // tabs 标签页里面的按钮是否被禁用 需要禁用返回true 否则返回false
    isBtnDisabled() {
      // 选中的级联选择器 不是三级
      if (this.selectCateKeys.length !== 3) {
        return true
      }
      // 是三级 就不禁用
      return false
    },
    // 当前选中的三级分类id
    categoriesId() {
      // 选中的是三级分类
      if (this.selectCateKeys.length === 3) {
        // 返回 选中的三级分类索引为2
        return this.selectCateKeys[2]
      }
      // 没有选中三级分类
      return null
      
    },
    // 点击添加参数/添加属性 按钮 显示对应的提示文字
    tabText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },

    
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 1rem;
}
.el-row {
  margin: 1rem  0;
}
span {
  margin-right: 1rem;
}
.btnCenter {
  margin: 1rem 0;
}
.btnBottom {
  margin-bottom: 1rem;
}
.input-new-tag {
  width: 100px;
}
</style>