// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const msg_handler=require('../router_handler/message')
// 发布消息
router.post('/addMessage',msg_handler.addMessage)
// 发布系统消息
router.post('/addSystemMessage',msg_handler.addSystemMessage)
// 获取公司信息列表
router.post('/getCompanyMessageList',msg_handler.getCompanyMessageList)
// 获取系统消息列表
router.post('/getSystemMessageList',msg_handler.getSystemMessageList)
// 编辑公司公告
router.post('/editCompanyMessage',msg_handler.editCompanyMessage)
// 编辑系统公告
router.post('/editSystemMessage',msg_handler.editSystemMessage)
// 根据发布部门进行搜索
router.post('/searchMessageByDepartment',msg_handler.searchMessageByDepartment)
// 根据发布等级进行搜索
router.post('/searchMessageByLevel',msg_handler.searchMessageByLevel)
// 根据id和获取数据
router.post('/getMessageById',msg_handler.getMessageById)
// 更新点击数
router.post('/updateClickNumber',msg_handler.updateClickNumber)
// 初次删除
router.post('/deleteMessageFirst',msg_handler.deleteMessageFirst)
// 还原操作
router.post('/deleteMessageBack',msg_handler.deleteMessageBack)
// 获取回收站列表
router.post('/getDeleteMessageList',msg_handler.getDeleteMessageList)
// 删除操作
router.post('/deleteMessage',msg_handler.deleteMessage)
// 获取系统消息总数
router.post('/getSystemMessageTotal',msg_handler.getSystemMessageTotal)
// 获取公司公告列表
router.post('/get_CompanyMessageTotal',msg_handler.get_CompanyMessageTotal)
//getMessageList
router.post('/getMessageList',msg_handler.getMessageList)
// getSystem_MessageList
router.post('/getSystem_MessageList',msg_handler.getSystem_MessageList)
// getDeleteMessageListPage
router.post('/getDeleteMessageListPage',msg_handler.getDeleteMessageListPage)
// 导出
module.exports=router