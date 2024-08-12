// 修改用户信息验证
// 导入中间件
const joi = require("joi")

// string字符串
//alphanum值为a-z A-Z 0-9
//min是最小长度，max是最大长度
//require是必填项
//pattern是正则

//姓名的验证
const name = joi
  .string()
  .pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/)
//账号的验证
const account = joi.string().alphanum().min(6).max(12).required()
// 邮箱的验证
const email = joi
  .string()
  .pattern(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
  .required()
// id
const id = joi.required()
// 性别
const sex = joi.string().pattern(/^(男|女){1}$/)
// 新旧密码
const oldPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
  .min(6)
  .max(12)
  .required()
const newPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
  .min(6)
  .max(12)
  .required()
// 修改用户信息
exports.user_limit = {
  // 表示对req.body中的数据进行验证
  body: {
    name,
    email,
    id,
    sex,
  },
}
// 修改密码
exports.password_limit = {
  body: {
    id,
    oldPassword,
    newPassword,
  },
}
// 忘记密码
exports.forgetPassword_limit = {
  body: {
    account,
    email,
  },
}
// 登录页修改密码
exports.changePlogin_limit = {
  body: {
    account,
  newPassword
  },
}