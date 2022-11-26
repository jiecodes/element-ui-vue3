const express = require('express')
const app = express()

// 导入优化配置 开启gzip配置
// const compression = require('compression')
// 注册为中间键     必须写在 静态资源托管之前
// app.use(compression)

app.use(express.static('./dist'))

app.listen(80, () => {
  console.log('server running at http://127.0.0.1')
})