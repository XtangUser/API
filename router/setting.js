// 系统设置模块
// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const setting_handler=require('../router_handler/setting')
// 上传轮播图
router.post('/uploadSwiper',setting_handler.uploadSwiper)
// 获取所有轮播图
router.post('/getAllSwiper',setting_handler.getAllSwiper)
//获取公司名称
router.post('/getCompanyName',setting_handler.getCompanyName)
//获取公司名称
router.post('/changeCompanyName',setting_handler.changeCompanyName)
//编辑公司
router.post('/changeCompanyIntroduce',setting_handler.changeCompanyIntroduce)
//获取公司介绍
router.post('/getCompanyintroce',setting_handler.getCompanyintroce)
//获取所有公司信息
router.post('/getAllCompanyMsg',setting_handler.getAllCompanyMsg)
//获取部门
router.post('/getDepartments',setting_handler.getDepartments)
// 设置部门
router.post('/setDepartment',setting_handler.setDepartment)
//获取产品
router.post('/getProducts',setting_handler.getProducts)
// 设置产品
router.post('/setProducts',setting_handler.setProducts)
// 向外暴露路由
module.exports=router