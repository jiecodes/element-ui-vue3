<template>
  <!-- 用户管理 用户列表 -->
  <div class="users">
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
          <!-- 清空 请求数据  clearable 清空input内的数据   @clear="getUsers" 内置的清空方法 在重新请求数据 -->
          <el-input placeholder="请输入内容" v-model="paramsUser.query" clearable @clear="getUsers">
            <!-- 点击搜索数据 重新调用请求数据  根据后台携带的query参数查询 -->
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col> 
        <el-col :span="6">
          <el-button type="primary" @click="dialogTableVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table stripe border :data="infoUser" >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="名字" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <el-table-column label="状态" >
        <!-- 默认插槽  可以获取到infoUser里面的数据 -->
        <template slot-scope="scope">
          <!-- 开关  修改开关数据 并且修改数据库的数据-->
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            <!-- Tooltip 文字提示 -->
            <el-tooltip content="分配角色" placement="left" effect="light">
              <el-button type="info" icon="el-icon-setting" @click="setRoles(scope.row)" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 ¶Pagination  -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsUser.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="paramsUser.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
      
    <!-- 对话框(点击添加用户展示) close对话框关闭的回调 -->
    <el-dialog title="添加用户" @close="addDialogClose" :visible.sync="dialogTableVisible" width="40%">
      <!-- Form验证表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="4.6875rem" >
        <el-form-item label="用户" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>  
        <el-form-item label="密码" prop="password">
          <el-input  show-password v-model="addForm.password"></el-input>
        </el-form-item>  
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addForm.email"></el-input>
        </el-form-item>  
        <el-form-item label="手机" prop="mobile">
          <el-input  v-model="addForm.mobile"></el-input>
        </el-form-item>  
      </el-form>
      <span slot="footer" >
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框(点击操作里面的修改按钮 弹出对话框) -->
    <el-dialog @close="editFormClose" title="修改用户信息" :visible.sync="isShowEditDialog" width="60%" >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input> 
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input> 
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input> 
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框(点击操作里面的分配角色按钮 弹出对话框) -->
    <el-dialog title="分配角色" :visible.sync="setRolesDialogVisible" width="50%" >
      <div>
        <p>当前名字:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>分配的新角色列表:
          <!-- Select 选择器 -->
            <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
            </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
   


  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱的验证规则
    var checkEmail = (rule, value, cb) => {
      // 验证正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('输入合法邮箱'))
    }
    // 自定义手机号的验证规则
    var checkPhone = (rule, value, cb) => {
      const regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regPhone.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('输入合法手机号'))
    }
    return {
      // 请求用户列表数据 需要的参数(params)
      paramsUser: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 获取到的用户列表数据
      infoUser: [],
      // 一共有几条数据
      total: 0,
      // 是否显示对话框
      dialogTableVisible: false,
      // 是否显示 修改用户信息对话框
      isShowEditDialog: false,
      // 是否展示 删除个人信息对话框
      isDangerEditDialog: false,
      // 点击添加用户里面  添加的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 根据id查询到的用户信息 操作点击修改按钮 
      editForm: {},
      
      // 添加表单的验证规则  添加用户时 和el-form-item里面的props属性绑定
      addFormRules: {
        username: [
          { required: true, message: '输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 表单验证规则  修改用户个人信息时
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 点击 分配角色 显示对话框
      setRolesDialogVisible : false,
      // 点击 分配角色 里面的用户信息
      userInfo: '',
      // 点击 分配角色 角色列表数据
      rolesList: [],
      // 点击 分配角色 角色列表  select 绑定的数据
      selectedRoleId: ''
      
      
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 获取用户列表  表格数据
    async getUsers() {
      const {data: res} = await this.$http.get('users', {
        params: this.paramsUser
      }) 
      console.log(res)
      this.infoUser = res.data.users
      this.total = res.data.total 
      console.log(this.infoUser)
    },
    // 每页条数    2条/页
    handleSizeChange(newSize) {
      console.log(newSize + '每页条数')
      this.paramsUser.pagesize = newSize
      // 切换每页条数后 重新发起请求
      this.getUsers()
    },
    // 当前页       < 1 2 > 前往 1 页
    handleCurrentChange(newPage) {
      console.log(newPage + '有几页')
      this.paramsUser.pagenum = newPage
      // 切换有几页后 重新发起请求
      this.getUsers()
    },
    // 点击开关 修改数据库里的状态  重新发送修改数据请求   形参
    async userStateChange(infoUser) {
      console.log(infoUser)
      // 重新请求 修改用户状态的接口
      const { data : res} = await this.$http.put(`users/${infoUser.id}/state/${infoUser.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        // 用户修改状态失败 重新把状态取反,使页面状态没有变化
        infoUser.mg_state = !infoUser.mg_state
        return this.$alert('fdads')
      }
      this.$notify.info(res.meta.msg + '修改用户状态成功了')
    },

    // 点击添加用户 重置表单内容
    addDialogClose() {
      // 根据ref获取到form表单 元素
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户里面的确定 预验证form表单内容
    addUsers() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (valid == false) {
          return this.$notify.info('输入提示form表单内容')
        }
        // 输入表单内容正确 发起添加用户请求
        const {data: res} = await this.$http.post('users', this.addForm)
        console.log(res)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success(res.meta.msg + "成功了")
        // 隐藏添加用户对话框
        this.dialogTableVisible = false
        // 重新获取数据
        this.getUsers()
      })
    },

    // 点击操作里面的 修改按钮 修改个人信息
    async showEditDialog(id) {
      // 获取请求 根据id获取用户数据 展示在修改用户信息对话框
      const {data: res} = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.$notify.info(res.meta.msg + '成功')
      this.editForm = res.data
      console.log(this.editForm)
      console.log(this.infoUser)
      this.isShowEditDialog = true
    },
    // 监听用户对话框关闭 重置表单信息  修改用户个人信息时
    editFormClose() {
      // 重置表单信息
      this.$refs.editFormRef.resetFields()
    },
    // 点击操作修改按钮 确定 进行预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (valid == false) return this.$message.info('验证未通过')
        // this.$notify.success('验证通过')
        // 验证通过后 发起请求
        const {data: res} = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if( res.meta.status !== 200) return this.$message.error('获取修改用户信息失败')
        this.$notify.info(res.meta.msg)
        // 关闭操作修改 对话框
        this.isShowEditDialog = false
        // 重新获取列表数据
        this.editForm = res.data

        this.getUsers()
      })
    },

    // 点击操作里面的 删除按钮 根据id删除个人信息
    async removeUserById(id) {
      // 弹出对话框
      this.isDangerEditDialog = true
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
      this.$message.success('点击确认 删除成功了')
      // 发送请求 进行删除用户信息
      const {data: res} = await this.$http.delete('users/' + id)
      console.log(res)
      // 刷新用户列表
      this.getUsers()
      // 关闭 弹框
      this.isDangerEditDialog = false
    
    },
    // 点击分配角色 按钮
    async setRoles(userInfo) {
      this.userInfo = userInfo

      // 请求数据 展示对话框之前 获取角色列表
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200 ) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data

      this.setRolesDialogVisible = true
      console.log(userInfo)
    },
    // 点击分配角色 确定 添加新角色列表
    async saveRoleInfo() {
      const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid: this.selectedRoleId})
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户id失败')
      this.$notify.success('更新角色成功了')
      // 重新 更新列表数据
      this.getUsers()
      // 关闭分配角色对话框
      this.setRolesDialogVisible = false
    }

  }
}
</script>

<style scoped lang="scss"> 
.users {
  // font-size: 16px;
  .el-card {
    box-shadow: 0 0 9px 4px rgba(0,0,0,.3);
    margin-top: 1rem;
    .el-table {
      margin-top: 1.5rem;
      font-size: 14px;
      :nth-child(1) {
        text-align: center;
      }
    }
    .el-pagination {
      margin-top: 2rem;
    }
  }
}

</style>