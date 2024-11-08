// 导入数据库
const db = require("../db/index")
const fs = require("fs")
const path = require("path")

exports.uploadFile = async (req, res) => {
  // 获取文件旧名字和新名字
  const oldName = req.files[0].filename
  const newName = Buffer.from(req.files[0].originalname, "latin1").toString(
    "utf8"
  )

  // 检查文件名是否已存在
  db.query(
    "SELECT * FROM files WHERE file_name=?",
    [newName],
    (err, result) => {
      if (err) return reject(err)
      if (result.length !== 0) res.cc("文件名重复，请重新命名")
      else {
       // 重命名文件
       const sourcePath = path.join(__dirname, '../public/upload', oldName);
       const targetPath = path.join(__dirname, '../public/upload', newName);
        fs.renameSync(sourcePath, targetPath);
        const fileSizeInKb = Number(req.files[0].size) / 1024; // 确保是数值类型
        // 插入数据库记录
        db.query(
          "INSERT INTO files SET ?",
          {
            file_url: `http://127.0.0.1:3007/upload/${newName}`,
            file_name: newName,
            file_size: `${fileSizeInKb.toFixed(2)} kb`, // 转换为字符串并加上单位
            upload_time: new Date(),
            download_number: 0,
          },
          (err, result) => {
            if (err) return reject(err)
            res.send({
              status: 0,
              url: `http://127.0.0.1:3007/upload/${newName}`,
              data:req.files[0]
            })
          }
        )
      }
    }
  )
}
// 绑定上传者和文件地址(Bindfile)
exports.bindFile = (req, res) => {
  const { file_name, file_url } = req.body
  const sql = "update files set upload_person=? where file_url=?"
  db.query(sql, [file_name, file_url], (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "绑定成功",
    })
  })
}
// 更新下载次数
exports.updateDownloadNumber = (req, res) => {
  const sql = "update files set download_number=download_number+1 where id=?"
  db.query(sql, req.body.id, (err, result) => {
    if(err) return res.cc(err)
const sql1 = "select download_number from files where id=?"
db.query(sql1, req.body.id, (err, result) => {
  if (err) return res.cc(err)
  res.send({
    status: 0,
    message: "下载成功",
    number: result[0].download_number,
  })
})
  })
}
// 下载文件
exports.downloadFiles = (req, res) => {
  const sql = "select * from files where id=?"
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      url: result[0].file_url,
    })
  })
}
// 获取文件列表
exports.getFileList = (req, res) => {
  const sql = "select * from files"
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send(result)
  })
}
// 删除文件
exports.deleteFile = (req, res) => {
  const sql = "delete from files where id=?"
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "删除成功",
    })
  })
}
// 搜索文件
exports.searchFile = (req, res) => {
  const sql = "select * from files where file_name like ?"
  db.query(sql, "%" + req.body.keyword + "%", (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: result,
    })
  })
}
// 文件列表监听换页
exports.getFileListByPage = (req, res) => {
  const { pager, limit } = req.body
  const number = (pager - 1) * limit
  const sql = `SELECT * FROM files ORDER BY upload_time DESC LIMIT ${limit} OFFSET ${number}`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
