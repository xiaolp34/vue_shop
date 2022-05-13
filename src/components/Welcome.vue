<template>
  <div class="box">
    <el-row :gutter="20" class="header">
      <el-col :span="6"><h3>欢迎页面</h3></el-col>
      <el-col :span="12"><h1>电商后台管理系统</h1></el-col>
      <el-col :span="6"><h3></h3></el-col>
    </el-row>
    <el-card>
      <el-row class="bodys">
        <el-col :span="24">
          <span>技术栈: </span>
          <el-tag v-for="(item, i) in tag_data" :key="i">{{ item }}</el-tag>
        </el-col>
      </el-row>

      <table>
        <tr>
          <td class="other">项目地址</td>
          <td>
            <div>Gitee: <a href="https://gitee.com/xiao34/vue_shop">https://gitee.com/xiao34/vue_shop </a>（国内推荐）</div>
            <div>GitHub: <a href="https://github.com/xiaolp34/vue_shop">https://github.com/xiaolp34/vue_shop </a></div>
          </td>
        </tr>
        <tr>
          <td class="other">其他项目</td>
        </tr>
        <tr>
          <td>音乐网站</td>
          <td>
            <div>效果展示：<a href="https://xiao34.gitee.io/music_web">https://xiao34.gitee.io/music_web</a></div>
            <div>项目地址：<a href="https://gitee.com/xiao34/music_web">https://gitee.com/xiao34/music_web </a></div>
          </td>
        </tr>
        <tr>
          <td>品优购</td>
          <td>
            <div>效果展示：<a href="https://xiao34.gitee.io/shoping">https://xiao34.gitee.io/shoping </a></div>
            <div>项目地址：<a href="https://gitee.com/xiao34/shoping">https://gitee.com/xiao34/shoping </a></div>
          </td>
        </tr>
      </table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      tag_data: ['html', 'css', 'JavaScript', 'vue', 'ES6', 'vue-cli', 'axios', 'Element-ui', 'vue-router', 'nodejs', 'ESLint', 'less', '等...']
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  h1 {
    // border: 2px solid red;
    font-size: 35px;
    text-align: center;
    letter-spacing: 0.2em;
  }
}
.bodys {
  .el-col {
    text-align: center;
    // border: 2px solid red;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    .el-tag {
      font-size: 18px;
      margin: 0 3px;
    }
  }
}
table {
  width: 600px;
  margin: 20px auto;
  // border: 2px solid red;
  font-size: 18px;
  margin-top: 25px;
  tr td:nth-child(1) {
    text-align: right;
    vertical-align: top;
    padding-right: 15px;
    font-size: 18px;
    font-weight: 700;
    // border: 2px solid red;
  }
  td > div {
    margin-bottom: 12px;
  }
}
td {
  padding-bottom: 30px;
}
.other {
  font-size: 20px !important;
  padding: 0;
}
</style>
