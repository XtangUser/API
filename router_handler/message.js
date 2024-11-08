// 导入数据库
const db = require("../db/index")
/**
 *  message_title              varchar(255) null,
    message_category           varchar(255) null comment '消息类别',
    message_publish_department varchar(255) null comment '发布消息部门',
    message_publish_name       varchar(255) null comment '消息发布者',
    message_receipt_object     varchar(255) null comment '消息接收者',
    message_click_number       int          null comment '消息查看数量',
    message_content            varchar(255) null comment '消息内容',
    message_create_time        varchar(255) null comment '消息发布时间',
    message_update             varchar(255) null comment '消息更新时间',
    message_level              varchar(255) null comment '消息等级',
    message_status             int          null comment '默认为0，1在回收站',
    message_delete_time        varchar(255) null comment '消息删除时间'
 */
// 发布消息
exports.addMessage = (req, res) => {
  const {
    message_title,
    message_category,
    message_publish_department,
    message_publish_name,
    message_receipt_object,
    message_content,
    message_level,
  } = req.body
  const message_create_time = new Date()
  const sql = "insert into message set ? "
  db.query(
    sql,
    {
      message_title,
      message_category,
      message_publish_department,
      message_publish_name,
      message_click_number: 0,
      message_receipt_object,
      message_status: 0,
      message_content,
      message_level,
      message_create_time,
    },
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("发布消息失败！")
        res.send({
          status: 0,
          message: '发布消息成功',
          department: message_receipt_object,
          id: results.insertId
        })
    }
  )
}
// 发布系统消息
exports.addSystemMessage = (req, res) => {
  const {
    message_title,
    message_category,
    message_publish_name,
    message_content,
  } = req.body
  const message_create_time = new Date()
  const sql = "insert into message set ? "
  db.query(
    sql,
    {
      message_title,
      message_category,
      message_publish_name,
      message_content,
      message_create_time,
      message_status: 0,
      message_click_number:0,
    },
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("发布系统消息失败！")
      res.cc("发布系统消息成功！", 0)
    }
  )
}
// 获取公司消息列表
exports.getCompanyMessageList = (req, res) => {
  const sql =
    "select * from message where message_status=0 && message_category = '公司公告'"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 获取系统消息列表
exports.getSystemMessageList = (req, res) => {
  const sql = "SELECT * FROM message WHERE message_status = ? AND message_category = ?";
  db.query(sql, [0, '系统消息'], (err, results) => {
    if (err) {
      console.error('Error fetching system messages:', err);
      return res.status(500).send({ error: 'Failed to fetch system messages' });
    }
    res.send(results);
  });
};
// 编辑公司公告
exports.editCompanyMessage = (req, res) => {
  const {
    message_title,
    message_content,
    message_receipt_object,
    message_level,
    message_category,
    message_publish_department,
    message_publish_name,
    id,
  } = req.body
  // 消息更新时间
  const message_update_time = new Date()
  const sql =
    "update message set message_title=?,message_content=?,message_receipt_object=?,message_level=?,message_category=?,message_publish_department=?,message_publish_name=?,message_update_time=? where id=?"
  db.query(
    sql,
    [
      message_title,
      message_content,
      message_receipt_object,
      message_level,
      message_category,
      message_publish_department,
      message_publish_name,
      message_update_time,
      id,
    ],
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("编辑公司公告失败！")
      res.cc("编辑公司公告成功！", 0)
    }
  )
}
// 编辑系统消息
exports.editSystemMessage = (req, res) => {
  const {
    message_title,
    message_content,
    message_category,
    message_publish_name,
    id,
  } = req.body
  // 消息更新时间
  const message_update_time = new Date()
  const sql =
    "update message set message_title=?,message_content=?,message_category=?,message_publish_name=?,message_update_time=? where id=?"
  db.query(
    sql,
    [message_title, message_content, message_category, message_publish_name, message_update_time, id],
    (err, results) => {
      if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc("编辑系统消息失败！")
        res.cc("编辑系统消息成功！", 0)
    }
  )
}
// 根据发布部门进行搜索
exports.searchMessageByDepartment = (req, res) => {
  const { message_publish_department } = req.body
  const sql =
    "select * from message where message_publish_department=? and message_status=0"
  db.query(sql, message_publish_department, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 根据发布等级进行搜索
exports.searchMessageByLevel = (req, res) => {
  const { message_level } = req.body
  const sql = "select * from message where message_level=? && message_status=0"
  db.query(sql, message_level, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 根据id获取消息
exports.getMessageById = (req, res) => {
  const { id } = req.body
  const sql = "select * from message where id=?"
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 更新点击数
exports.updateClickNumber = (req, res) => {
  const { id } = req.body
  const sql =
    "update message set message_click_number=message_click_number+1 where id=?"
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.cc("更新点击数成功！", 0)
  })
}
// 初次删除
exports.deleteMessageFirst = (req, res) => {
  const { id } = req.body

  // 记录删除时间
  const message_delete_time = new Date()

  // 确保 message_status 是数字类型
  const message_status = 1

  // 更新SQL语句，修正多余逗号问题
  const sql =
    "UPDATE message SET message_status=?, message_delete_time=? WHERE id=?"

  // 执行数据库操作
  db.query(sql, [message_status, message_delete_time, id], (err, results) => {
    if (err) {
      // 更具体的错误处理
      console.error("Database query error:", err)
      return res.status(500).json({ error: "Internal server error" })
    }

    // 检查是否成功更新记录
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found" })
    }

    // 成功响应
    res.json({ message: "删除成功！" })
  })
}
// 还原操作
exports.deleteMessageBack = (req, res) => {
  const { id } = req.body
  const sql = "update message set message_status=0 where id=?"
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.cc("还原成功！", 0)
  })
}
// 获取回收站列表
exports.getDeleteMessageList = (req, res) => {
  const sql = "select * from message where message_status=1"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 删除操作
exports.deleteMessage = (req, res) => {
  const { id } = req.body
  const sql = 'DELETE FROM message WHERE id = ?';
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.cc("删除成功！", 0)
  })
}
// 获取公司公告列表总数
exports.get_CompanyMessageTotal= (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM message WHERE message_status = 0 AND message_category = '公司公告'";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to fetch company messages' });
    }
    res.send(results[0]);
  })
}
// 获取系统消息总数
exports.getSystemMessageTotal = (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM message WHERE message_status = 0 AND message_category = '系统消息'";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to fetch system message total' });
    }
    res.send(results[0]);
  })
}
//监听换页返回数据，通过创建的时间
exports.getMessageList = (req, res) => {
  const { page, limit } = req.body
  const number = (page - 1) * limit
  const sql =
    `SELECT * FROM message WHERE message_category = '公司公告' and message_status=0 ORDER BY message_create_time  DESC LIMIT ${limit} OFFSET ${number}`
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      res.send(results)
    })
}
// 获取系统消息列表(分页)
exports.getSystem_MessageList = (req, res) => {
  const { page, limit } = req.body
  const number = (page - 1) * limit
  const sql =
    `SELECT * FROM message WHERE message_category = '系统消息' and message_status=0 ORDER BY message_create_time  DESC LIMIT ${limit} OFFSET ${number}`
    db.query(sql,(err, results) => {
      if (err) return res.cc(err)
      res.send(results)
    })
}
// 获取回收站消息列表分页数据
exports.getDeleteMessageListPage = (req, res) => {
  const { page, limit } = req.body
  const number = (page - 1) * limit
  const sql =
    `SELECT * FROM message WHERE message_status = 1 ORDER BY message_delete_time DESC LIMIT ${limit} OFFSET ${number}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
      res.send(results)
  })
}