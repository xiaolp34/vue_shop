<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和按钮区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入查询内容" v-model.trim="queryInfo.query" clearable @clear="getOrdersList"> </el-input>
        </el-col>
        <el-col :span="2"> <el-button type="primary" icon="el-icon-search" @click="queryOrdersList">搜索</el-button></el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" width="50px"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="left"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" width="150px" align="center"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="150px" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
            <el-tag type="warning" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px" align="center"> </el-table-column>
        <el-table-column label="下单时间" width="230px" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editLocation(scope.row)"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showLocation(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 100]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>

    <!-- 编辑订单信息对话框 -->
    <el-dialog title="修改订单信息" :visible.sync="editOrderDialogVisible" width="45%" @close="editOrderCaterDialogClosed">
      <el-form :model="editOrderForm" :rules="editOrderFormRules" ref="editOrderFormRef" label-width="80px">
        <el-form-item label="商品分类" prop="location1">
          <!-- Cascader 级联选择器 -->
          <el-cascader class="previewImg" :options="citydata" :props="cascaderProps" clearable v-model="editOrderForm.location1" @change="cascaderChooseChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="location2">
          <el-input v-model="editOrderForm.location2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="订单物流信息" :visible.sync="logisticsDialogVisible" width="50%">
      <!-- 物流时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入citydata 地区数据文件
// citydata  据国家统计局数据生成的最新地区三级联动数据
import citydata from '@/components/order/citydata.js'
export default {
  name: 'Order',
  data() {
    return {
      // 查询参数
      queryInfo: {
        // 搜索框内容 双向绑定
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 存放订单列表
      ordersList: [],
      // 存放商品总条数
      total: 0,
      // 控制修改对话框的显示与隐藏
      editOrderDialogVisible: false,
      // 修改的表单数据
      editOrderForm: {
        location1: [],
        // 存放级联选择器选择的数组 必须是数组
        location2: ''
      },
      // 修改表单的验证规则
      editOrderFormRules: {
        location1: [{ required: true, message: '请输选择省，市，区，县', trigger: 'blur' }],
        location2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      //  使用 citydata 地区数据文件
      citydata,
      // Cascader 级联选择器 配置对象
      cascaderProps: {
        expandTrigger: 'hover'
      },
      // 控制物流信息对话框
      logisticsDialogVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表数据
    async getOrdersList() {
      // console.log(this.queryInfo)
      const { data: res } = await this.$http.get('/orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.total = res.data.total
      this.ordersList = res.data.goods
      // console.log(this.ordersList)
    },
    // 每页显示条数改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 当前页码发生改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 查询订单 搜索按钮  查询订单接口失效
    queryOrdersList() {
      if (this.queryInfo.query.length === 0) {
        this.$message.info('请输入查询内容')
        return
      }
      this.$message.error('查询接口失效')
      // this.getOrdersList()
    },
    // 修改订单信息 地址
    editLocation(ojb) {
      this.editOrderDialogVisible = true
    },
    // 关闭修改对话框的回调函数
    editOrderCaterDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.editOrderFormRef.resetFields()
      this.editOrderForm.location2 = ''
    },
    // Cascader 级联选择器 选择发生改变时触发
    cascaderChooseChange() {
      // console.log(this.editOrderForm.location1)
      // console.log(this.editOrderForm.location2)
    },
    // 查看订单物流信息 位置按钮
    async showLocation(ojb) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.message)
      this.progressInfo = res.data
      this.logisticsDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>
