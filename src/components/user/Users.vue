<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 通过slot-scope插槽可以获取数据对象 -->
          <template slot-scope="scope">
            <!-- 通过scope.row属性可以获取当前行的数据对象 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加用户提示框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addRules" ref="ruleFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="45%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <!-- 内容主体 -->
      <div>
        <h3>当前的用户:{{ userInfo.username }}</h3>
        <h3>当前的角色:{{ userInfo.role_name }}</h3>
        <h3>
          分配新角色:
          <el-select v-model="setectedRoleId" placeholder="请选择角色">
            <el-option v-for="item in rolesLest" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </h3>
      </div>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义邮箱验证规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱格式'))
    }
    // 自定义号码验证规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /0?(13|14|15|17|18|19)[0-9]{9}/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机格式'))
    }
    return {
      queryInfo: {
        query: '',
        // 第几页
        pagenum: 1,
        // 每一页显示几条
        pagesize: 5
      },
      // 请求回来的用户数据
      userList: [],
      // 一共有几条用户数据
      total: 0,
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户表单数据
      editForm: {},
      // 修改用户验证规则
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 当前分配角色的用户
      userInfo: {},
      // 所有角色列表
      rolesLest: [],
      // 被选中的角色id值
      setectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
    // console.log('欢迎')
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 切换了每页显示条数后触发的函数
    // newSize是每一页显示的条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 页码值发生改变后触发的函数
    // newPage是当前第几页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 当用户状态开关发生改变时触发的函数
    async userStateChange(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 当添加用户对话框关闭时触发的函数
    addDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击添加用户对话框确定按钮触发
    addUser() {
      // 对添加用户表单进行预校验
      this.$refs.ruleFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 点击编辑用户按钮触发
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)
      this.editForm = res.data
    },
    // 当修改用户对话框关闭时触发的函数
    editDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改用户对话框确定按钮触发
    editUser() {
      // 对添加用户表单进行预校验
      this.$refs.editFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.put('/users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 点击删除按钮触发的函数
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
      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 点击分配角色按钮
    async setRole(userInfo) {
      this.userInfo = userInfo
      // console.log(userInfo)
      // this.setectedRoleId = userInfo.role_name
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)
      this.rolesLest = res.data
      this.setRoleDialogVisible = true
    },
    // 当分配角色对话框关闭时触发的函数
    setRoleDialogClosed() {
      // 清空被选择的角色id
      this.setectedRoleId = ''
      // 清空当前分配角色的用户
      this.userInfo = {}
    },
    // 点击分配角色对话框确认按钮
    async saveRoleInfo() {
      if (!this.setectedRoleId) return this.$message.error('请选择要更改的角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.setectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
      // 关闭对话框
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
