"use strict";(self["webpackChunkvuecli2_element_ui"]=self["webpackChunkvuecli2_element_ui"]||[]).push([[497],{8497:function(s,t,e){e.r(t),e.d(t,{default:function(){return m}});var i=function(){var s=this,t=s._self._c;return t("div",{staticClass:"login"},[t("div",{staticClass:"login_center"},[s._m(0),t("el-form",{ref:"loginFormRef",staticClass:"login_form",attrs:{model:s.loginForm,rules:s.rules}},[t("el-form-item",{staticClass:"login_form_item",attrs:{label:"",prop:"username"}},[t("el-input",{staticClass:"login_input",attrs:{"prefix-icon":"iconfont icon-denglu",autofocus:""},model:{value:s.loginForm.username,callback:function(t){s.$set(s.loginForm,"username",t)},expression:"loginForm.username"}})],1),t("el-form-item",{staticClass:"login_form_item",attrs:{label:"",prop:"password"}},[t("el-input",{staticClass:"login_input",attrs:{"show-password":"","prefix-icon":"iconfont icon-mima"},model:{value:s.loginForm.password,callback:function(t){s.$set(s.loginForm,"password",t)},expression:"loginForm.password"}})],1),t("el-form-item",{staticClass:"login_btns",attrs:{label:""}},[t("el-button",{attrs:{type:"primary"},on:{click:s.btnLogin}},[s._v("登录")]),t("el-button",{attrs:{type:"info"},on:{click:s.btnReset}},[s._v("重置")])],1)],1)],1)])},r=[function(){var s=this,t=s._self._c;return t("div",{staticClass:"head"},[t("img",{attrs:{src:"https://img2.baidu.com/it/u=2500875524,1917146970&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675",alt:""}})])}],o=(e(7658),{name:"login",data(){return{loginForm:{username:"admin",password:"123456"},rules:{username:[{required:!0,message:"输入名称",trigger:"blur"},{min:2,max:5,message:"长度在 2 到 5 个字符",trigger:"blur"}],password:[{required:!0,message:"输入密码",trigger:"blur"},{min:6,max:15,message:"长度在 6 到 15 个字符",trigger:"blur"}]}}},methods:{btnReset(){this.$refs.loginFormRef.resetFields()},btnLogin(){this.$refs.loginFormRef.validate((async s=>{if(!s)return;const{data:t}=await this.$http.post("login",this.loginForm);if(200!==t.meta.status)return this.$message.error("登录失败 没有这个用户");this.$message.success("登录成功 \n  用户:"+this.loginForm.username+"密码:"+this.loginForm.password),window.sessionStorage.setItem("token",t.data.token),this.$router.push("/home")}))}}}),n=o,a=e(1001),l=(0,a.Z)(n,i,r,!1,null,"17986309",null),m=l.exports}}]);
//# sourceMappingURL=497.a87c32b7.js.map