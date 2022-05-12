<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" width="40px"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"> </el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 100]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>
    <!-- 编辑商品按钮 -->
    <el-dialog title="修改商品信息" :visible.sync="editDialogVisible" width="45%" @close="editCaterDialogClosed">
      <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <!-- Cascader 级联选择器 -->
          <el-cascader class="previewImg" :options="cateList" :props="cateListProps" clearable v-model="editGoodsForm.goods_cat" @change="cateListChooseChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'List',
  data() {
    return {
      queryInfo: {
        // 搜索框内容 双向绑定
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 存放商品列表
      goodsList: [],
      // 存放商品总条数
      total: 0,
      // 控制编辑框的显示与隐藏
      editDialogVisible: false,
      // 当前商品id
      goods_id: '',
      // 商品编辑表单数据
      editGoodsForm: {
        // 名称
        goods_name: '',
        // 价格
        goods_price: '',
        // 重量
        goods_weight: '',
        // 数量
        goods_number: '',
        // 选择的商品分类id数组
        goods_cat: [1, 3, 6]
      },
      editGoodsFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类数据
      cateList: [],
      // Cascader 级联选择器 配置对象
      cateListProps: {
        expandTrigger: 'hover',
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        children: 'children'
        // checkStrictly: true
      }
    }
  },
  created() {
    this.getGoodsList()
    this.getCateList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('/goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.total = res.data.total
      this.goodsList = res.data.goods
      // console.log(this.goodsList)
    },
    // 每页显示条数改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    // 当前页码发生改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品按钮
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => error)
      if (confirmResult === 'cancel') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete(`/goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 添加商品按钮
    addGoods() {
      this.$router.push('goods/add')
    },
    // Cascader 级联选择器 当选择变化时触发
    cateListChooseChange() {
      // console.log(this.cateList)
      // console.log(this.editGoodsForm.goods_cat)
      if (this.editGoodsForm.goods_cat.length !== 3) {
        this.editGoodsForm.goods_cat = []
      }
    },
    // 编辑商品按钮
    editGoodsDialog(ojb) {
      // console.log(ojb)
      this.editGoodsForm.goods_name = ojb.goods_name
      this.editGoodsForm.goods_price = ojb.goods_price
      this.editGoodsForm.goods_weight = ojb.goods_weight
      this.editGoodsForm.goods_number = ojb.goods_number
      this.goods_id = ojb.goods_id
      this.editDialogVisible = true
    },
    // 关闭修改分类对话框触发
    editCaterDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.editGoodsFormRef.resetFields()
      this.editGoodsForm.goods_name = ''
      this.editGoodsForm.goods_price = ''
      this.editGoodsForm.goods_weight = ''
      this.editGoodsForm.goods_number = ''
    },

    // 点击编辑表单的确定按钮
    async editCate() {
      this.$refs.editGoodsFormRef.validate(async (value) => {
        if (!value) return this.$message.error('请填写必要信息')
        const deep = _.cloneDeep(this.editGoodsForm)
        // 把goods_cat属性的值由数组转为以,分隔的字符串
        deep.goods_cat = deep.goods_cat.join(',')
        const { data: res } = await this.$http.put(`goods/${this.goods_id}`, deep)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('商品修改成功')
        this.editDialogVisible = false
        this.getGoodsList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}
</style>
