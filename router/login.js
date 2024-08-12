//登录路由模块文件
// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
// 引入路由处理函数
const expressjoi=require('@escook/express-joi')
// 导入验证规则
const {login_limit}=require('../limit/login')
const login_handler=require('../router_handler/login')
// 注册
router.post('/register',expressjoi(login_limit),login_handler.register)
// 登录
router.post('/login',expressjoi(login_limit),login_handler.login)
// 向外暴露路由
module.exports=router