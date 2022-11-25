<template>
  <!-- 登录页面 -->
  <div class="login">
    <!-- 居中的白色盒子 -->
    <div class="login_center">
    <!-- 头部图片 -->
      <div class="head">
        <img src="https://img2.baidu.com/it/u=2500875524,1917146970&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675" alt="">
      </div>
    <!-- 输入框  rules 添加验证规则 -->
    <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef" >
      <el-form-item label="" class="login_form_item"  prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu" class="login_input" autofocus >
        </el-input>
      </el-form-item>
      <el-form-item label="" class="login_form_item"  prop="password">
        <el-input v-model="loginForm.password" show-password prefix-icon="iconfont icon-mima" class="login_input"></el-input>
      </el-form-item>
      <el-form-item label="" class="login_btns">
        <el-button type="primary" @click="btnLogin">登录</el-button>
        <el-button type="info" @click="btnReset">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // form 表单验证
      // 1 form   :model="loginForm"  通过登录表单绑定数据 用于验证
      // 2 input  v-model="loginForm.username"  绑定到用于验证的项

      // 表单验证 
      // 1 form   :rules="rules" ref="loginForm" 
      // 2 form-itme  prop="username"

      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '输入名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
      
    }
  },
  methods: {
    // 重置
    btnReset() {
      // this 指定登录页面(login.vue) 实例对象
      console.log(this)
      // 根基this里面的属性取值   resetFields() form表单里面的方法(Form Methods)  
      this.$refs.loginFormRef.resetFields()
    },
    // 登录 表单预验证
    btnLogin() {
      // validate(Form Methods element-ui里面的方法) 用于验证规则是否正确 返回布尔值
      this.$refs.loginFormRef.validate(async value => {
        console.log(value)
        // value为false 直接return  value为true 发送请求
        if (!value) return;
        // 发起登录请求     login 登录请求路径  this.loginForm 请求参数   this.$http 在main.js中配置了请求
        // const data = this.$http.post('login', this.loginForm)
        // console.log(data)
        // 请求成功返回了 promsie 
        // 解构{data : res}   promise
        const {data : res} = await this.$http.post('login', this.loginForm)
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error('登录失败 没有这个用户')
        this.$message.success('登录成功 \n '  + ' 用户:' + this.loginForm.username + '密码:' + this.loginForm.password)
        // alert('登录失败 没有这个用户')
        // alert('登录成功 \n '  + ' 用户:' + this.loginForm.username + '密码:' + this.loginForm.password)

        // 1 登录成功后的token 保存到浏览器 sessionStorage(当前网页打开生效) 中  token保存到浏览器
        window.sessionStorage.setItem("token",res.data.token)
        // 2 通过编程式导航跳转到后台主页 路由地址path:'/home'
        this.$router.push('/home')


      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login {
    background-color: #2b4b6b;
    // 在App.vue中导入的css中 给html,body,#app高都设置高100%
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    .login_center {
      position: relative;
      width: 38%;
      height: 50%;
      background-color: #fff;
      .head {
        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: 50%;
        top: -25%;
        transform: translateX(-50%);

        width: 35%;
        height: 50%;
        border: 1px solid #666;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 10px #ddd;
        background: white;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
    .login_form {
      position: absolute;
      bottom: 2%;
      width: 100%;
      padding: 0 5%;
      .login_form_item {
        .login_input {
          
        }
      }
      .login_btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }


</style>