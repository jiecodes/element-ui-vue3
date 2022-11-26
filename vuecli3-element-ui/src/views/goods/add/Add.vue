<template>
  <!-- 添加 商品分类参数 -->
  <div class="add">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>添加管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告  -->
      <el-alert  title="添加商品信息" type="info" center show-icon :closable='false' > </el-alert>
      <!-- 步骤条  active指定激活项    字符串-0隐式转换为数字  -->
      <el-steps :space="200"  :active="activeIndex - 0" finish-status="success" align-center >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form 表单  label-position="top" 文字在文本框上面  -->
      <el-form :model="AddGoodsForm" :rules="AddGoodsRules" ref="AddGoodsRef" label-position="top" label-width="100px" >
        <!-- Tabs 标签页  before-leave 标签页切换触发  name作用是连接步骤条 绑定v-model实现和active绑定  -->
        <el-tabs :before-leave="beforeTabLeave" v-model="activeIndex" tab-position="left" @tab-click="tabClicked" >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <!-- v-model input输入框显示的值 -->
              <el-input v-model="AddGoodsForm.goods_name" placeholder="输入商品名称"></el-input>
            </el-form-item>
            <!-- type="number"  规定只能输入数字 -->
            <el-form-item label="商品价格" prop="goods_price" >
              <el-input v-model="AddGoodsForm.goods_price" placeholder="输入商品名称" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" >
              <el-input v-model="AddGoodsForm.goods_weight" placeholder="输入商品名称" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" >
              <el-input v-model="AddGoodsForm.goods_number" placeholder="输入商品名称" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- cascader 级联选择器  v-model双向绑定的数组   options数据源  props级联选择器配置对象  change 级联选择器 选中项发生变化会触发  -->
              <el-cascader
                v-model="AddGoodsForm.goods_cat"
                :options="categoriesList"
                :props="{ ...categoriesProps,expandTrigger: 'hover' }"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item, index) in manyTabsData" :key="index" closable >{{item.attr_name}}
              <!-- Checkbox 多选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,index1) in item.attr_vals" :key="index1" border ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item, index) in onlyTabsData" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- Upload 上传   action 图片要上传到的api地址后台地址   on-preview可以监听预览图片  on-remove移除图片触发的事件  list-type显示方式   headerObj设置请求头 没有这个请求头就不会发起网络请求(axois) 报错没有token   on-success上传图片成功就会调用这个函数 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess" >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 导入第三方插件 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="AddGoodsForm.goods_introduce"
            ></quill-editor>
            <el-button @click="add" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="30%" >
      <img class="previewImg" :src="previewPath" alt="">
    </el-dialog>

  </div>
</template>

<script>
// 导入 深拷贝需要的包 lodash
import _ from 'lodash'
export default {
  data() {
    return {  
      // 步骤条 默认激活项
      activeIndex: '0',
      // form表单 绑定的数据 添加商品表单数据对象
      AddGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 有几级分类列表
        goods_cat: [],
        // 图片空数组 upload图片上传到这里
        pics: [],
        // 用于添加商品 里面只有attr_id和attr_vals属性
        attrs: [],
      },
      // form表单验证规则
      AddGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 获取到的  商品分类数据
      categoriesList: [],
      // props级联选择器配置对象
      categoriesProps: {
        // 看到的每一个属性
        label: 'cat_name',
        // 选中的是哪一个
        value: 'cat_id',
        // 父子节点嵌套
        children: 'children'
      },

      // 点击商品参数 获取到的分类参数列表数据 动态参数
      manyTabsData: [],
      // 获取商品属性数据
      onlyTabsData: [],

      // 图片上传组件的headers请求头对象 没有这个请求头就不会发起网络请求(axois) 报错没有token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片进行预览
      previewPath: '', 
      // 是否显示 图片预览对话框
      previewVisible: false,
      // 导入插件富文本 数据绑定 商品详情
      goods_introduce: '',
    }
  },
  created() {
    // 获取分类列表数据
    this.getCategoriesList()
  },
  methods: {
    // 获取分类列表数据
    async getCategoriesList() {
      const {data: res} = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.$message.info('获取商品列表成功')
      this.categoriesList = res.data
    },
    // 级联选择器 选中项发生变化会触发
    handleChange() {
      console.log(this.AddGoodsForm.goods_cat + ' 商品分类有几级')
      // 只能选中三级分类 不能选中一级二级    
      if (this.AddGoodsForm.goods_cat.length !== 3) {
        // 不是三级分类 就给显示的数据清空
        this.AddGoodsForm.goods_cat = []
      } 
    },
    // tabs 标签页切换触发
    beforeTabLeave(activeName, oldActiveName) {
      console.log(activeName + '即将进入的标签页')
      console.log(oldActiveName + '离开的的标签页')
      // 阻止切换的条件       &&并且
      if (oldActiveName === '0' && this.AddGoodsForm.goods_cat.length !== 3) {
        // 提示用户
        this.$notify.info('请先填写三级分类 级联选择框')
        // 阻止切换
        return false
      }
    },
    // tabs tabs左侧标签页 被点击哪个了  @tab-click
     tabClicked() {
      console.log(this.activeIndex + '点击左侧tabs  当前激活项index')
      // 如果选中的是 index为1的tabs标签页 发起请求获取数据
      if (this.activeIndex === '1') {
        this.getCategoriesParamsList('many')
        // === '2' 表示 tabs标签页选中的是 商品属性页
      } else if (this.activeIndex === '2') {
        this.getCategoriesParamsList('only')
      //   const {data: res} = await this.$http.get(`categories/${this.categoriesId}/attributes`, {
      //   // 后面的sel 为'many'获取的是商品参数  为'only'获取的是商品属性
      //   params: {sel: 'only'}
      // })
      // console.log(res)
      } else if (this.activeIndex === '3') {
        
      }
    },
    // 获取 分类参数列表  sel(形参)接收tabClicked传递过来的数据     goods_cat[2] 三级分类的索引项为2
    async getCategoriesParamsList(sel) {
      // this.AddGoodsForm.goods_cat[2] 将这个定义为计算属性
      // const {data: res} = await this.$http.get(`categories/${this.AddGoodsForm.goods_cat[2]}/attributes`, {
      const {data: res} = await this.$http.get(`categories/${this.categoriesId}/attributes`, {
        // 后面的sel 为'many'获取的是商品参数  为'only'获取的是商品属性
        params: {sel: sel}
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取分类参数列表失败')
      this.$message.success('获取分类参数列表成功了')
      // 一个请求链接 不同的sel参数  请求到的数据就不同
      if (sel === 'many') {
        res.data.forEach(item => {
        // split分隔字符串成数组   把res.data.attr_vals字符串转换为数组
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
        this.manyTabsData = res.data
      } else {
        this.onlyTabsData = res.data
      }

    },

    // 可以监听预览图片
    handlePreview(file) {
      // 预览图片信息
      console.log(file)
      // 把预览图片的路径 给data中定义的 previewPath
      this.previewPath = file.response.data.url
      // 显示对话框
      this.previewVisible = true
    },
    // 移除图片触发的事件
    handleRemove(file) {
      // 将要被移除的图片信息
      console.log(file)
      // 1 获取删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2 在pics数组中 找到这个图片的索引值
      const index = this.AddGoodsForm.pics.findIndex( item => {
        // pics里面的每一项pic 与 filePath值相等 返回相等值的索引
        item.pic === filePath
      })
      // 3 数组splice方法 把图片信息移除
      this.AddGoodsForm.pics.splice(index, 1)

    },
    // 监听图片上传成功的事件(提交到服务器)   response 服务器返回的数据
    handleSuccess(response) {
      console.log(response)
      // 1 拼接图片信息对象 临时上传路径
      const picInfo = {
        pic: response.data.tmp_path
       }
      // 2 把图片信息对象 push到 form表单绑定的数据中
      this.AddGoodsForm.pics.push(picInfo)
      //  上传图片(pic)后 的form表单对象
      console.log(this.AddGoodsForm)
    },

    // 点击富文本编辑器 下面的添加商品按钮
    add() {
      // 进行表单预验证
      this.$refs.AddGoodsRef.validate(async valid => {
        if (!valid) return this.$notify.error('填写正确的表单内容')
        // 发起请求前 请求体里面的 goods_cat需要的字符串 而data中定义的是数组 用join方法数组转换为字符串 
        // 转换后执行会报错 因为在级联选择器中 绑定数据绑定了goods_cat,级联选择器需要数组 不然报错  
        // 解决: 把this.AddGoodsForm.goods_cat进行深拷贝 lodash cloneDeep(obj)     不会影响级联选择器的数据 
        const newAddGoodsForm = _.cloneDeep(this.AddGoodsForm)
        // 深拷贝另一种方式
        // const newAddGoodsForm = JSON.parse(JSON.stringify(this.AddGoodsForm))
        // 数组转字符串
        newAddGoodsForm.goods_cat = newAddGoodsForm.goods_cat.join(',')
        // 处理动态参数  拿到原数组(manyTabsData)的俩个属性 attr_id attr_vals给一个属性attrs
        this.manyTabsData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            // 数组转换为字符串 以空格分隔
            attr_value: item.attr_vals.join(' ')
          }
          this.AddGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabsData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.AddGoodsForm.attrs.push(newInfo)
        })
        // 把拿到的俩个属性的数组attrs 赋值 深拷贝的数组
        newAddGoodsForm.attrs = this.AddGoodsForm.attrs
        // 发起请求的参数  深拷贝 数组转字符串结果 
        console.log(newAddGoodsForm)
        // 通过预验证 发起表单服务器请求
        const {data: res} = await this.$http.post('goods', newAddGoodsForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$alert('添加商品失败了')
        this.$message.success('添加商品成功了')
        // 添加成功后 跳转到商品列表页面
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    categoriesId() {
      if (this.AddGoodsForm.goods_cat.length === 3) {
        // goods_cat[2] 三级分类的索引项为2
        return this.AddGoodsForm.goods_cat[2]
      }
      // 级联选择器不是选中的三级 执行下面的
      return null
    }
  },
}
</script>

<style scoped>
.el-card,
.el-steps,
.el-tabs {
  margin-top: 1rem;
}
.el-checkbox {
  margin: 0 1rem 0 0 !important;
}
.previewImg {
  width: 100%;
  height: 100%;
}
.el-button {
  margin-top: 1rem;
}


</style>