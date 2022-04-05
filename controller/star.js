// 用户收藏文章 增删改查api
const dbConfig = require('../db/dbConfig');
const starModel = require('../models/star');
const articleModel = require('../models/article');
const tagModel = require('../models/tag');
const companyModel = require('../models/company');
const userModel = require('../models/user');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
// const data = await dbConfig.query("SELECT * FROM `qx_stars`", { type: QueryTypes.SELECT }); //原始查询

// 定义关系
// 1----1   一对一关系
starModel.hasOne(articleModel, {foreignKey: 'article_id', sourceKey: 'article_id'})
articleModel.belongsTo(starModel, {foreignKey: 'article_id', targetKey: 'article_id'})

starModel.hasOne(tagModel,{foreignKey: 'tag_id', sourceKey: 'tag_id'})
tagModel.belongsTo(starModel, {foreignKey: 'tag_id', targetKey: 'tag_id'})

articleModel.hasOne(userModel, {foreignKey: 'user_id', sourceKey: 'user_id'})
userModel.belongsTo(articleModel, {foreignKey: 'user_id', targetKey: 'user_id'})

starModel.hasOne(companyModel,{foreignKey: 'company_id', sourceKey: 'company_id'})
companyModel.belongsTo(starModel, {foreignKey: 'company_id', targetKey: 'company_id'})

const FindAll = async ctx => {
  const data = await starModel.findAll({
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
  const data = await starModel.findAll({
      where: params,
      include: [articleModel],
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
  const query = ctx.query;
  console.log('query',query)
  const where = {
    user_name: {
      [Op.like]: `%${query.user_name}%`
    }
  }
  const { rows: data, count: total } = await starModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
    // where: { // count符合查询条件的记录总数
    // },
    // where,
    include: [articleModel],
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

//用户 我的关注公司列表
const myCompanyList = async ctx => { //?id=xx
  const query = ctx.query;
  if (!query.user_id) {
    ctx.body = {
      code: 300,
      msg: 'user_id不能为空'
    };
    return false;
  }
  const where = {
    user_id: Number(ctx.query.user_id),
    [Op.not]: [{company_id: null}]
  }
  const data = await starModel.findAll({
    where,
    include: [companyModel],
    order: [['updatedAt', 'DESC']]
  });

    ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查找成功' : '查找失败',
      data
    };
};

//用户 我的收藏文章列表
const myArticleList = async ctx => { //?id=xx
  const query = ctx.query;
  if (!query.user_id) {
    ctx.body = {
      code: 300,
      msg: 'user_id不能为空'
    };
    return false;
  }
  const where = {
    user_id: Number(ctx.query.user_id),
    [Op.not]: [{article_id: null}]
  }
  const data = await starModel.findAll({
    where,
    include: [articleModel],
    order: [['updatedAt', 'DESC']]
  });

    ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? '查找成功' : '查找失败',
      data
    };
};


//用户 我的收藏tag列表
const myTagList = async ctx => { //?id=xx
  const query = ctx.query;
  if (!query.user_id) {
    ctx.body = {
      code: 300,
      msg: 'user_id不能为空'
    };
    return false;
  }
  const where = {
    user_id: Number(ctx.query.user_id),
    [Op.not]:[{tag_id: null}]
  }
  const data = await starModel.findAll({
    where,
    attributes:['star_id', 'user_id', 'tag_id'],
    include: [{model: tagModel, attributes:['tag_id', 'tag_name', 'tag_desc','tag_coverimg']}],
    order: [['updatedAt', 'DESC']]
  });

    ctx.body = {
      code: data[0] ? 200 : 300,
      msg: data[0] ? 'tag查找成功' : 'tag查找失败',
      data
    };
};

// 添加
const Add = async ctx => {
  const params = ctx.request.body; //{user_id: xx, article_id:xx, article_title:xx,}
  console.log('create:',params)
  if (!params) {
    ctx.body = {
      code: 1003,
      msg: '不能为空'
    };
    return false;
  }
  try {
    const rel = await starModel.create(params);
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
  const rel = await starModel.destroy({ where: ctx.request.body });
  ctx.body = {
    code: rel ? 200 : 300,
    msg: rel ? '删除成功' : '删除失败',
    rel: rel //1成功 0失败
  };
};

const Update = async ctx => {
  const params = ctx.request.body;
  if (!params.star_id) {
    ctx.body = {
      code: 1003,
      msg: 'id不能为空'
    };
    return false;
  }
  const rel = await starModel.update(params, {
    where: { star_id: Number(params.star_id) }
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
  const data = await starModel.findOne({
    where: { star_id: Number(query.id) }
  });
  ctx.body = {
    code: data ? 200 : 300,
    msg: data ? '查找成功' : '查找失败',
    data
  };
};

module.exports = {
  myCompanyList,
  myTagList,
  myArticleList,
  List,
  Add,
  Del,
  Update,
  FindOne,
  FindAll,
  Details
};
