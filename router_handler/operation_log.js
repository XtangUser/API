// 导入数据库
const db = require("../db/index")
/**
 * operation_person 操作者
 * operation_time 操作时间
 * operation_content 操作内容
 * operation_level 操作等级
 */
// 操作日志
exports.operationLog = (req, res) => {
  const{operation_person ,operation_content,operation_level}=req.body
  const operation_time=new Date()
  const sql='insert into operation_log set ?'
  db.query(sql,{operation_person ,operation_content,operation_level,operation_time},(err,result)=>{
    if(err) return res.cc(err)
      res.cc('登录日志添加成功',0)
  })
}
// 获取操作日志
exports.getoperationLog = (req, res) => {
  const sql='select * from operation_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
    res.send(result)
  })
}
// 返回操作日志列表长度
exports.getoperationLog_length=(req,res)=>{
  const sql='select * from operation_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
    res.send({length:result.length})
  })
}
// 监听换页返回数据
exports.getoperationLog_page=(req,res)=>{
  const page=req.body.page
  const limit=req.body.limit
  const start=(page-1)*limit
   const sql =
    `SELECT * FROM operation_log ORDER BY operation_time asc LIMIT ${limit} OFFSET ${start}`
    db.query(sql,(err,result)=>{
      if(err) return res.cc(err)
        res.send(result)
    })
    
}
// 清空日志表
exports.clearoperationLog=(req,res)=>{
  const sql='truncate table operation_log'
  db.query(sql,(err,result)=>{
    if(err) return res.cc(err)
      res.cc('清空成功',0)
  })
}
// 搜索最近10条操作记录
exports.getoperationLog_search=(req,res)=>{
  const operation_person=req.body.operation_person
  const sql='select * from operation_log where operation_person=? ORDER BY operation_time asc LIMIT 10'
  db.query(sql,operation_person,(err,result)=>{
    if(err) return res.cc(err)
    res.send(result)
  })
}