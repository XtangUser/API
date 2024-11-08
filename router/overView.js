// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
// 导入login的路由处理模块
const view_handler = require('../router_handler/overView')
// 获取产品类别和总价
router.post('/getCategoryAndNumber', view_handler.getCategoryAndNumber)
// 获取不同角色与数量
router.post('/getAdminAndNumber', view_handler.getAdminAndNumber)
// 获取不同消息等级与数量
router.post('/getLevelAndNumber', view_handler.getLevelAndNumber)
// 返回每天登录人数
router.post('/getDayAndNumber', view_handler.getDayAndNumber)
// 向外暴露路由
module.exports = router
// 向外暴露路由
module.exports=router