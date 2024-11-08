// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const operation_log_handler=require('../router_handler/operation_log')
// 登录日志operationLog
router.post('/operationLog',operation_log_handler.operationLog)
// 获取登录日志getoperationLog
router.post('/getoperationLog',operation_log_handler.getoperationLog)
// 返回登陆日志列表长度getoperationLog_length
router.post('/getoperationLog_length',operation_log_handler.getoperationLog_length)
// 监听换页返回数据getoperationLog_page
router.post('/getoperationLog_page',operation_log_handler.getoperationLog_page)
// 清空日志表clearoperationLog
router.post('/clearoperationLog',operation_log_handler.clearoperationLog)
// 搜索最近10条操作记录getoperationLog_search
router.post('/getoperationLog_search',operation_log_handler.getoperationLog_search)
// 向外暴露路由
module.exports=router