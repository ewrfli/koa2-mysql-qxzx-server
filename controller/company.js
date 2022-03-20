// 公司标签 增删改查api
const dbConfig = require('../db/dbConfig');
const companyModel = require('../models/company');
const riskModel = require('../models/risk');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_companys`", { type: QueryTypes.SELECT }); //原始查询
// 定义关系
// 1----1  一对一关系 一个文章有一个用户
companyModel.hasMany(riskModel, {foreignKey: 'company_id', sourceKey: 'company_id'})
riskModel.belongsTo(companyModel, {foreignKey: 'company_id', targetKey: 'company_id'})

const FindAll = async ctx => {
  const data = await companyModel.findAll({
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
  
  const query = ctx.query;
  console.log('findone',query)
  const where = {
    company_id: query.company_id
  }
  const data = await companyModel.findOne({
    include: [{
      model: riskModel,
      // attributes:['user_id', 'user_name', 'user_avatarimg']
    }],
      where,
      order: [['updatedAt', 'DESC']],
  });
  ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查询成功' : '查询失败',
      data,
  };
}

//前端列表
const List = async ctx => {
  const query = ctx.query;
  console.log('query',query)
  const where = {
    company_tag_id: query.company_tag_id
  }
  const { rows: data, count: total } = await companyModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
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
};

//后端管理列表
const hList = async ctx => {
  const query = ctx.query;
  console.log('query',query)
  const { rows: data, count: total } = await companyModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
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
};

// 添加
const Add = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params || !params.company_name) {
    ctx.body = {
      code: 1003,
      msg: '不能为空'
    };
    return false;
  }
  try {
    const rel = await companyModel.create(params);
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
  const rel = await companyModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.company_id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  const rel = await companyModel.update(params, {
    where: { company_id: Number(params.company_id) }
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
  const data = await companyModel.findOne({
    where: { company_id: Number(query.id) }
  });
  ctx.body = {
    code: data ? 200 : 300,
    msg: data ? '查找成功' : '查找失败',
    data
  };
};

module.exports = {
  hList,
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details
};
