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



const search = async ctx => {
    const query = ctx.query;
    const where = {
      article_title: {
        [Op.like]: `%${query.title}%`
      }
    }

    const data = await articleModel.findAll({
        where,
        order: [
            ['updatedAt', 'DESC']
        ]
    })
    ctx.body = {
      code: 200,
      data
    }
}

module.exports = {
    categoryList,
    FindAll,
    search,
  };