<template>
  <div id="app">
    <!-- 路由占位符  配置完router index.js的path后 在这个页面使用占位符 -->
    <router-view></router-view>
  </div>
</template>
<script>

export default ({
  name: 'app',
  data() {
    return {

    }
  },
})
</script>


<style scoped>
  /* 基础css和公共css */
  @import url(./assets/css/common/base.css);

  /* 阿里图标 */
  @import url(//at.alicdn.com/t/c/font_3767706_ldwytyv4cz.css);

  /* 本项目 全局样式 */
  @import url(./assets/css/common/global.css);


  
</style>
