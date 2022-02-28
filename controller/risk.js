// 话题标签 增删改查api
const dbConfig = require('../db/dbConfig');
const riskModel = require('../models/risk');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_risks`", { type: QueryTypes.SELECT }); //原始查询

const FindAll = async ctx => {
  const data = await riskModel.findAll({
    order: [
      ['updatedAt', 'DESC']
    ]
  })
  ctx.body = {
    code: 200,
    data
  }
}

const FindOne = async ctx => {
  const params = ctx.request.body;
  console.log('findone', params);
  const data = await riskModel.findAll({
      where: params,
      order: [['updatedAt', 'DESC']],
  });
  ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查询成功' : '查询失败',
      data,
  };
}
//risk话题列表
const blogThemeList = async ctx => {
  const query = ctx.query;

  const queryName = Object.keys(query)[0]
  const where = {}
  where[queryName] = { [Op.eq]: query[queryName]} 
  console.log('queryrisk',query)
  console.log('whererisk',where)
  const { rows: data, count: total } = await riskModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    where,
    offset: (+query.pageNo - 1) * +query.pageSize,//跳过。。个
    limit: +query.pageSize,
    order: [['updatedAt','DESC']]
  });
  ctx.body = {
    code:  200,
    msg:  '列表查询成功',
    data,
    total
  };
}

//列表
const List = async ctx => {
  const query = ctx.query;

  const queryName = Object.keys(query)[0]
  const where = {}
  where[queryName] = { [Op.like]: `%${query[queryName]}%` }
  console.log('queryrisk',query)
  console.log('whererisk',where)
  const { rows: data, count: total } = await riskModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    where,
    offset: (+query.pageNo - 1) * +query.pageSize,//跳过。。个
    limit: +query.pageSize,
    order: [['risk_id']]
  });
  ctx.body = {
    code:  200,
    msg:  '列表查询成功',
    data,
    total
  };
};

// 添加
const Add = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params || !params.risk_name) {
    ctx.body = {
      code: 1003,
      msg: '名称不能为空'
    };
    return false;
  }
  try {
    const rel = await riskModel.create(params);
    ctx.body = {
      code: rel ? 200 : 300,
      msg: rel ? '创建成功' : '创建失败',
      data: rel
    };
  } catch (err) {
    ctx.body = {
      code: 300,
      data: err
    };
  }
};

const Del = async ctx => {
  console.log('Del',ctx.request.body)
  const rel = await riskModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.risk_name) {
    ctx.body = {
      code: 1003,
      msg: '名称不能为空'
    };
    return false;
  }
  const rel = await riskModel.update(params, {
    where: { risk_id: Number(params.risk_id) }
  });
  ctx.body = {
    code: rel[0] ? 200 : 300,
    msg: rel[0] ? '修改成功' : '修改失败',
    data: rel
  };
};

const Details = async ctx => {
  const query = ctx.query;
  if (!query.id) {
    ctx.body = {
      code: 300,
      msg: 'id不能为空'
    };
    return false;
  }
  const data = await riskModel.findOne({
    where: { risk_id: Number(query.id) }
  });
  ctx.body = {
    code: data ? 200 : 300,
    msg: data ? '查找成功' : '查找失败',
    data
  };
};

module.exports = {
  blogThemeList,
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details
};
