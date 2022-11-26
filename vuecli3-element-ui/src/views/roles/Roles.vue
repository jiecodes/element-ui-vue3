<template>
  <!-- 权限管理 roles 角色列表 -->
  <div class="roles">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button class="buttonTop" type="primary">添加角色</el-button>
      <!-- 行 -->
      <el-row>
        <!-- 列 -->
        <el-col  >
          <!-- 表格 角色列表区域-->
          <el-table  :data="rolesList" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 美化标签 -->
                <!-- <pre>
                  {{scope.row}}
                </pre> -->
                <el-row :class="['center', 'borderBottom', index === 0 ? 'borderTop' : '']" v-for="(item,index) in scope.row.children" :key="item.id" closable >
                  <!-- 一级分类 -->
                  <el-col :span="5" >
                    <!-- tag 标签 -->
                    <el-tag @close="removeRightById(scope.row, item.id)" closable>{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二级和三级分类 -->
                  <el-col :span="19">
                    <el-row :class="[index1 === 0 ? '' : 'borderTop']"  v-for="(item1,index1) in item.children" :key="item1.id"  >
                      <el-col :span="6">
                        <el-tag @close="removeRightById(scope.row, item1.id)" closable type="success" >{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag type="warning" @close="removeRightById(scope.row, item2.id)" v-for="(item2,index2) in item1.children" :key="item2.id" closable >{{item2.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
              <!-- slot-scope="scope" 用插槽的形式获取 rolesList -->
              <template  slot-scope="scope">
                <el-button size="mini" icon="el-icon-edit" type="primary" >编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="success" >删除</el-button>
                <el-button size="mini" icon="el-icon-setting" type="info" @click="showSetRightDialog(scope.row)" >分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!-- 显示分配权限对话框 -->
    <el-dialog title="权限分配对话框" @close="setRightsDialogClose" :visible.sync="dialogVisibleRight" width="30%" >
      <!-- Tree 树形控件 data 绑定数据   props 用于父子间的嵌套(显示文本) -->
      <el-tree :data="rightsList" :props="treeProps" ref="treeRef" :default-checked-keys="defaultKeys" default-expand-all show-checkbox node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户列表数据
      rolesList: [],
      // 是否显示分配权限对话框 点击分配权限
      dialogVisibleRight : false,
      // tree树 权限列表数据
      rightsList: [],
      // tree树 用于父子间的嵌套
      treeProps: {
        // 显示的文本
        label: 'authName',
        // 父子嵌套的名字
        children: 'children',
      },
      // tree树 默认选中的节点id值数组
      defaultKeys: [],
      // 即将分配权限的id
      roleId: ''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取用户列表数据
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$notify.success('获取角色列表失败')
      }
      this.$message.info(res.meta.msg)
      this.rolesList = res.data
    },
    // 根据id删除权限 点击展开列 里面的每一个关闭 tag标签  role角色 id对应要删除的权限
    async removeRightById(role, rightId) {
      // 1 点击删除 先弹出提示框
      const confirmDetele = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err                   // cancel
      })
      if (confirmDetele !== 'confirm') {
        return this.$notify.success('取消了删除')
      }
      console.log(confirmDetele)      // confirm
      this.$message.info('点击了确认 打印' + confirmDetele)
      // 2 根据id 删除对应的角色
      const { data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.info('删除失败')
      this.$alert('删除成功了')
      // 重新刷新数据列表  用户体验不好 下面代码代替
      // this.getRolesList()
      // 刷新页面不关闭 tag标签页
      role.children = res.data
    },
    // 显示设置权限对话框(tree树形控件)  点击分配权限
    async showSetRightDialog(role) {

      this.roleId = role.id
      
      // 获取所有权限数据 
      const {data: res} = await this.$http.get('rights/tree') 
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightsList = res.data
      // 递归获取三级节点的id
      this.getDefaultKeys(role, this.defaultKeys)
      // 显示分配权限对话框
      this.dialogVisibleRight = true
    },
    // tree树 把tree树中的小括号勾选起来 通过递归的形式 获取角色下的所有三级权限的id 并保存到defaultKeys中
    // node用户判断是否是三级节点  arr保存到的数组中
    getDefaultKeys(node, arr) {
      // 如果 node.children node有children属性  说明node不是三级节点 然后取反
      if (!node.children) {
        // 是三级节点 把数据push到arr中
        return arr.push(node.id)
      }
      // 不是三级点击 使用递归处理
      node.children.forEach(item => 
        // 然后把item当成节点保存到arr中
      this.getDefaultKeys(item, arr)) 
      
    },
    // 关闭分配权限对话框 时触发
    setRightsDialogClose() {
      // 清空之前添加的权限id 不然会一直添加
      this.defaultKeys = []
    },
    // 点击分配权限 对话框里面的确定  添加角色的权限
    async allotRights() {
      // 获取半选和全选的引用
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      // 数组转换为字符串 使用join方法拼接
      const idString = keys.join(',')

      // 发起修改数据的请求
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idString})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取角色权限失败')
      this.$message.info(res.meta.msg)
      // 刷新列表
      this.getRolesList()
      // 关闭对话框
      this.dialogVisibleRight = false
    }


  },
}
</script>

<style scoped>
.el-card {
  margin-top: 1rem;
}
.buttonTop {
  margin-bottom: 2rem;
}

.center {
  display: flex;
  align-items: center;
}
.borderTop {
  border-top: 1px solid #eee;
  /* margin: .4rem 0; */
}
.borderBottom {
  border-bottom: 1px solid #eee;
  /* margin-top: .4rem; */
}
.el-tag {
  margin: .4rem;
}



</style>