"use strict";(self["webpackChunkvuecli2_element_ui"]=self["webpackChunkvuecli2_element_ui"]||[]).push([[976],{4976:function(t,e,s){s.r(e),s.d(e,{default:function(){return c}});var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"roles"},[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),e("el-breadcrumb-item",[t._v("角色管理")]),e("el-breadcrumb-item",[t._v("角色列表")])],1),e("el-card",[e("el-button",{staticClass:"buttonTop",attrs:{type:"primary"}},[t._v("添加角色")]),e("el-row",[e("el-col",[e("el-table",{attrs:{data:t.rolesList,stripe:"",border:""}},[e("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(s){return t._l(s.row.children,(function(i,a){return e("el-row",{key:i.id,class:["center","borderBottom",0===a?"borderTop":""],attrs:{closable:""}},[e("el-col",{attrs:{span:5}},[e("el-tag",{attrs:{closable:""},on:{close:function(e){return t.removeRightById(s.row,i.id)}}},[t._v(t._s(i.authName))]),e("i",{staticClass:"el-icon-caret-right"})],1),e("el-col",{attrs:{span:19}},t._l(i.children,(function(i,a){return e("el-row",{key:i.id,class:[0===a?"":"borderTop"]},[e("el-col",{attrs:{span:6}},[e("el-tag",{attrs:{closable:"",type:"success"},on:{close:function(e){return t.removeRightById(s.row,i.id)}}},[t._v(t._s(i.authName))]),e("i",{staticClass:"el-icon-caret-right"})],1),e("el-col",{attrs:{span:18}},t._l(i.children,(function(i,a){return e("el-tag",{key:i.id,attrs:{type:"warning",closable:""},on:{close:function(e){return t.removeRightById(s.row,i.id)}}},[t._v(t._s(i.authName))])})),1)],1)})),1)],1)}))}}])}),e("el-table-column",{attrs:{type:"index",label:"#"}}),e("el-table-column",{attrs:{label:"角色名称",prop:"roleName"}}),e("el-table-column",{attrs:{label:"角色描述",prop:"roleDesc"}}),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-button",{attrs:{size:"mini",icon:"el-icon-edit",type:"primary"}},[t._v("编辑")]),e("el-button",{attrs:{size:"mini",icon:"el-icon-delete",type:"success"}},[t._v("删除")]),e("el-button",{attrs:{size:"mini",icon:"el-icon-setting",type:"info"},on:{click:function(e){return t.showSetRightDialog(s.row)}}},[t._v("分配权限")])]}}])})],1)],1)],1)],1),e("el-dialog",{attrs:{title:"权限分配对话框",visible:t.dialogVisibleRight,width:"30%"},on:{close:t.setRightsDialogClose,"update:visible":function(e){t.dialogVisibleRight=e}}},[e("el-tree",{ref:"treeRef",attrs:{data:t.rightsList,props:t.treeProps,"default-checked-keys":t.defaultKeys,"default-expand-all":"","show-checkbox":"","node-key":"id"}}),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.dialogVisibleRight=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.allotRights}},[t._v("确 定")])],1)],1)],1)},a=[],l=(s(7658),{data(){return{rolesList:[],dialogVisibleRight:!1,rightsList:[],treeProps:{label:"authName",children:"children"},defaultKeys:[],roleId:""}},created(){this.getRolesList()},methods:{async getRolesList(){const{data:t}=await this.$http.get("roles");if(200!==t.meta.status)return this.$notify.success("获取角色列表失败");this.$message.info(t.meta.msg),this.rolesList=t.data},async removeRightById(t,e){const s=await this.$confirm("此操作将永久删除该文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((t=>t));if("confirm"!==s)return this.$notify.success("取消了删除");this.$message.info("点击了确认 打印"+s);const{data:i}=await this.$http.delete(`roles/${t.id}/rights/${e}`);if(200!==i.meta.status)return this.$message.info("删除失败");this.$alert("删除成功了"),t.children=i.data},async showSetRightDialog(t){this.roleId=t.id;const{data:e}=await this.$http.get("rights/tree");if(200!==e.meta.status)return this.$message.error("获取权限失败");this.rightsList=e.data,this.getDefaultKeys(t,this.defaultKeys),this.dialogVisibleRight=!0},getDefaultKeys(t,e){if(!t.children)return e.push(t.id);t.children.forEach((t=>this.getDefaultKeys(t,e)))},setRightsDialogClose(){this.defaultKeys=[]},async allotRights(){const t=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()],e=t.join(","),{data:s}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:e});if(200!==s.meta.status)return this.$message.error("获取角色权限失败");this.$message.info(s.meta.msg),this.getRolesList(),this.dialogVisibleRight=!1}}}),r=l,o=s(1001),n=(0,o.Z)(r,i,a,!1,null,"39deb78a",null),c=n.exports}}]);
//# sourceMappingURL=976.8037701a.js.map