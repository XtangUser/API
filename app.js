// 引入express框架
const express = require("express")
// 导入cors解决跨域问题
const cors = require("cors")
// 导入密钥
const jwtconfig = require("./jwt_config/index")
const { expressjwt: jwt } = require("express-jwt")
// 导入body-parser用于解析表单数据的中间件
const bodyParser = require("body-parser")
//导入验证规则解析
const joi = require("joi")
// 创建实例
const app = express()
// 全局挂载
app.use(cors())
// multer 是一个nodejs中间件,用于处理multipart/form-data类型的表单数据,它主要用于上传文件
const Multer=require("multer")
// 在serve服务端下新建一个public文件,在public文件下新建upload文件用于存放图片
const upload=Multer({dest:'./public/upload'})
// 全局挂载
app.use(upload.any())
// 静态托管
app.use(express.static('./public'))

// parser application/x-www-form-urlencoded
//当extend的值为false时，表单数据可以为数组或则字符串，为true时可以为任意值
app.use(bodyParser.urlencoded({ extended: false }))
// 用于处理json格式数据的配置
app.use(bodyParser.json())
// 封装res.send函数为cc函数，并设置为全局可用
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
// 全局注册token中间件
// app.use(
//   // 解析token的中间件
//   jwt({
//     secret: jwtconfig.jwtSecretKey,
//     algorithms: ["HS256"],
//     // 排除不需要token的路径
//   }).unless({
//     path: [/^\/api\//],
//   })
// )
//---------------------------------------------------------------------
// 导入登录路由
const login_router = require("./router/login")
// 全局挂载
app.use("/api", login_router)

// 导入用户路由
const user_router = require("./router/userinfo")
// 全局挂载
app.use("/user", user_router)
// 新建错误中间件，对不符合joi验证规则的情况进行报错
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err.message)
})
//在所有路由后面定义错误中间件
//使用全局错误处理中间件 捕获解析 JWT 失败后产生的错误
app.use((err, req, res, next) => {
  //判断是否由 Token 解析失败导致的
  if (err.name == "UnauthorizedError") {
    return res.send({
      status: 401,
      message: "无效的Token",
    })
  }
  res.send("未知的错误", 500)
})

// 创建监听器,绑定主机和端口
app.listen(3007, () => {
  console.log("http://127.0.0.1:3007")
})
