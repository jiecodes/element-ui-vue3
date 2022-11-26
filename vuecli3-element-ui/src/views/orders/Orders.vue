<template>
  <!-- 订单管理 订单列表 -->
  <div class="orders">
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 行 -->
      <el-row>
        <!-- 每一行占几份 -->
        <el-col :span="10">
          <!-- 输入框 -->
          <el-input placeholder="请输入内容" v-model="inputData">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="ordersList"  stripe border >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="260px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == '0'">未付款</el-tag>
            <el-tag type="danger" v-else="scope.row.pay_status == '1'">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="showEditDialog" type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button @click="showLocationDialog" type="success" size="mini" icon="el-icon-location-outline"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- Pagination 分页 -->
      <!-- handleSizeChange 每页有几条数据发生变化触发  pagesize
      handleCurrentChange 当前页码值发生变化触发   pagenum 
      current-page 当前第几页
      page-size 每页有多少条数据 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="ordersInfo.pagenum"
      :page-sizes="[5, 10, 15, 30]"
      :page-size="ordersInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 点击操作里面的修改按钮 弹出对话框 -->
    <el-dialog title="提示" :visible.sync="EditDialogVisible" @close="EidtDialogClose" width="30%">
      <!-- form表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address">
          <!-- Cascader 级联选择器      options 数据源 -->
          <el-cascader
            v-model="editForm.address"
            :options="cityData"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="DetailedAddress">
          <el-input v-model="editForm.DetailedAddress"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="locationDialogVisible" width="30%">
      <!-- Timeline 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :icon="item.icon"
          :type="item.type"
          :color="item.color"
          :size="item.size"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="locationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 1 导入citydata.js 文件  中国所有的城市信息
import cityData from '@/common/citydata.js'


export default {
  data() {
    return {
      // 2 使用导入的 citydata.js
      cityData: cityData,

      // 订单列表数据
      ordersList: [],
      // input输入框 双向绑定的数据
      inputData: '',
      // 订单内容 查询条件
      ordersInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页有几条
        pagesize: 10,
      },
      // 获取订单列表总页数
      total: 0, 

      // 点击操作里面的编辑按钮 是否展示对话框
      EditDialogVisible: false,
      // 展示编辑对话框 绑定的数据对象  :model   v-model
      editForm: {
        // 省市区/县
        address: [],
        // 详细地址
        DetailedAddress: '',
      },
      // 展示编辑对话框 验证规则  prop绑定的
      editFormRules: {
        address: [
           { required: true, message: '请输入省市区/县', trigger: 'blur' },
        ],
        DetailedAddress: [
           { required: true, message: '请输入详细地址', trigger: 'blur' },
        ]
      },

      // 点击操作里面的定位按钮 是否展示物流对话框
      locationDialogVisible: false,
      // 物流信息
      progressInfo: [],
    }
  },
  created() {
    // 获取订单列表数据
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表数据
    async getOrdersList() {
      const {data: res} = await this.$http.get('orders', {params: this.ordersInfo})
      console.log(res)
      if(res.meta.status !== 200) this.$message.error('获取订单列表数据失败')
      this.$message.success('获取订单列表数据成功')
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    
    // 分页
    // 每页有几条数据发生变化触发
    handleSizeChange(newsize) {
      console.log(newsize + '  每页有几条数据')
      this.ordersInfo.pagesize = newsize
      this.getOrdersList()
    },
    // 当前页码值发生变化触发
    handleCurrentChange(newpage) {
      console.log(newpage + '   当前页码值')
      this.ordersInfo.pagenum = newpage
      this.getOrdersList()
    },

    // 点击操作里面的编辑按钮
    showEditDialog() {
      this.EditDialogVisible = true
    },  
    // 点击操作里面的编辑按钮 监听关闭事件
    EidtDialogClose() {
      // 关闭后 清空form表单
      this.$refs.editFormRef.resetFields()
    },
    // 点击操作里面的定位按钮 物流进度
    async showLocationDialog() {
      // 接口崩了
      // const {data: res} = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      // if(res.meta.status !== 200) return this.$message.error('获取物流信息失败了')
      // this.$message.success('获取物流信息成功')
      // this.progressInfo = res.data
      this.locationDialogVisible = true
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
          size: 'large',
          color: '#0bbd87',
          icon: 'el-icon-more',
          type: 'primary',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '【北京市】北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
          size: 'normal',
          color: '#0bbd87',
          icon: 'el-icon-more',
          type: 'success',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 【北京海淀育新小区营业点】',
          location: '',
          size: 'large',
          color: '#0bbd87',
          icon: 'el-icon-s-opportunity',
          type: 'warning',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
          location: '',
          size: 'large',
          color: 'hotpink',
          icon: 'el-icon-loading',
          type: 'info',
        },
      ]
    },
  },
}
</script>

<style scoped>
.el-card,
.el-table {
  margin-top: 1rem;
}
</style>