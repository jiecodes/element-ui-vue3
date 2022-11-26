module.exports = {
  // 配置别名 路径
  configureWebpack: {
    resolve: {
      // 别名         @ src/ 默认配置好的
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  },

  // 优化
  // 默认开发，发布阶段的打包入口都是 main.js
  // 打包 main-dev.js 开发阶段的打包入口        main-prod.js 发布阶段的打包入口  新创建这俩个js文件 并且把main.js删除
  chainWebpack: config => {
    // 发布阶段 默认打包路径修改
    config.when(process.env.NODE_ENV === 'production', config => {
      // config.entry('app').clear().add('./src/main-prod.js') 

      // // 优化 通过externals加载外部cdn资源 index.html导入
      // config.set('externals', {
      //   vue: 'Vue',
      //   'vue-router': 'VueRouter',
      //   axios: 'axios',
      //   lodash: '_',
      //   echarts: 'echarts',
      //   nprogress: 'NProgress',
      //   'vue-quill-editor': 'VueQuillEditor'
      // })

      // 发布模式下 index.html text显示的文字
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

    })
    // 开发阶段默认打包路径修改
    config.when(process.env.NODE_ENV === 'development', config => {
      // config.ensry('app').clear().add('./src/main-dev.js')

      // 开发模式下 index.html text显示的文字
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}