// 引入express框架
const express=require('express')
// 导入cors解决跨域问题
const cors=require('cors')
// 导入body-parser用于解析表单数据的中间件
const bodyParser=require('body-parser')
// 创建实例
const app=express()
// 全局挂载
app.use(cors())
// parser application/x-www-form-urlencoded
//当extend的值为false时，表单数据可以为数组或则字符串，为true时可以为任意值
app.use(bodyParser.urlencoded({extended:false}))
// 用于处理json格式数据的配置
app.use(bodyParser.json())
//设置开启端口号
const  port=3007;


// 创建监听器,绑定主机和端口
app.listen(port,()=>{
  console.log("http://127.0.0.1:3007",port);
  
})
