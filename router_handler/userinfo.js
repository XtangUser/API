// 用户详情处理函数
// 导入数据库
const db = require("../db/index")
// 导入密码加密中间件
const bcryptjs = require("bcryptjs")
// 导入nodejs中的crypto库生成uuid
const crypto = require("crypto")
// 导入fs中间件处理文件
const fs = require("fs")
// 编写上传头像的接口
exports.uploadAvatar = (req, res) => {
  // 生成唯一的标识
  const onlyId = crypto.randomUUID()
  // 拿到文件旧名字
  let oldName = req.files[0].filename
  // 拿到文件新名字转码，防止乱码
  let newName = Buffer.from(req.files[0].originalname, "latin1").toString(
    "utf8"
  )
  // 修改文件的名字
  fs.renameSync("./public/upload/" + oldName, "./public/upload/" + newName)
  const sql = "insert into image set ?"
  db.query(
    sql,
    {
      image_url: `http://127.0.0.1:3007/upload/${newName}`,
      onlyId,
    },
    (err, result) => {
      if (err) return res.cc(err)
      res.send({
        onlyId,
        status: 0,
        url: "http://127.0.0.1:3007/upload/" + newName,
      })
    }
  )
}
// 绑定账号
exports.bindAccount = (req, res) => {
  // 拿到头像的唯一标识和路径
  const { account, onlyId, url } = req.body
  // 更新数据库
  const sql = "update image set account=? where onlyId=?"
  db.query(sql, [account, onlyId], (err, result) => {
    if (err) return res, cc(err)
    if (result.affectedRows == 1) {
      // 更新users表中的头像路径
      const sql1 = "update users set image_url =? where account=?"
      db.query(sql1, [url, account], (err, result) => {
        if (err) return res.cc(err)
        res.cc("修改成功", 0)
      })
    }
  })
}
// 修改密码
exports.changePassword = (req, res) => {
  // 拿到旧密码
  const sql = "select password from users where id= ? "
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err)
    // bcryptjs
    const compareResult = bcryptjs.compareSync(
      req.body.oldPassword,
      result[0].password
    )
    if (!compareResult) {
      res.cc("原密码错误")
    }
    // 第三步对密码进行加密
    // 调用brcyptjs中间件(函数第一个参数密码，第二个参数是加密长度)
    req.body.newPassword = bcryptjs.hashSync(req.body.newPassword, 10)
    const sql1 = "update users set password=? where id=?"
    db.query(sql1, [req.body.newPassword, req.body.id], (err, result) => {
      if (err) return res.cc(err)
      res.cc("修改成功", 0)
    })
  })
}
// 获取用户信息 接收参数id
exports.getUserinfo = (req, res) => {
  const sql = "select * from users where id=?"
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err)
    res.send(result)
  })
}
// 修改用户信息
exports.changeUser = (req, res) => {
  const { id, name, sex, email } = req.body
  const sql = "update users set ? where id=?"
  db.query(sql, [{ name, sex, email }, id], (err, result) => {
    if (err) return res.cc(err)
    res.cc("修改成功", 0)
  })
}
// 忘记密码
exports.forgetPassword = (req, res) => {
  const { account, email } = req.body
  const sql = "select email from users where account = ?"
  db.query(sql, account, (err, result) => {
    if (err) return res.cc(err)
    if (email == result[0].email) {
      res.cc("查询成功", 0)
    } else {
      res.cc("查询失败")
    }
  })
}
//登录页修改密码

exports.changePlogin = (req, res) => {
  const user =req.body
  // 调用brcyptjs中间件(函数第一个参数密码，第二个参数是加密长度)
  user.newPassword = bcryptjs.hashSync(user.newPassword, 10)
  const sql1 = "update users set password =? where account=? "
  db.query(sql1, [user.newPassword, user.account], (err, result) => {
    if (err) return res.cc(err)
    res.cc("修改成功", 0)
  })
}