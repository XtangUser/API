// 导入数据库
const db = require("../db/index")

// 登录日志
exports.loginLog = (req, res) => {
  const{name,email,account}=req.body
  const login_time=new Date()
  const sql='insert into login_log set ?'
  db.query(sql,{name,email,account,login_time},(err,result)=>{
    if(err) return res.cc(err)
      res.cc('登录日志添加成功',0)
  })
}
// 获取登录日志
exports.getLoginLog = (req, res) => {
  const sql='select * from login_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
    res.send(result)
  })
}
// 返回登陆日志列表长度
exports.getLoginLog_length=(req,res)=>{
  const sql='select * from login_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
    res.send({length:result.length})
  })
}
// 监听换页返回数据
exports.getLoginLog_page=(req,res)=>{
  const page=req.body.page
  const limit=req.body.limit
  const start=(page-1)*limit
   const sql =
    `SELECT * FROM login_log ORDER BY login_time asc LIMIT ${limit} OFFSET ${start}`
    db.query(sql,(err,result)=>{
      if(err) return res.cc(err)
        res.send(result)
    })
    
}
// 清空日志表
exports.clearLoginLog=(req,res)=>{
  const sql='truncate table login_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
      res.cc('清空成功',0)
  })
}
// 根据账号搜最近10条登陆记录
exports.getLoginLog_account=(req,res)=>{
  const account=req.body.account
  const sql='select * from login_log where account=? order by login_time asc limit 10'
  db.query(sql,account,(err,result)=>{
    if(err) return res.cc(err)
    res.send(result)
  })
}