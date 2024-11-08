// 系统设置模块
// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const product_handler=require('../router_handler/product')
// 添加产品
router.post('/createProduct',product_handler.createProduct)
// 编辑产品
router.post('/editProduct',product_handler.editProduct)
// 获取产品列表
router.post('/getProductList',product_handler.getProductList)
// 产品出库
router.post('/outProduct',product_handler.outProduct)
// 获取产品审核列表
router.post('/getProductAuditList',product_handler.getProductAuditList)
// 审核产品
router.post('/auditProduct',product_handler.auditProduct)
// 入库搜索
router.post('/searchProduct',product_handler.searchProduct)
// 出库搜索
router.post('/searchProductOut',product_handler.searchProductOut)
// 出库申请搜索
router.post('/searchProductAudit',product_handler.searchProductAudit)
// 删除产品
router.post('/deleteProduct',product_handler.deleteProduct)
// 撤回出库申请
router.post('/recallProduct',product_handler.recallProduct)
// 获取产品出库列表
router.post('/getProductLength',product_handler.getProductLength)
// 获取产品状态为申请出库产品列表总长度
router.post('/getProductAuditLength',product_handler.getProductAuditLength)
// 获取出库产品总数
router.post('/getProductOutLength',product_handler.getProductOutLength)
// 获取产品状态为同意产品列表
router.post('/getProductOutnum',product_handler.getProductOutnum)
// 产品页面根据产品状态为null，监听换页返回数据
router.post('/getProduct',product_handler.getProduct)
// 申请出库页面根据产品状态不为null，监听换页返回数据
router.post('/getProductAudit',product_handler.getProductAudit)
// 申请出库页面根据产品状态不为null，监听换页返回数据
router.post('/getProductOut',product_handler.getProductOut)
// 出库页面根据产品状态为同意，监听换页返回数据
router.post('/getProductOut',product_handler.getProductOut)
// 向外暴露路由
module.exports=router