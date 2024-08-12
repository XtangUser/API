// 连接数据库的文件
const mysql=require('mysql')
//创建连接池
const db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  // 数据库名称
  database:'back_system'
})

// 导出
module.exports=db;