// 导入express框架
const express=require('express')
// 创建路由
const router=express.Router()
const file_handler=require('../router_handler/files')
// uploadFile上传文件
router.post('/uploadFile',file_handler.uploadFile)
// 绑定上传者和文件地址(bindFile)
router.post('/bindFile',file_handler.bindFile)
// updateDownloadNumber下载次数
router.post('/updateDownloadNumber',file_handler.updateDownloadNumber)
// downloadFiles下载文件
router.post('/downloadFiles',file_handler.downloadFiles)
//getFileList获取文件列表
router.post('/getFileList',file_handler.getFileList)
// 删除文件deleteFile
router.post('/deleteFile',file_handler.deleteFile)
// 搜索文件searchFile
router.post('/searchFile',file_handler.searchFile)
// getFileListByPage监听换页
router.post('/getFileListByPage',file_handler.getFileListByPage)
// 向外暴露路由
module.exports=router