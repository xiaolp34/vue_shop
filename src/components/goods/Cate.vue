<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns" show-index :show-row-hover="false" :selection-type="false" :expand-type="false" border>
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen; font-size: 20px; padding-left: 10px" v-if="!scope.row.cat_deleted"></i>
          <!-- {{ scope.row }} -->
          <i class="el-icon-error" style="color: red; font-size: 20px; padding-left: 10px" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="info" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[1, 5, 10, 20]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="35%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 指定数据源 -->
          <!-- props 配置选项 -->
          <!-- @change 当选中节点变化时触发 -->
          <!-- value / v-model  选中项绑定值 -->
          <!-- clearable  是否支持清空选项 -->
          <!-- change-on-select 是否允许选择任意一级的选项 -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="45%" @close="editCaterDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="addCateRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
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
export default {
  name: 'Cate',
  data() {
    return {
      // 存放获取到的商品分类数据
      cateList: [],
      // 获取商品分类数据列表的查询参数
      querInfo: {
        //  值：1，2，3 分别表示显示一层二层三层分类列表
        type: 3,
        //  pagenum:当前页码值
        pagenum: 1,
        //  pagesize:每页显示多少条数据
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // tree-table 表格各列的配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称 对应的作用域插槽
          template: 'isOk'
          // 标签居中
          // headerAlign: 'center',
          // 内容居中
          // align: 'center'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称 对应的作用域插槽
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称 对应的作用域插槽
          template: 'opt'
        }
      ],
      // 添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单数据
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 分类父 ID  不能为空，如果要添加1级分类，则父分类Id应该设置为 0
        cat_pid: 0,
        // 分类层级 不能为空，0表示一级分类；1表示二级分类；2表示三级分类
        cat_level: 0
      },
      // 添加分类表当验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '分类名称长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 获取到的父级分类列表数据
      parentCateList: [],
      // 指定 Cascader 级联选择器 的配置对象
      cascaderProps: {
        // value  指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // label  指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // children  指定选项的子选项为选项对象的某个属性值
        children: 'children',
        // 次级菜单的展开方式 click / hover
        expandTrigger: 'hover',
        //  checkStrictly: true 是否严格的遵守父子节点不互相关联
        // 用来设置父子节点取消选中关联,从而达到选择任意一级的目的
        // change-on-select: true 来实现允许选中父选项的功能 但是从elementUI 2.9.2开始, element删除了这个属性 用checkStrictly: true 解决
        // 问题：使用单选选择任意一级选项使用此属性时 :props="{ checkStrictly: true }"时，默认的选择区域只有radio一个小圆圈，点击选项文字无效的。
        // 解决方案：分析页面上渲染出来的element组件结构，找到对应的类名。进行样式的覆盖
        checkStrictly: true
      },
      // 被选中的父级分类的id数组 双向绑定的数据
      selectedKeys: [],
      // 控制修改分类对话框
      editDialogVisible: false,
      // 存放修改分类表单数据
      editForm: {
        cat_name: '',
        cat_id: 0
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 每页条数改变时触发
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 当前页发生改变时触发
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加分类按钮触发
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.parentCateList = res.data
    },
    // Cascader 级联选择器 当选中项发生变化时触发
    parentCateChange() {
      // 如果selectedKeys数组的length大于0 证明选中了父级分类，反之 就没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 存储父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 存储父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
      // console.log(this.addCateForm)
    },
    // 添加分类对话框关闭触发
    addCateDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.addCateFormRef.resetFields()
      // 清空被选中的父级分类的id数组
      this.selectedKeys = []
      // 清空存储父级分类的id
      this.addCateForm.cat_pid = 0
      // 清空为当前分类等级
      this.addCateForm.cat_level = 0
    },
    // 点击添加分类对话框里的确定按钮
    addCate() {
      this.$refs.addCateFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.post('/categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    // 点击编辑分类按钮
    showEditDialog(cate) {
      this.editForm.cat_name = cate.cat_name
      this.editForm.cat_id = cate.cat_id
      this.editDialogVisible = true
    },
    // 关闭修改分类对话框触发
    editCaterDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑分类对话框里的确定按钮
    editCate() {
      this.$refs.editFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.put('/categories/' + this.editForm.cat_id, { cat_name: this.editForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getCateList()
      })
    },
    // 点击删除分类按钮
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 当点击取消时会发生报错，用catch捕获这次报错，然后返回错误信息给confirmResult
      }).catch((error) => error)
      // 当点击确定时返回的confirmResult值为字符串confirm
      // 取消时返回的confirmResult值为字符串cancel
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除用户')
      }
      const { data: res } = await this.$http.delete('/categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
