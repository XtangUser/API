// 导入数据库
const db = require("../db/index")
// 产品入库-创建产品
exports.createProduct = (req, res) => {
  const {
    product_id,
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    product_create_person,
    in_memo,
  } = req.body
  // 产品创建时间
  const product_create_time = new Date()
  // 产品总价
  const product_all_price = product_inwarehouse_number * product_single_price
  // 防止新建id重复
  const sql0 = "SELECT * FROM product WHERE product_id=?"
  db.query(sql0, product_id, (err, results) => {
    if (err) return res.cc(err)
    // 判断id是否重复
    if (results.length !== 0) return res.cc("产品id重复!")
    // 插入数据库
    const sql = "INSERT INTO product SET ?"
    db.query(
      sql,
      {
        product_id,
        product_name,
        product_category,
        product_unit,
        product_inwarehouse_number,
        product_single_price,
        product_create_person,
        product_create_time,
        product_all_price,
        in_memo,
      },
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc
        res.send({
          status: 0,
          message: "创建产品成功！",
        })
      }
    )
  })
}
// 删除产品
exports.deleteProduct = (req, res) => {
  const { product_id } = req.body
  const sql = "DELETE FROM product WHERE product_id=?"
  db.query(sql, product_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc
    res.send({
      status: 0,
      message: "删除产品成功！",
    })
  })
}
// 编辑产品信息
exports.editProduct = (req, res) => {
  const {
    id,
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    in_memo,
  } = req.body
  // 产品创建时间
  const product_update_time = new Date()
  // 产品总价
  const product_all_price = product_inwarehouse_number * product_single_price
  // 更新数据库
  const sql =
    "UPDATE product SET product_name=?,product_category=?,product_unit=?,product_inwarehouse_number=?,product_single_price=?,product_all_price=?,in_memo=?,product_update_time=? WHERE id=?"
  db.query(
    sql,
    [
      product_name,
      product_category,
      product_unit,
      product_inwarehouse_number,
      product_single_price,
      product_all_price,
      in_memo,
      product_update_time,
      id,
    ],
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc
      res.send({
        status: 0,
        message: "编辑产品成功！",
      })
    }
  )
}
// 获取产品列表
exports.getProductList = (req, res) => {
  // 获取产品在库数量大于0的产品
  const sql = "SELECT * FROM product where product_inwarehouse_number>=0"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "获取产品列表成功！",
      data: results,
    })
  })
}
// 产品申请出库
exports.outProduct = (req, res) => {
  const product_out_status = "申请出库"
  const {
    id,
    product_out_id,
    product_single_price,
    product_out_number,
    product_inwarehouse_number,
    product_out_apply_person,
    apply_memo,
  } = req.body
  // 出库时间
  const product_apply_time = new Date()
  if (
    product_inwarehouse_number <= 0 ||
    product_out_number > product_inwarehouse_number
  ) {
    return res.cc("库存不足！")
  }
  // 出库价格
  const product_out_price = product_single_price * product_out_number
  //判断出库编号是否存在
  const sql0 = "SELECT * FROM outproduct WHERE product_out_id=?"
  db.query(sql0, product_out_id, (err, results) => {
    if (err) return res.cc(err)
    // 判断id是否重复
    if (results.length !== 0) return res.cc("产品出库编号重复!")
    // 更新数据库
    const sql =
      "UPDATE product SET product_out_status=?,product_out_id=?,product_out_number=?,product_out_price=?,product_out_apply_person=?,product_apply_time=?,apply_memo=? WHERE id=?"
    db.query(
      sql,
      [
        product_out_status,
        product_out_id,
        product_out_number,
        product_out_price,
        product_out_apply_person,
        product_apply_time,
        apply_memo,
        id,
      ],
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc
        res.send({
          status: 0,
          message: "申请出库成功！",
        })
      }
    )
  })
}
// 产品审核列表(产品审核状态分为：申请出库 or 否决)
exports.getProductAuditList = (req, res) => {
  const sql =
    'SELECT * FROM product where product_out_status="申请出库" || product_out_status="否决" '
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: "获取产品审核列表成功！",
      data: results,
    })
  })
}
// 产品审核过程
exports.auditProduct = (req, res) => {
  // 从请求对象中获取参数
  const {
    id,
    product_out_id,
    product_out_status,
    product_name,
    product_out_audit_person,
    product_out_apply_person,
    product_inwarehouse_number,
    product_single_price,
    product_out_number,
    product_apply_time,
    audit_memo,
  } = req.body
  //审核时间
  const product_audit_time = new Date()
  // 通过库存状态进行判断
  if (product_out_status == "同意") {
    // 产品出库总价
    const product_out_price = product_out_number * product_single_price
    // 新的库存数量
    const newWarehouseNumber = product_inwarehouse_number - product_out_number
    // 新的库存总价
    const product_all_price = newWarehouseNumber * product_single_price
    // 使用插入语句插入数据库outproduct
    const sql = "INSERT INTO outproduct SET ?"
    db.query(
      sql,
      {
        product_out_id,
        product_apply_time,
        product_name,
        product_out_status,
        product_out_number,
        product_out_price,
        product_out_audit_person,
        product_out_apply_person,
        product_audit_time,
        audit_memo,
      },
      (err, results) => {
        if (err) return res.cc(err)
        // 将数据库product中的出库数据置为null
        const sql1 =
          "UPDATE product SET product_out_status=?,product_out_id=?,product_out_number=?,product_out_price=?,product_out_audit_person=?,product_audit_time=?,apply_memo=?,product_inwarehouse_number=?,product_all_price=? WHERE id=?"
        db.query(
          sql1,
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            newWarehouseNumber,
            product_all_price,
            id,
          ],
          (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc
            res.send({
              status: 0,
              message: "同意出库成功！",
            })
          }
        )
      }
    )
  }
  // 如果为否决
  if (product_out_status == "否决") {
    // 状态不改变，根据id更新数据库product中的原因audit_memo
    const sql =
      "UPDATE product SET audit_memo=?,product_out_status=?,product_audit_time=? WHERE id=?"
    db.query(
      sql,
      [audit_memo, product_out_status, product_audit_time, id],
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc
        res.send({
          status: 0,
          message: "拒绝出库成功！",
        })
      }
    )
  }
}
// 通过入库编号对产品进行搜索
exports.searchProduct = (req, res) => {
  const { product_id } = req.body
  const sql = "SELECT * FROM product WHERE product_id=?"
  db.query(sql, product_id, (err, results) => {
    if (err) return res.cc(err)
    if (!results) return res.cc("未找到该入库编号！")
    res.send(results)
  })
}
// 通过出库编号对产品进行搜索
exports.searchProductOut = (req, res) => {
  const { product_out_id } = req.body
  const sql = "SELECT * FROM outproduct WHERE product_out_id=?"
  db.query(sql, product_out_id, (err, results) => {
    if (err) return res.cc(err)
    if (!results) return res.cc("未找到该入库编号！")
    res.send(results)
  })
}
// 通过出库申请编号对产品进行搜索
exports.searchProductAudit = (req, res) => {
  const { product_out_id } = req.body
  const sql = "SELECT * FROM product WHERE product_out_id=?"
  db.query(sql, product_out_id, (err, results) => {
    if (err) return res.cc(err)
    if (!results[0]) return res.cc("未找到该入库编号！")
    res.send(results)
  })
}
// 撤回出库申请
exports.recallProduct = (req, res) => {
  const { id } = req.body
  // 将数据表内容置为null
  db.query(
    "UPDATE product SET product_out_status=?,product_out_id=?,product_out_number=?,product_out_price=?,product_out_apply_person=?,product_apply_time=?,apply_memo=? WHERE id=?",
    ["", null, null, null, null, null, null, id],
    (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: "撤回成功！",
      })
    }
  )
}
// 获取产品状态为空产品列表总长度
exports.getProductLength = (req, res) => {
  const sql =
    "SELECT * FROM product WHERE product_out_status != '申请出库'  OR product_out_status IS NULL"

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err)
      return res.status(500).send({ status: 1, message: "Database error" })
    }
    res.send({
      status: 0,
      length: results.length,
    })
  })
}
// 获取产品状态为申请出库产品列表总长度
exports.getProductAuditLength = (req, res) => {
  const sql = " SELECT * FROM product WHERE product_out_status != '申请出库'"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      length: results.length,
    })
  })
}
// 获取出库产品长度
exports.getProductOutLength = (req, res) => {
  const sql = "SELECT * FROM outproduct"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      length: results.length,
    })
  })
}
// 获取出库产品
exports.getProductOutnum = (req, res) => {
  const sql = "SELECT * FROM outproduct"
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 产品页面根据产品状态为null，监听换页返回数据
exports.getProduct = (req, res) => {
  const { page } = req.body
  const number = (page - 1) * 10
  const limit = 10
  // SQL 查询语句
  const sql =
    "SELECT * FROM product WHERE product_inwarehouse_number >= 0 ORDER BY product_create_time LIMIT ? OFFSET ?"
  // 执行查询
  db.query(sql, [limit, number], (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 申请出库页面根据产品状态不为null，监听换页返回数据
exports.getProductAudit = (req, res) => {
  const { page } = req.body
  const limit = 10
  const number = (page - 1) * limit // 计算偏移量

  // SQL 查询语句
  const sql =
    "SELECT * FROM product WHERE product_out_status IN(?, ?) ORDER BY product_apply_time LIMIT ? OFFSET ?"

  // 执行查询
  db.query(sql, ["申请出库", "否决", limit, number], (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
// 出库页面根据产品状态为同意，监听换页返回数据
exports.getProductOut = (req, res) => {
  const { page } = req.body
  const number = (page - 1) * 10
  const limit = 10
  // 根据添加时间排序sql语句
  const sql =
    "SELECT * FROM outproduct ORDER BY product_audit_time LIMIT ? offset ?"
  db.query(sql, [limit, number], (err, results) => {
    if (err) return res.cc(err)
    res.send(results)
  })
}
