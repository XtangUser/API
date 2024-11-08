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
//----------------------------用户管理------------------------------
// 添加管理员用户
router.post('/addPUser',userinfo_handler.addPUser)
//获取管理员列表
router.post('/getPUser',userinfo_handler.getPUser)
// 编辑管理员列表
router.post('/editPUser',userinfo_handler.editPUser)
// 取消赋权
router.post('/cancelPuser',userinfo_handler.cancelPuser)
// 赋权
router.post('/givePuser',userinfo_handler.givePuser)
// 对用户进行搜索
router.post('/searchPuser',userinfo_handler.searchPuser)
// 通过department进行搜索
router.post('/searchDepartuser',userinfo_handler.searchDepartuser)
// 冻结用户
router.post('/icePuser',userinfo_handler.icePuser)
// 解冻用户
router.post('/ProtectPuser',userinfo_handler.ProtectPuser)
// 获取冻结用户列表
router.post('/geticePuser',userinfo_handler.geticePuser)
// 删除用户列表
router.post('/deletePuser',userinfo_handler.deletePuser)
//获取对应身份的一个总人数identify
router.post('/getPuserListLength',userinfo_handler.getPuserListLength)
//监听换页返回的数据 页码pager，identify
router.post('/returnListData',userinfo_handler.returnListData)
// 向外暴露路由
module.exports=router