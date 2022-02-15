// 文章 增删改查api
// 查询所有文章 /某作者的所有文章
const dbConfig = require('../db/dbConfig');
const articleModel = require('../models/article');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_articles`", { type: QueryTypes.SELECT }); //原始查询

const FindAll = async ctx => {
  const data = await articleModel.findAll({
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
  const data = await articleModel.findAll({
      where: params,
      order: [['updatedAt', 'DESC']],
  });
  ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查询成功' : '查询失败',
      data,
  };
}

//首页列表
const List = async ctx => {
  const query = ctx.query; {}
  console.log('query',query)
  const where = {
    article_title: {
      [Op.like]: `%${query.article_title}%`
    }
  }
  const { rows: data, count: total } = await articleModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    where,
    offset: (+query.pageNo - 1) * +query.pageSize,//跳过。。个
    limit: +query.pageSize,
    order: [['updatedAt','DESC']]
  });
  ctx.body = {
    code:  200,
    data,
    total
  };
};

// 添加
const Add = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params || !params.article_title) {
    ctx.body = {
      code: 1003,
      msg: '不能为空'
    };
    return false;
  }
  try {
    const rel = await articleModel.create(params);
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
  const rel = await articleModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.article_id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  const rel = await articleModel.update(params, {
    where: { article_id: Number(params.article_id) }
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
  const where = {
    article_id: Number(ctx.query.id)
  }
  const data = await articleModel.findOne({
    where
  });

  let readedCount = data.article_read_count + 1
  await articleModel.update({article_read_count: readedCount}, {
    where
  });    //阅读量

    ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查找成功' : '查找失败',
      data
    };
};

const Like = async ctx => {
  const query = ctx.query;
  if (!query.id) {
    ctx.body = {
      code: 300,
      msg: 'id不能为空'
    };
    return false;
  }
  const where = {
    article_id: Number(ctx.query.id)
  }
  const data = await articleModel.findOne({
    where
  });

  let Count = data.article_like_count + 1
  await articleModel.update({article_like_count: Count}, {
    where
  });
  
    ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查找成功' : '查找失败',
      data
    };
};

const Repost = async ctx => {
  const query = ctx.query;
  if (!query.id) {
    ctx.body = {
      code: 300,
      msg: 'id不能为空'
    };
    return false;
  }
  const where = {
    article_id: Number(ctx.query.id)
  }
  const data = await articleModel.findOne({
    where
  });

  let Count = data.article_repost_count + 1
  await articleModel.update({article_repost_count: Count}, {
    where
  });

    ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查找成功' : '查找失败',
      data
    };
};

module.exports = {
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details,
  Like,
  Repost
};
