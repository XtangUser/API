// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const login_log_handler=require('../router_handler/login_log')
// 登录日志loginLog
router.post('/loginLog',login_log_handler.loginLog)
// 获取登录日志getLoginLog
router.post('/getLoginLog',login_log_handler.getLoginLog)
// 返回登陆日志列表长度getLoginLog_length
router.post('/getLoginLog_length',login_log_handler.getLoginLog_length)
// 监听换页返回数据getLoginLog_page
router.post('/getLoginLog_page',login_log_handler.getLoginLog_page)
// 清空日志表clearLoginLog
router.post('/clearLoginLog',login_log_handler.clearLoginLog)
// 根据账号搜最近10条登陆记录getLoginLog_account
router.post('/getLoginLog_account',login_log_handler.getLoginLog_account)
// 向外暴露路由
module.exports=router