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
  .required()
  .error(new Error("姓名必须是2到10个汉字,可以包含最多两个·连接的复姓。"))
// 账号
const account = joi
  .string()
  .alphanum()
  .min(6)
  .max(12)
  .required()
  .error(new Error("账号必须是6到12位的字母或数字。"))
// 邮箱
const email = joi
  .string()
  .pattern(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
  .error(new Error("邮箱格式不正确。"))
// 用户id
const id = joi.required().error(new Error("ID是必填项。"))
// 性别
const sex = joi
  .string()
  .pattern(/^(男|女){1}$/)
  .required()
  .error(new Error("性别必须是“男”或“女”。"))
// 旧密码
const oldPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{6,12}$/)
  .required()
  .error(new Error("旧密码必须是6到12位,且不能全为数字。"))
// 新密码
const newPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{6,12}$/)
  .required()
  .error(new Error("新密码必须是6到12位,且不能全为数字。"))

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
    newPassword,
  },
}
