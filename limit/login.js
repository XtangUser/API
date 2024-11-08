// 登录和注册验证
// 导入中间件
const joi=require('joi')

// string字符串
//alphanum值为a-z A-Z 0-9
//min是最小长度，max是最大长度
//require是必填项
//pattern是正则

// 账号
const account = joi.string().alphanum().min(6).max(12).required().error(new Error('账号必须是6到12位的字母或数字。'));
// 密码的验证
const password= joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{6,12}$/).required().error(new Error('密码必须是6到12位,且不能全为数字。'));

exports.login_limit={
  // 表示对req.body中的数据进行验证
  body:{
    account,
    password
  }
}