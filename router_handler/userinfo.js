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
      return res.cc("原密码错误")
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
    result[0].password = " "
    res.send(result)
  })
}
// 修改用户信息
exports.changeUser = (req, res) => {
  const userdata = {}
  // 遍历req.body中的所有属性
  Object.keys(req.body).forEach((key) => {
    // 检查属性值是否不为空
    if (req.body[key] !== null && req.body[key] !== undefined) {
      // 将不为空的属性添加到userdata对象中
      userdata[key] = req.body[key]
    }
  })
  const { id, name, sex, email } = userdata
  const sql = "update users set ? where id=?"
  db.query(sql, [{ name, sex, email }, id], (err, results) => {
    if (err) return res.cc(err)
    res.cc("修改成功", 0)
  })
}
// 忘记密码
exports.forgetPassword = (req, res) => {
  const { account, email } = req.body
  const sql = "SELECT * FROM users WHERE account = ?" // 根据account查询
  db.query(sql, account, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      // 如果结果存在，说明account存在
      const sql1 = "select email from users where account = ?"
      db.query(sql1, account, (err, result) => {
        if (err) return res.cc(err)
        if (result[0].email && email == result[0].email) {
          res.cc("认证成功", 0)
        } else {
          return res.cc("认证失败！")
        }
      })
    } else {
      // 如果结果为空，说明account不存在
      res.cc("账号不存在或者输入错误!")
    }
  })
}
//登录页修改密码

exports.changePlogin = (req, res) => {
  const user = req.body
  // 调用brcyptjs中间件(函数第一个参数密码，第二个参数是加密长度)
  user.newPassword = bcryptjs.hashSync(user.newPassword, 10)
  const sql1 = "update users set password =? where account=? "
  db.query(sql1, [user.newPassword, user.account], (err, result) => {
    if (err) return res.cc(err)
    res.cc("修改成功", 0)
  })
}
//----------------------------用户管理------------------------------
// 对添加管理员（内部注册账号）
exports.addPUser = (req, res) => {
  const { account, password, name, sex, department, email, identify } = req.body
  const sql = "select * from users where account = ?"
  db.query(sql, account, (err, results) => {
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: "账号已经存在！",
      })
    }
    // 调用brcyptjs中间件(函数第一个参数密码，第二个参数是加密长度)
    const hashpassword = bcryptjs.hashSync(password, 10)
    const sql1 = "insert into users set ?"
    // 创建时间
    const create_time = new Date()
    db.query(
      sql1,
      {
        account,
        password: hashpassword,
        name,
        sex,
        department,
        email,
        identify,
        // 创建时间
        create_time,
        // 初始状态未冻结状态未0
        status: 0,
      },
      (err, results) => {
        // 第一个插入失败
        // affectedRows为影响行数 不为1为失败
        if (results.affectedRows != 1) {
          return res.send({
            status: 1,
            message: "添加失败！",
          })
        }
        res.send({
          status: 0,
          message: "添加成功！",
        })
      }
    )
  })
}
// 获取管理员列表
exports.getPUser = (req, res) => {
  const sql = "select * from users where identify = ?"
  db.query(sql, req.body.identify, (err, results) => {
    if (err) res.cc(err)
    results.forEach((e) => {
      e.password = ""
      e.image_url = ""
      e.status = ""
      e.create_time = ""
    })
    res.send(results)
  })
}
//编辑管理员信息成功
exports.editPUser = (req, res) => {
  const { id, name, sex, email, department, identify } = req.body
  const update_time = new Date()
  // 通过id筛选用户表里面的部门
  const sql1 = "select department from users where id = ?"
  db.query(sql1, id, (err, result) => {
    if (err) res.cc(err)
    // 如果部门没有改变，直接修改
    if (result[0].department == department) {
      const sql =
      "UPDATE users SET name = ?, sex = ?, email = ?, department = ?, update_time = ?,identify = ? WHERE id = ?"
    db.query(
      sql,
      [name, sex, email, department, update_time, identify, id],
      (err, result) => {
        if (err) res.cc(err)
        res.cc("修改成功", 0)
      }
    )
    }
    else{
      const sql =
      "UPDATE users SET name = ?, sex = ?, email = ?, department = ?, update_time = ?,identify = ?,read_status=?,read_list=? WHERE id = ?"
    db.query(
      sql,
      [name, sex, email, department, update_time, identify, id,0,null],
      (err, result) => {
        if (err) res.cc(err)
        res.cc("修改成功", 0)
      }
    )
    }
  })

}
// 对管理员取消赋权
exports.cancelPuser = (req, res) => {
  const identify = "用户"
  const sql = "update users set identify= ? where id = ?"
  db.query(sql, [identify, req.body.id], (err, result) => {
    if (err) res.cc(err)
    res.cc("解除赋权成功！", 0)
  })
}
// 对管理员进行赋权
exports.givePuser = (req, res) => {
  const identify = req.body.identify
  const time=new Date()
  const sql = "update users set identify= ?,update_time = ? where id = ?"
  db.query(sql, [identify,time, req.body.id], (err, result) => {
    if (err) res.cc(err)
    res.cc("赋权成功！", 0)
  })
}
// 对用户进行搜索
exports.searchPuser = (req, res) => {
  const sql = "select * from users where account = ?"
  db.query(sql, req.body.account, (err, result) => {
    if (err) res.cc(err)
    result.forEach((e) => {
      e.password = ""
      e.image_url = ""
      e.status = ""
      e.create_time = ""
    })
    res.send(result)
  })
}
// 通过department对用户进行搜索
exports.searchDepartuser = (req, res) => {
  const sql = "select * from users where department = ? and identify= '用户' "
  db.query(sql, req.body.department, (err, result) => {
    if (err) res.cc(err)
    result.forEach((e) => {
      e.password = ""
      e.image_url = ""
      e.status = ""
      e.create_time = ""
    })
    res.send(result)
  })
}
// 冻结用户
exports.icePuser = (req, res) => {
  const status = 1
  const sql = "update users set status= ? where id = ?"
  db.query(sql, [status, req.body.id], (err, result) => {
    if (err) res.cc(err)
    res.cc("冻结成功",0 )
  })
}

// 解冻用户
exports.ProtectPuser = (req, res) => {
  const status = 0
  const sql = "update users set status = ? where id = ?"
  db.query(sql, [status, req.body.id], (err, result) => {
    if (err) res.cc(err)
    res.cc("解冻成功" ,0)
  })
}

// 获取冻结用户列表
exports.geticePuser = (req, res) => {
  const status = 1
  const sql = "select * from users where status = ?"
  db.query(sql, status, (err, result) => {
    if (err) res.cc(err)
    return res.send(result)
  })
}
// 删除用户列表
exports.deletePuser = (req, res) => {
  const sql = "delete from users where id = ?"
  db.query(sql, req.body.id, (err, result) => {
    if (err) res.cc(err)
    const sql2 = "delete  from image where account = ?"
    db.query(sql2, req.body.account, (err, result) => {
      if (err) res.cc(err)
      res.cc("删除成功", 0)
    })
  })
}
// ----------管理用户页面的分页逻辑---------
// 获取对应身份的一个总人数identify
exports.getPuserListLength = (req, res) => {
  const sql = "select * from users where identify = ?"
  db.query(sql, req.body.identify, (err, result) => {
    if (err) res.cc(err)
    res.send({
      length: result.length,
    })
  })
}
//监听换页返回的数据 页码pager，identify
exports.returnListData= (req, res) => {
  const number=(req.body.pager-1)*2
  // limit 为截取多少数据，offset为从何处开始截取
  const sql = `select * from users where identify = ? limit 2 offset ${number}`
  db.query(sql, [req.body.identify,number], (err, result) => {
    if (err) res.cc(err)
      result.map(item=>{
    item.password=''
    })
    res.send(result)
  })
}
