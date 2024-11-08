// 系统设置函数模块
// 导入数据库
const db = require("../db/index")
// 导入fs中间件处理文件
const fs = require("fs")
// 编写上传轮播图的接口
exports.uploadSwiper = (req, res) => {
  // 拿到文件旧名字
  let oldName = req.files[0].filename
  // 拿到文件新名字转码，防止乱码
  let newName = Buffer.from(req.files[0].originalname, "latin1").toString(
    "utf8"
  )
  // 修改文件的名字
  fs.renameSync("./public/upload/" + oldName, "./public/upload/" + newName)
  const sql = "update setting set set_value=? where set_name=?"
  db.query(
    sql,
    [`http://127.0.0.1:3007/upload/${newName}`, req.body.name],
    (err, result) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: "上传轮播图成功",
      })
    }
  )
}

// 获取所有轮播图
exports.getAllSwiper = (req, res) => {
  // 用like关键字匹配字段是否符合
  const sql = "select * from setting where set_name like 'swiper%' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    let arr = []
    result.forEach((item) => {
      arr.push(item.set_value)
    })
    res.send({
      status: 0,
      arr,
    })
  })
}

// 获取公司名称
exports.getCompanyName = (req, res) => {
  const sql = "select * from setting where set_name='公司名称' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      companyName: result[0].set_value,
    })
  })
}
// 修改公司名称
exports.changeCompanyName = (req, res) => {
  const companyName = req.body.companyName
  const sql = "update setting set  set_value= ? where set_name='公司名称' "
  db.query(sql, companyName, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "修改成功",
    })
  })
}

// 编辑公司介绍的接口
exports.changeCompanyIntroduce = (req, res) => {
  const sql = "update setting set set_text = ? where set_name=?"
  db.query(sql, [req.body.set_text, req.body.set_name], (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "修改成功",
    })
  })
}
// 获取公司介绍
exports.getCompanyintroce = (req, res) => {
  const sql = "select * from setting where set_name='公司介绍' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      companyIntroduce: result[0].set_text,
    })
  })
}
// 获取所有公司信息
exports.getAllCompanyMsg = (req, res) => {
  const sql = "select * from setting where set_name like '公司%' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      companyMsg: result,
    })
  })
}
//---------------------------------------部门设置---------------------------------------
//设置部门
exports.setDepartment = (req, res) => {
  const sql = "update setting set  set_value= ? where set_name='部门设置' "
  db.query(sql,req.body.set_value, (err, result) => {
    if (err) return res.cc(err)
    res.cc("更新部门成功", 0)
  })
}
//获取所有部门
exports.getDepartments = (req, res) => {
  const sql = "select set_value from setting where set_name ='部门设置' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: result[0].set_value,
    })
  })
}
// ----------------------------------------产品设置---------------------------------------
// 获取产品列表
exports.getProducts = (req, res) => {
  const sql = "select set_value from setting where set_name ='产品设置' "
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
      res.send({
        status: 0,
        data: result[0].set_value,
      })
  })
}
exports.setProducts = (req, res) => {
  const sql = "update setting set set_value= ? where set_name='产品设置' "
  db.query(sql,req.body.set_value, (err, result) => {
    if (err) return res.cc(err)
    res.cc("更新产品成功", 0)
  })
}