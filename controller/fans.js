// 用户关注的朋友 增删改查api
const dbConfig = require('../db/dbConfig');
const fansModel = require('../models/fans');
const userModel = require('../models/user');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_fanss`", { type: QueryTypes.SELECT }); //原始查询
// 1----1  一对一关系 一个文章有一个用户
fansModel.hasOne(userModel, {foreignKey: 'user_id', sourceKey: 'user_id'})
userModel.belongsTo(fansModel, {foreignKey: 'user_id', targetKey: 'user_id'})

const FindAll = async ctx => {
  const data = await fansModel.findAll({
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
  const data = await fansModel.findAll({
      where: params,
      include: [{
        model: userModel,
        attributes:['user_id', 'user_name', 'user_avatarimg', 'user_desc']
      }],
      order: [['updatedAt', 'DESC']],
  });
  ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查询成功' : '查询失败',
      data,
  };
}

//管理端列表
const List = async ctx => {
  const query = ctx.query; {}
  console.log('query',query)
  const where = {
    user_id: {
      [Op.like]: `%${query.user_id}%`
    }
  } 
  const { rows: data, count: total } = await fansModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
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

//用户 我的关注列表
const myList = async ctx => { //?id=xx
  const query = ctx.query;
  if (!query.user_id) {
    ctx.body = {
      code: 300,
      msg: 'user_id不能为空'
    };
    return false;
  }
  const where = {
    user_id: Number(ctx.query.user_id)
  }
  const data = await fansModel.findAll({
    where,
    order: [['updatedAt', 'DESC']]
  });

    ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查找成功' : '查找失败',
      data
    };
};

// 添加
const Add = async ctx => {
  const params = ctx.request.body;
  console.log('create:',params)
  if (!params || !params.user_id) {
    ctx.body = {
      code: 1003,
      msg: 'user_id不能为空'
    };
    return false;
  }
  try {
    const rel = await fansModel.create(params);
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

  // const rel = await fansModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.fans_id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  const rel = await fansModel.update(params, {
    where: { fans_id: Number(params.fans_id) }
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
  const data = await fansModel.findOne({
    where: { fans_id: Number(query.id) }
  });
  ctx.body = {
    code: data ? 200 : 300,
    msg: data ? '查找成功' : '查找失败',
    data
  };
};

module.exports = {
  myList,
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details
};
