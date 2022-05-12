<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示文本区域-->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- steps步骤条区域 -->
      <!-- 把字符串的activeName的转换为数字型  必须是减号,加号就变成字符串拼接生成另一个字符串了-->
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成" :status="successStatus"></el-step>
      </el-steps>
      <!-- Tabs 标签页 -->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- Cascader 级联选择器 -->
              <el-cascader :options="cateList" :props="cateListProps" clearable v-model="addGoodsForm.goods_cat" @change="cateListChooseChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
              <!-- 输入框 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="uploadHeader" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器区域 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <!-- 添加按钮 -->
            <el-button class="addBtn" type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
          <el-tab-pane label="完成" name="5">
            <el-result v-if="resultStatus" icon="success" title="商品添加成功" subTitle="请返回商品列表页面进行查看">
              <template slot="extra">
                <el-button type="primary" size="medium" @click="addSuccess">返回商品列表</el-button>
              </template>
            </el-result>
            <el-result v-else icon="warning" title="未提交" subTitle="请返回进行提交">
              <template slot="extra">
                <el-button type="primary" size="medium" @click="addWarning">返回</el-button>
              </template>
            </el-result>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 照片预览框 -->
    <el-dialog title="照片预览" :visible.sync="previewDialogVisible">
      <img :src="previewUrl" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash 使用它的对象深拷贝方法 deep = _.cloneDeep(objects);
import _ from 'lodash'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤和标签页名称绑定
      activeName: '0',
      // 添加商品表单数据
      addGoodsForm: {
        // 名称
        goods_name: '',
        // 价格
        goods_price: '',
        // 重量
        goods_weight: '',
        // 数量
        goods_number: '',
        // 选择的商品分类id数组
        goods_cat: [1, 3, 6],
        // 照片数据组
        // pic为照片在服务器的地址 上传成功之后会返回pic
        // pics: [
        //   { pic: '/tmp_uploads/30f08d52c551ecb447277eae232304b8' }
        // ],
        pics: [],
        // 商品描述文本
        goods_introduce: '',
        // 商品的参数（数组），包含 动态参数 和 静态属性
        //     "attrs":[
        // {
        //   "attr_id":15,
        //   "attr_value":"ddd"
        // },
        // {
        //   "attr_id":15,
        //   "attr_value":"eee"
        // }
        //      ]
        attrs: []
      },
      // 添加商品表单数据验证规则
      addGoodsFormRules: {
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
      },
      // 存放动态参数
      manyParams: [],
      // 存放静态属性
      onlyParams: [],
      // 上传照片添加请求头 token验证
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制照片预览框显示与隐藏
      previewDialogVisible: false,
      // 预览照片的url地址
      previewUrl: '',
      // 完成步骤的当前状态
      successStatus: '',
      // 完成页面内容的显示 警告还是成功
      resultStatus: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // Cascader 级联选择器 当选择变化时触发
    cateListChooseChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }

      // console.log(this.addGoodsForm.goods_cat)
    },
    // 在Tabs 标签页 发生切换之前
    // activeName :即将切换到的标签页名称
    //  oldActiveName : 即将离去的标签页名称
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    beforeTabLeave(activeName, oldActiveName) {
      if ((oldActiveName === '0') & (this.addGoodsForm.goods_cat.length === 0)) {
        this.$message.info('请选择先完成基本信息填写')
        return false
      }
    },
    // 点击标签页换时触发
    async tabClick() {
      // console.log(this.activeName)
      // 当要进入的标签页的名称是'1'时 发送获取动态参数的请求
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // this.$message.success(res.meta.msg)
        this.manyParams = res.data
        this.manyParams.forEach((item) => {
          item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(' ')
        })
        // console.log(this.manyParams)
      }
      // 当要进入的标签页的名称是'2'时 发送获取静态属性的请求
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // this.$message.success(res.meta.msg)
        this.onlyParams = res.data

        // console.log(this.onlyParams)
      }
    },
    // 点击预览照片处理函数
    // file要预览的照片信息
    handlePreview(file) {
      // console.log(file)
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 点击删除照片处理函数 小x号
    // file要移除的照片信息
    handleRemove(file) {
      // console.log(file)
      // 1.获取照片在服务器上的地址
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中找到这个照片对应的索引
      // findIndex方法返回匹配的索引
      const index = this.addGoodsForm.pics.findIndex((item) => item.pic === filePath)
      // 3.调用splice方法把照片从pics数组中移除
      // splice方法移除数组中从index开始 一共移除1项
      this.addGoodsForm.pics.splice(index, 1)
      // console.log(this.addGoodsForm.pics)
    },
    // 上传成功之后的回调
    // response为上传成功之后服务器的返回数据
    uploadSuccess(response) {
      // console.log(response)
      if (response.meta.status !== 200) return this.$message.error(response.meta.msg)
      this.$message.success(response.meta.msg)
      // 先拼接再增加到数组
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm.pics)
    },
    // 添加商品按钮
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (value) => {
        if (!value) {
          this.activeName = '0'
          this.$message.error('请填写必要信息')
          return
        }
        // console.log(this.addGoodsForm)
        // 由于Cascader 级联选择器 v-model="addGoodsForm.goods_cat"  必须绑定的是一个数组 但是服务器接收的goods_cat属性必须是字符串 所以不能直接改addGoodsForm里的goods_cat属性 改了会报错
        // 可以使用lodash 深拷贝方法 _.cloneDeep(objects)  重新复制一个addGoodsForm对象进行修改并提交到服务器
        const deep = _.cloneDeep(this.addGoodsForm)
        // 把goods_cat属性的值由数组转为以,分隔的字符串
        deep.goods_cat = deep.goods_cat.join(',')

        // 处理动态参数
        // console.log(this.manyParams)
        this.manyParams.forEach((item) => {
          const newManyParams = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          deep.attrs.push(newManyParams)
        })
        // console.log(deep)

        // 处理静态属性
        // console.log(this.onlyParams)
        this.onlyParams.forEach((item) => {
          const newonlyParams = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          deep.attrs.push(newonlyParams)
        })

        // 把照片数据清除不然会报错 服务端的问题
        deep.pics = []

        // console.log(deep)
        // 发起提交请求
        const { data: res } = await this.$http.post('goods', deep)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.resultStatus = true
        this.activeName = '5'
        this.successStatus = 'success'
      })
    },
    // 商品添加完成回调函数 点击返回商品列表按钮触发
    addSuccess() {
      this.$router.push('/goods')
    },
    // 商品未提交 返回按钮触发
    addWarning() {
      this.activeName = '4'
    }
  },
  computed: {
    // 计算商品分类的父级id
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 25px 0;
}
.el-cascader {
  width: 100%;
}
.el-checkbox {
  margin: 10px;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
