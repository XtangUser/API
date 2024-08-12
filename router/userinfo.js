// 用户详情文件
//导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
// 引入路由处理函数
const expressjoi=require('@escook/express-joi')
const {user_limit,password_limit,forgetPassword_limit,changePlogin_limit}=require('../limit/user')
// 导入处理函数
const userinfo_handler=require('../router_handler/userinfo')

// 上传头像的路由接口
router.post('/uploadAvatar',userinfo_handler.uploadAvatar)
// 修改账号头像的路由接口
router.post('/bindAccount',userinfo_handler.bindAccount)
// 修改密码的路由接口
router.post('/changePassword',expressjoi(password_limit),userinfo_handler.changePassword)
// 获取用户信息的路由接口
router.post('/getUserinfo',userinfo_handler.getUserinfo)
// 修改用户信息的路由接口
router.post('/changeUser',expressjoi(user_limit),userinfo_handler.changeUser)
// 忘记密码的路由接口
router.post('/forgetPassword',expressjoi(forgetPassword_limit),userinfo_handler.forgetPassword)
// 登录页忘记密码
router.post('/changePlogin',expressjoi(changePlogin_limit),userinfo_handler.changePlogin)
// 向外暴露路由
module.exports=router