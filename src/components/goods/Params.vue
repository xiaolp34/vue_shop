<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"> </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader :options="cateList" clearable :props="props" v-model="selectedKeys" @change="parentCateChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="many" :disabled="isBtnDisabled">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加动态参数</el-button>
          <!-- 动态参数列表区域 -->
          <el-table :data="manyParamsList" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{ item }}</el-tag>
                <!-- 添加属性输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 添加属性按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性" name="only" :disabled="isBtnDisabled">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加静态属性</el-button>
          <!-- 静态属性列表区域 -->
          <el-table :data="onlyParamsList" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{ item }}</el-tag>
                <!-- 添加属性输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 添加属性按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/静态属性提示框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addCateFrom" :rules="addCateRules" ref="addCateFormRef">
        <el-form-item :label="titleText + '名称'" prop="attr_name">
          <el-input v-model="addCateFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateParamsForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数/静态属性提示框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editCateFrom" :rules="addCateRules" ref="editCateFormRef">
        <el-form-item :label="titleText + '名称'" prop="attr_name">
          <el-input v-model="editCateFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateParamsForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 存放获取到的分类数据
      cateList: [],
      // 指定 Cascader 级联选择器 的配置对象
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 被选中的父级分类的id数组 双向绑定的数据
      selectedKeys: [],
      // Tabs 标签页 双向绑定值，选中选项卡的 name
      // 被激活页签的name名称
      activeName: 'many',
      // 存放动态参数列表
      manyParamsList: [],
      // 存放静态参数列表
      onlyParamsList: [],
      // 控制添加对话框显示与隐藏
      addDialogVisible: false,
      // 添加分类参数表数据 双向绑定
      addCateFrom: {
        attr_name: ''
      },
      // 添加分类参数表单验证规则
      addCateRules: {
        attr_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 控制修改对话框显示与隐藏
      editDialogVisible: false,
      // 修改分类参数表数据 双向绑定
      editCateFrom: {
        attr_name: '',
        attr_id: 0
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.cateList = res.data
      // console.log(res)
    },
    // 获取参数列表数据
    async getParamsList() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      // 把res.data数据里的attr_vals属性的值由空格分隔的字符串转化为数组
      // console.log(res.data)
      res.data.forEach((itme) => {
        // 如果 itme.attr_vals为空则直接返回一个空的数组而不是[" "]
        itme.attr_vals = itme.attr_vals ? itme.attr_vals.split(' ') : []
        // 在res.data数据里添加2个属性
        // 控制tag输入框和按钮切换
        itme.inputVisible = false
        // 双向绑定tag文本框的内容
        itme.inputValue = ''
      })
      // console.log(res.data)
      if (this.activeName === 'many') {
        this.manyParamsList = res.data
      } else {
        this.onlyParamsList = res.data
      }
      // console.log(res)
    },
    // Cascader 级联选择器 当选中项发生变化时触发
    parentCateChange() {
      // 如果选择的不是三级分类就直接清空
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.onlyParamsList = []
        this.manyParamsList = []
        return
      }
      this.getParamsList()
    },
    // tab 被选中时触发
    // tab 点击事件处理函数
    handleClick() {
      this.getParamsList()
    },
    // 添加对话框关闭回调
    addDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.addCateFormRef.resetFields()
    },
    // 点击添加对话框确定按钮
    addCateParamsForm() {
      this.$refs.addCateFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.post('categories/' + this.cateId + '/attributes', {
          attr_name: this.addCateFrom.attr_name,
          attr_sel: this.activeName
          // attr_vals: ''
        })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getParamsList()
      })
    },
    // 修改对话框关闭回调
    editDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.editCateFormRef.resetFields()
      // 一个小bug 处理
      this.editCateFrom.attr_name = ''
    },
    // 点击修改按钮
    showEditDialog(params) {
      this.editCateFrom.attr_name = params.attr_name
      this.editCateFrom.attr_id = params.attr_id
      this.editDialogVisible = true
    },
    // 点击修改对话框确定按钮
    editCateParamsForm() {
      this.$refs.editCateFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editCateFrom.attr_id}`, {
          attr_name: this.editCateFrom.attr_name,
          attr_sel: this.activeName
          // attr_vals: ''
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getParamsList()
      })
    },
    // 点击删除按钮
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => error)
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除属性')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getParamsList()
    },
    // tag文本框按下Enter和失去焦点时触发
    async handleInputConfirm(tagParams) {
      if (tagParams.inputValue.trim().length === 0) {
        tagParams.inputValue = ''
        tagParams.inputVisible = false
        return
      }
      // console.log(tagParams)
      tagParams.attr_vals.push(tagParams.inputValue.trim())
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${tagParams.attr_id}`, {
        attr_name: tagParams.attr_name,
        attr_sel: tagParams.attr_sel,
        // 把数组转化为以空格分隔的字符串
        attr_vals: tagParams.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('添加成功')
      tagParams.inputVisible = false
      tagParams.inputValue = ''
    },
    // tag按钮按下时触发
    showInput(tagParams) {
      tagParams.inputVisible = true
      // 文本框自动获取焦点
      // $nextTick方法的作用就是当前页面上的元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击tag的小x号
    async handleClose(i, tagParams) {
      tagParams.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${tagParams.attr_id}`, {
        attr_name: tagParams.attr_name,
        attr_sel: tagParams.attr_sel,
        // 把数组转化为以空格分隔的字符串
        attr_vals: tagParams.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
    }
  },
  // 计算属性
  computed: {
    // 如果按钮需要被禁用则返回true 否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 计算分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-cascader {
  width: 20%;
}
.el-tag {
  margin: 5px 15px;
}
.input-new-tag {
  width: 150px;
}
</style>
