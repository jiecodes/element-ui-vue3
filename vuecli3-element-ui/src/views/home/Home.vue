<template>
  <!-- 首页 -->

  <!-- container 布局容器 -->
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="name">
        <img src="@/assets/image/home.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- container 布局容器 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="aside_top" @click="topToggle">|||</div>
        <!-- 侧边栏 菜单   unique-opened只允许展开一个 router开启组件内置的路由跳转,以el-menu-item里面的index的值跳转 default-active实现点击哪个二级菜单高亮 collapse 折叠菜单 属性前加:(动态数据绑定)保证是布尔值 -->
        <el-menu  unique-opened router :default-active="activePath" :collapse="isCollapse" :collapse-transition="false" background-color="#2e333e" text-color="#fff" active-text-color="#00BFFF">
          <!-- 一级分类  有下箭头的  index="1" 接收字符串(展开相同index的菜单)    数值(1) + ' '(空字符串) = 字符串 -->
          <el-submenu :index="item.id + ''" v-for="(item, index) in MenuList" :key="index">
            <!-- 一级分类内容-->
            <template slot="title">
              <i :class="iconsObj[index]" id="icons"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 没有下箭头--> 
            <el-menu-item @click="saveNavState(item1.path)" :index="item1.path" v-for="(item1, index1) in item.children" :key="index1">
              <!-- 二级分类内容-->
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      MenuList: [],
      // 字体图标
      iconsObj: {
        '0': 'iconfont icon-yonghuguanli',
        '1': 'iconfont icon-quanxianguanli',
        '2': 'iconfont icon-shangpinguanli',
        '3': 'iconfont icon-ddguanli',
        '4': 'iconfont icon-shujutongji',
        // '125': 'iconfont icon-yonghuguanli',
        // '103': 'iconfont icon-quanxianguanli',
        // '102': 'iconfont icon-shangpinguanli',
        // '101': 'iconfont icon-ddguanli',
        // '145': 'iconfont icon-shujutongji',
      },
      // 是否折叠菜单
      isCollapse: false,
      // 点击二级菜单高亮  保存点击的链接
      activePath: ''
    }
  },
  created() {
    // 获取左侧菜单数据
    this.getMenuList()
    // 进入页面 使二级菜单用户列表 高亮     获取浏览器保存的activePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击 退出页面home 清除token
    loginOut() {
      // 1 清除 浏览器内存的 token值
      window.sessionStorage.clear()
      // 2 清除后 跳转到登录页
      this.$router.push('/login')
    },
    // 左侧菜单数据
    async getMenuList() {
      const res = await this.$http.get('menus')
      console.log(res)
      if (res.data.meta.status !== 200) return this.$message.error('获取左侧数据失败' + res.data.meta.msg)
      // this.$alert('获取左侧数据成功')
      this.$notify.success('获取左侧数据成功 \n ' +  res.data.meta.msg)
      // this.$message.success('获取左侧数据成功')

      this.MenuList = res.data.data
      console.log(this.MenuList)
    },
    // 切换菜单的展开
    topToggle() {
      this.isCollapse = !this.isCollapse
    },
    // 点击二级菜单 显示高亮   一级菜单属性default-active
    saveNavState(activePath) {
      // 保存到浏览器内存中
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang='scss'>
.home_container {
  height: 100%;

  /* 头部 */
  .el-header {
    background-color: rgb(46,52,55);
    display: flex;
    justify-content: space-between;
    padding: 0 2% 0 0;
    align-items: center;
    .name {
      font-size: 30px;
      img {
        width: 10%;
        border-radius: 50%;
        padding: 1.3%;
      }
    }
    .el-button {
    }
  }
  /* 左侧 侧边栏 */
  .el-aside {
    background-color: rgb(46,51,62);
    color: white;
    .aside_top {
      width: 100%;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background-color: rgb(65,74,91);
      letter-spacing: .3rem;
      cursor: pointer;
    }
    // 修改默认值 
    .el-menu {
      border-right: none;
      .el-submenu__title {
        padding: 0;
      }
    }
    .iconfont {
      padding-right: 13px;
      color: hotpink;
    }
}
  /* 右侧主体 */
  .el-main {
    background-color: rgb(218,222,226);

  }

}

</style>