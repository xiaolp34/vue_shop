<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/image/ql.png" alt="" />
      </div>
      <el-form :model="loginForm" ref="loginFormRef" :rules="rules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"><i slot="prefix" class="iconfont icon-user"></i></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"><i slot="prefix" class="iconfont icon-3702mima"></i></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" class="btn" @click="login">登录</el-button>
          <div></div>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置用户名和密码
    resetForm() {
      this.$refs.loginFormRef.resetFields()
      this.$message.success('重置成功')
    },
    // 对整个表单进行校验
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 2px 2px 10px #909090;

  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    // box-shadow: 0 0 10px #ddd;
    box-shadow: 2px 2px 10px #909090;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: center;
    div {
      display: inline-block;
      width: 70px;
    }
  }
}
</style>
