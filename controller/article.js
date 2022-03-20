// 文章 增删改查api
// 查询所有文章 /某作者的所有文章
const dbConfig = require('../db/dbConfig');
const articleModel = require('../models/article');
const userModel = require('../models/user');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_articles`", { type: QueryTypes.SELECT }); //原始查询

// 定义关系
// 1----1  一对一关系 一个文章有一个用户
articleModel.hasOne(userModel, {foreignKey: 'user_id', sourceKey: 'user_id'})
userModel.belongsTo(articleModel, {foreignKey: 'user_id', targetKey: 'user_id'})

//根据种类加载首页文章列表
const categoryList = async ctx => {
  const query = ctx.query;
  console.log('query',query)
  const where = {
    article_category: {
      [Op.like]: `%${query.article_category}%`
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
  const query = ctx.query;
  console.log('findone', query);
  const data = await articleModel.findOne({
      where: {article_id: query.article_id}
  });
  ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查询成功' : '查询失败',
      data,
  };
}

//首页列表
const List = async ctx => {
  const query = ctx.query;
  // const where = {
  //   article_title: {
  //     [Op.like]: `%${query.article_title}%`
  //   }
  // }

  console.log('query',query, Object.keys(query)[0])
  const queryName = Object.keys(query)[0]
  const where = {}
  where[queryName] = { [Op.like]: `%${query[queryName]}%` }
  console.log('where',where)

  const { rows: data, count: total } = await articleModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    where,
    include: [{
      model: userModel,
      attributes:['user_id', 'user_name', 'user_avatarimg']
    }],
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
    where,
    include: [{
      model: userModel,
      attributes:['user_id', 'user_name', 'user_avatarimg']
    }]
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
      data:data.article_like_count
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
  categoryList,
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
