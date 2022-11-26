"use strict";(self["webpackChunkvuecli2_element_ui"]=self["webpackChunkvuecli2_element_ui"]||[]).push([[585],{8585:function(t,e,a){a.r(e),a.d(e,{default:function(){return u}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"params"},[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),e("el-breadcrumb-item",[t._v("商品管理")]),e("el-breadcrumb-item",[t._v("商品列表")])],1),e("el-card",[e("el-alert",{attrs:{title:"注意:只允许为第三级分类设置相关参数",type:"warning","show-icon":"",closable:!1}}),e("el-row",[e("el-col",{attrs:{span:24}},[e("span",[t._v("选择商品分类")]),e("el-cascader",{attrs:{options:t.categoriesList,props:{...t.categoriesProps,expandTrigger:"hover"}},on:{change:t.CategoriesHandleChange},model:{value:t.selectCateKeys,callback:function(e){t.selectCateKeys=e},expression:"selectCateKeys"}})],1)],1),e("el-button",{staticClass:"btnCenter",attrs:{type:"primary"}},[t._v("添加参数")]),e("el-tabs",{on:{"tab-click":t.handleTabsClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[e("el-tab-pane",{attrs:{label:"动态参数",name:"many"}},[e("el-button",{staticClass:"btnBottom",attrs:{disabled:t.isBtnDisabled,type:"primary"},on:{click:t.addDialogClose}},[t._v("添加参数")]),e("el-table",{attrs:{data:t.manyTabData,stripe:"",border:""}},[e("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._l(a.row.attr_vals,(function(s,i){return e("el-tag",{key:i,attrs:{type:"success",closable:""},on:{close:function(e){return t.handleClose(i,a.row)}}},[t._v(t._s(s))])})),a.row.inputVisible?e("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:function(e){return t.handleInputConfirm(a.row)}},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleInputConfirm(a.row)}},model:{value:a.row.inputValue,callback:function(e){t.$set(a.row,"inputValue",e)},expression:"scope.row.inputValue"}}):e("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:function(e){return t.showInput(a.row)}}},[t._v("+ New Tag")])]}}])}),e("el-table-column",{attrs:{label:"#",type:"index"}}),e("el-table-column",{attrs:{label:"参数名称",prop:"attr_name"}}),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:function(e){return t.editParams(a.row.attr_id)}}},[t._v("编辑")]),e("el-button",{attrs:{type:"danger",size:"mini",icon:"el-icon-delete"},on:{click:function(e){return t.RemoveEditParams(a.row.attr_id)}}},[t._v("删除")])]}}])})],1)],1),e("el-tab-pane",{attrs:{label:"静态属性",name:"only"}},[e("el-button",{staticClass:"btnBottom",attrs:{disabled:t.isBtnDisabled,type:"primary"},on:{click:t.addDialogClose}},[t._v("添加属性")]),e("el-table",{attrs:{data:t.onlyTabData,stripe:"",border:""}},[e("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._l(a.row.attr_vals,(function(s,i){return e("el-tag",{key:i,attrs:{type:"success",closable:""},on:{close:function(e){return t.handleClose(i,a.row)}}},[t._v(t._s(s))])})),a.row.inputVisible?e("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:function(e){return t.handleInputConfirm(a.row)}},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleInputConfirm(a.row)}},model:{value:a.row.inputValue,callback:function(e){t.$set(a.row,"inputValue",e)},expression:"scope.row.inputValue"}}):e("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:function(e){return t.showInput(a.row)}}},[t._v("+ New Tag")])]}}])}),e("el-table-column",{attrs:{label:"#",type:"index"}}),e("el-table-column",{attrs:{label:"参数名称",prop:"attr_name"}}),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:function(e){return t.editParams(a.row.attr_id)}}},[t._v("编辑")]),e("el-button",{attrs:{type:"danger",size:"mini",icon:"el-icon-delete"},on:{click:function(e){return t.RemoveEditParams(a.row.attr_id)}}},[t._v("删除")])]}}])})],1)],1)],1),e("el-dialog",{attrs:{title:"添加 "+t.tabText,visible:t.paramsDialogVisible,width:"30%"},on:{"update:visible":function(e){t.paramsDialogVisible=e},close:t.tabDialogClose}},[e("el-form",{ref:"tabFormRef",attrs:{model:t.tabForm,rules:t.tabRules,"label-width":"100px"}},[e("el-form-item",{attrs:{label:"活动名称",prop:"attr_name"}},[e("el-input",{model:{value:t.tabForm.attr_name,callback:function(e){t.$set(t.tabForm,"attr_name",e)},expression:"tabForm.attr_name"}})],1)],1),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.paramsDialogVisible=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.addParams}},[t._v("确 定")])],1)],1),e("el-dialog",{attrs:{title:"修改动态参数",visible:t.editParamsDialogVisible,width:"30%"},on:{"update:visible":function(e){t.editParamsDialogVisible=e},close:t.editParamsDialogClose}},[e("el-form",{ref:"editParamsFormRef",attrs:{model:t.editParamsForm,rules:t.editParamsRules,"label-width":"100px"}},[e("el-form-item",{attrs:{label:"活动名称",prop:"attr_name"}},[e("el-input",{model:{value:t.editParamsForm.attr_name,callback:function(e){t.$set(t.editParamsForm,"attr_name",e)},expression:"editParamsForm.attr_name"}})],1)],1),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.editParamsDialogVisible=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.editParamsY}},[t._v("确 定")])],1)],1)],1)],1)},i=[],r=(a(7658),{data(){return{categoriesList:[],categoriesProps:{value:"cat_id",label:"cat_name",children:"children"},selectCateKeys:[],activeName:"many",manyTabData:[],onlyTabData:[],paramsDialogVisible:!1,tabRules:{attr_name:[{required:!0,message:"请输入活动名称",trigger:"blur"},{min:3,max:5,message:"长度在 3 到 5 个字符",trigger:"blur"}]},tabForm:{attr_name:""},editParamsDialogVisible:!1,editParamsForm:{attr_name:""},editParamsRules:{attr_name:[{required:!0,message:"请输入活动名称",trigger:"blur"},{min:3,max:5,message:"长度在 3 到 5 个字符",trigger:"blur"}]},inputVisible:!1,inputValue:""}},created(){this.getCategoriesList()},methods:{async getCategoriesList(){const{data:t}=await this.$http.get("categories");if(200!==t.meta.status)return this.$message.error("获取商品分类列表数据失败");this.$message.info(t.meta.msg+"  cascader级联选择器 商品分类列表数据 101"),this.categoriesList=t.data},CategoriesHandleChange(){this.getParamsList()},handleTabsClick(){this.getParamsList()},async getParamsList(){if(3!==this.selectCateKeys.length)return this.manyTabData=[],void(this.onlyTabData=[]);const{data:t}=await this.$http.get(`categories/${this.categoriesId}/attributes`,{params:{sel:this.activeName}});if(200!==t.meta.status)return this.$message.info("获取分类参数列表失败");t.data.forEach((t=>{t.attr_vals=t.attr_vals?t.attr_vals.split(" "):[],t.inputVisible=!1,t.inputValue=""})),"many"==this.activeName?this.manyTabData=t.data:this.onlyTabData=t.data},addDialogClose(){this.paramsDialogVisible=!0},tabDialogClose(){this.$refs.tabFormRef.resetFields()},addParams(){this.$refs.tabFormRef.validate((async t=>{if(!t)return this.$message.error("填写正确的表单内容");const{data:e}=await this.$http.post(`categories/${this.categoriesId}/attributes`,{attr_name:this.tabForm.attr_name,attr_sel:this.activeName});if(201!==e.meta.status)return this.$notify.error("获取修改参数失败");this.$message.success("修改动态参数或静态属性成功"),this.paramsDialogVisible=!1,this.getParamsList()}))},editParamsDialogClose(){this.$refs.editParamsFormRef.resetFields()},async editParams(t){const{data:e}=await this.$http.get(`categories/${this.categoriesId}/attributes/${t}`,{params:{attr_sel:this.activeName}});if(200!==e.meta.status)return this.$message.info("获取动态参数失败");this.editParamsForm=e.data,this.editParamsDialogVisible=!0},editParamsY(){this.$refs.editParamsFormRef.validate((async t=>{if(!t)return"进行正确的表单填写";const{data:e}=await this.$http.put(`categories/${this.categoriesId}/attributes/${this.editParamsForm.attr_id}`,{attr_name:this.editParamsForm.attr_name,attr_sel:this.activeName});if(200!==e.meta.status)return this.$message.error("编辑数据失败");this.$message.success("编辑数据成功"),this.getParamsList(),this.editParamsDialogVisible=!1}))},async RemoveEditParams(t){const e=await this.$confirm("此操作将永久删除该文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((t=>t));if("confirm"!==e)return this.$notify.info("点击了取消");const{data:a}=await this.$http.delete(`categories/${this.categoriesId}/attributes/${t}`);200!==a.meta.status&&this.$message.error("删除分类参数失败"),this.$message.success("删除分类参数成功"),this.getParamsList()},async handleInputConfirm(t){if(0===t.inputValue.trim().length)return t.inputValue="",void(t.inputVisible=!1);t.attr_vals.push(t.inputValue.trim()),t.inputValue="",t.inputVisible=!1,this.saveAttrVals(t)},showInput(t){t.inputVisible=!0,this.$nextTick((t=>{this.$refs.saveTagInput.$refs.input.focus()}))},handleClose(t,e){e.attr_vals.splice(e.attr_vals.indexOf(t),1),this.saveAttrVals(e)},async saveAttrVals(t){const{data:e}=await this.$http.put(`categories/${this.categoriesId}/attributes/${t.attr_id}`,{attr_name:t.attr_name,attr_sel:t.attr_sel,attr_vals:t.attr_vals.join(" ")});if(200!==e.meta.status)return this.$message.error("添加输入内容失败");this.$notify.success("添加输入内容成功")}},computed:{isBtnDisabled(){return 3!==this.selectCateKeys.length},categoriesId(){return 3===this.selectCateKeys.length?this.selectCateKeys[2]:null},tabText(){return"many"===this.activeName?"动态参数":"静态属性"}}}),l=r,n=a(1001),o=(0,n.Z)(l,s,i,!1,null,"4a6f7eac",null),u=o.exports}}]);
//# sourceMappingURL=585.f9743aeb.js.map