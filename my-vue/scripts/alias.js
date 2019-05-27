const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)


module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'), // 编译相关
  core: resolve('src/core'), // 核心代码
  shared: resolve('src/shared'), // 共享代码
  web: resolve('src/platforms/web'), // 不通平台的支持
  server: resolve('src/server'), // 服务端渲染
  sfc: resolve('src/sfc'), // .vue文件解析
}
