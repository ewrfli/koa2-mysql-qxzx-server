// 查询所有文章 /某作者的所有文章
const dbConfig = require('../db/dbConfig');
const articleModel = require('../models/article');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符

const findall = async ctx => {
  // const data = await Blog.findAll({
  //   where: {
  //     // [Op.or]: [ //Op.and Op.eq
  //     //   { id: 6 },
  //     //   { id: 7 } //WHERE (`blog`.`id` = 6 OR `blog`.`id` = 7);
  //     // ]
  //     id: {
  //       [Op.or]: [6,7]
  //     }
  //   }
  // })
  const data = await dbConfig.query("SELECT * FROM `qx_articles`", { type: QueryTypes.SELECT }); //原始查询
  ctx.body = {
    code: 200,
    data
  }
}

const list = async ctx => {
  const query = ctx.query;
  const { rows: data, count: total } = await articleModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    offset: (+query.page - 1) * +query.pageSize,//跳过。。个
    limit: +query.pageSize,
    order: [['createdAt','DESC']]
  });
  ctx.body = {
    data,
    total
  };
};


const details = async ctx => {
  const query = ctx.query;
  if (!query.id) {
    ctx.body = {
      code: 300,
      msg: 'id不能为空'
    };
    return false;
  }
  const res = await articleModel.findOne({
    where: { id: Number(query.id) }
  });
  ctx.body = res;
};


const create = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params.title) {
    ctx.body = {
      code: 1003,
      msg: '标题不能为空'
    };
    return false;
  }
  try {
    await articleModel.create(params);
    ctx.body = {
      code: 100,
      data: '创建成功'
    };
  } catch (err) {
    ctx.body = {
      code: 300,
      data: err
    };
  }
};


const update = async ctx => {
  const params = ctx.request.body;
  if (!params.id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  await articleModel.update(params, {
    where: { id: params.id }
  });
  ctx.body = {
    code: 100,
    msg: '修改成功'
  };
};


const destroy = async ctx => {
  await articleModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: 100,
    msg: '删除成功'
  };
};
module.exports = {
  list,
  create,
  destroy,
  details,
  update,
  findall
};
