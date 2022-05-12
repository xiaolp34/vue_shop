<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="['bdbottom', index1 === 0 ? 'bdtop' : ' ', 'vcenter']">
              <!-- 为第一行添加bdtop类 加 上边框 -->
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']">
                  <!-- 二级权限渲染 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeTag(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限渲染 -->
                  <el-col :span="18">
                    <el-tag type="danger" v-for="item3 in item2.children" :key="item3.id" closable @close="removeTag(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色提示框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="rolesFrom" :rules="addRules" ref="rolesFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限列表弹窗 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
      <!-- Tree 树形控件 -->
      <!-- node-key选择框和数据对象id属性绑定 -->
      <el-tree :data="rigthsList" node-key="id" :show-checkbox="true" :props="defaultProps" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 表单添加角色信息
      rolesFrom: {
        roleName: '',
        roleDesc: ''
      },
      // 获取的角色列表信息
      rolesList: [],
      // 角色添加表单的显示与隐藏
      addDialogVisible: false,
      // 添加角色验证规则
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '角色名称长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 20, message: '角色描述长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 控制角色编辑对话框
      editDialogVisible: false,
      // 根据id查询到的角色数据
      editForm: {},
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 获取的所有权限数据 树状
      rigthsList: [],
      // Tree 树形控件属性绑定对象
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 指定节点标签为节点对象的某个属性值
        label: 'authName'
      },
      // 默认被选中的权限id
      defKeys: [],
      // 当前要分配权限的角色的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表信息
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    // 当添加用户对话框关闭时
    addDialogClosed() {
      // 清除对话框填写的内容和验证错误信息
      this.$refs.rolesFormRef.resetFields()
    },
    // 点击添加角色表单确定按钮
    addRoles() {
      // 对添加用户表单进行预校验
      this.$refs.rolesFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return
        const { data: res } = await this.$http.post('/roles/', this.rolesFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 点击角色编辑按钮
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/roles/' + id)
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
    // 点击修改角色对话框确定按钮触发
    editUser() {
      // 对添加用户表单进行预校验
      this.$refs.editFormRef.validate(async (value) => {
        // 校验通过value则为true，反之
        if (!value) return

        const { data: res } = await this.$http.put('/roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRolesList()
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
      const { data: res } = await this.$http.delete('/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },

    // 点击tag权限删除按钮 小x号
    async removeTag(role, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => error)
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除权限')
      }
      const { data: res } = await this.$http.delete(`/roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 点击分配权限按钮
    async showSetRightDialog(role) {
      // 获取使用权限数据 树状
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rigthsList = res.data
      this.getListkeys(role, this.defKeys)
      this.setRightDialogVisible = true
      this.roleId = role.id
    },
    // 通过递归的形式,获取角色下所有三级权限的id 并保存到 defKeys 数组中
    // node:节点  arr:存放id的数组
    getListkeys(node, arr) {
      // 如果当前node节点不包含children 属性 则是三级节点
      if (!node.children) return arr.push(node.id)
      // 如果当前node节点包含children 属性 则不是三级节点 进行递归调用
      node.children.forEach((item) => this.getListkeys(item, arr))
    },
    // 当分配权限对话框关闭时
    setRightDialogClose() {
      // 清空defKeys素组
      this.defKeys = []
    },
    // 点击分配权限对话框的确定按钮
    async allotRights() {
      // Tree 树形控件的方法
      // getCheckedKeys() 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      const keys = this.$refs.treeRef.getCheckedKeys()
      // getHalfCheckedKeys() 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      const halfFeys = this.$refs.treeRef.getHalfCheckedKeys()
      // 把获取的权限id解构合并成新数组,然后转换为以,分割的字符串
      const allKeys = [...keys, ...halfFeys].join(',')
      // 发起ajax修改角色权限
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: allKeys })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      // 关闭分配权限窗口
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
