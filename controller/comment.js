// 用户评论 增删改查api
const dbConfig = require('../db/dbConfig');
const commentModel = require('../models/comment');
const userModel = require('../models/user');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_articles`", { type: QueryTypes.SELECT }); //原始查询
// 1----1  一对一关系 一个文章有一个用户
commentModel.hasOne(userModel, {foreignKey: 'user_id', sourceKey: 'user_id'})
userModel.belongsTo(commentModel, {foreignKey: 'user_id', targetKey: 'user_id'})

const FindAll = async ctx => {
  const data = await commentModel.findAll({
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
  const data = await commentModel.findAll({
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
  const query = ctx.query;
  console.log('query',query)
  const where = {
    user_name: {
      [Op.like]: `%${query.user_name}%`
    }
  } 
  const { rows: data, count: total } = await commentModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
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

// 添加
const Add = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params || !params.comment_content) {
    ctx.body = {
      code: 1003,
      msg: '不能为空'
    };
    return false;
  }
  try {
    const rel = await commentModel.create(params);
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
  const rel = await commentModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.comment_id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  const rel = await commentModel.update(params, {
    where: { comment_id: Number(params.comment_id) }
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
  const data = await commentModel.findOne({
    where: { comment_id: Number(query.id) }
  });
  ctx.body = {
    code: data ? 200 : 300,
    msg: data ? '查找成功' : '查找失败',
    data
  };
};

const findArticliCommentList = async ctx =>{ //查询当前文章的评论
  const query = ctx.query;
  console.log('query',query)
  // const where = {
  //   article_id: query.id
  // } 
  const { rows: data, count: total } = await commentModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    where: { 
      article_id: Number(query.id)
    },
    include: [{
      model: userModel,
      attributes:['user_id', 'user_name', 'user_avatarimg']
    }],
    order: [['updatedAt','DESC']]
  });
  ctx.body = {
    code:  200,
    msg:  '列表查询成功',
    data,
    total
  };
}

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
    comment_id: Number(ctx.query.id)
  }
  const data = await commentModel.findOne({
    where
  });

  let Count = data.comment_like_count + 1
  await commentModel.update({comment_like_count: Count}, {
    where
  });
  
    ctx.body = {
      code: data ? 200 : 300,
      msg: data ? '查找成功' : '查找失败',
      data:data.comment_like_count
    };
};

module.exports = {
  Like,
  findArticliCommentList,
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details
};
