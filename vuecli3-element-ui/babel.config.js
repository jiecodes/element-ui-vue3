// 解决 安装的 不打印console 插件 在开发时可以打印console
const prodplugins = []
// 在打包和运行时 都会执行一条命令里面包含 --mode后面跟的值不一样  serve(运行)是development  build(打包)是production
if (process.env.NODE_ENV === 'production') {
  prodplugins.push('transform-remove-console')
}


module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    // build 打包时  不打印console  但是开发阶段也不打印 console
    // 'transform-remove-console',

    // 解决开发时 可以打印 console    ...把这个数组展开放到另一个数组中
    ...prodplugins
  ]
}
