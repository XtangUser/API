// 登录处理函数模块
// 导入数据库
const db = require("../db/index")
// 导入密码加密中间件
const bcryptjs=require('bcryptjs')
//导入加密和解密的配置文件
const jwt_config = require("../jwt_config/index")
const jwtToken = require('jsonwebtoken')
// 注册与登录函数
exports.register = (req, res) => {
  // req 是前端传过来的数据，也就是request。res是返回给前端的数据，也就是response
  const reginfo = req.body
  // 第一步，判断前端传过来的数据有没有空
  if (!reginfo.account || !reginfo.password) {
    return res.send({
      status: 1,
      message: "账号或者密码不能为空!",
    })
  }
  //第二步，判断前端传过来的账号在数据库中是否存在
  // 需要使用mysql的select语句
  const sql = "select * from users where account = ?"
  db.query(sql, reginfo.account, (err, results) => {
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: "账号已经存在！",
      })
    }
    // 第三步对密码进行加密
    // 调用brcyptjs中间件(函数第一个参数密码，第二个参数是加密长度)
    reginfo.password = bcryptjs.hashSync(reginfo.password, 10)
    const sql1 = "insert into users set ?"
    // 注册身份
    const identify = "用户"
    // 创建时间
    const create_time = new Date()
    db.query(
      sql1,
      {
        account: reginfo.account,
        password: reginfo.password,
        // 身份
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
            message: "注册账号失败！",
          })
        }
        res.send({
          status: 0,
          message: "注册账号成功！",
        })
      }
    )
  })
}
// 登录
exports.login = (req, res) => {
  // 将登录密码和账号拿过来
  const loginfo=req.body
  //第一步 查看数据表有没有前端传过来的账号
  const sql03='select * from users where account = ?'
  db.query(sql03,loginfo.account,(err,results)=>{
    // 执行sql语句失败的情况 一般在数据库断开的情况下会执行失败
    if(err) return res.cc(err)
    if(results.length!=1) return res.cc('账号不存在！请注册后再登陆')
      // 第二部 对前端传过来的密码进行解密
      const compareResult=bcryptjs.compareSync(loginfo.password,results[0].password)
      if(!compareResult){
        return res.cc('密码错误！')
      }
      if(results[0].status==1){
        return res.cc('账号被冻结')
      }
      // 第四步，生成返回给前端的token
      //剔除加密后的密码，头像，创建时间，更新时间
      const user={
        ...results[0],
        password:'',
        imageUrl:'',
        create_time:'',
        update_time:'',
      }
      // 设置token的有效时长
      // const tokenStr=jwtToken.sign(user,jwt_config.jwtSecretKey,
      //   {
      //     expirseIn:'7h'
      //   })
      const tokenStr = jwtToken.sign(
        user, 
        jwt_config.jwtSecretKey, 
        { expiresIn: '7h', algorithm: 'HS256' } // 正确用法
      );
      res.send({
        results:results[0],
        status:0,
        message:'登陆成功！',
        token:'Bearer '+tokenStr
      })

   
  })

}
