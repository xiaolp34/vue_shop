const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// webpavk配置声明
module.exports = {
  // chainWebpack和configureWebpack都可以来修改默认的webpack配置
  // chainWebpack :通过链式编程的形式来修改默认的webpack配置文件
  // configureWebpack :通过操作对象的形式来修改默认的webpack配置文件
  chainWebpack: (config) => {
    // 生产模式
    // 配置production生产模式的入口文件
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过external 加载外部CDN资源 减小打包的体积
      // 默认情况下，通过import语法导入第三方依赖包。最终会被打包合并到同一个文件中,从而出现单文件体积过大的情况
      // 为了解决这个问题，可以通过webpack的external节点，来配置并加载外部CDN资源，凡是声明在external中的第三方依赖包都不会被打包
      // 会去全局window对象查找对应的属性对象
      config.set('externals', {
        // 导入的包名 : '对象名称'
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 在不同的打包环境下。首页的内容可能会有所不同，我们可以通过插件的方式进行定制，插件配置如下
      config.plugin('html').tap((args) => {
        // 为args挂载isProd属性 并给他赋值 true
        // 在html页面就可以使用isProd属性判断当前属于什么模式
        // 是production生产模式
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    // 配置development开发模式的入口文件
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap((args) => {
        // 为args挂载isProd属性 并给他赋值 false
        // 在html页面就可以使用isProd属性判断当前属于什么模式
        // 不是production生产模式
        args[0].isProd = false
        return args
      })
    })
  },
  // publicPath: process.env.NODE_ENV === 'production' ? '/生产环境路径/' : '/'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}
