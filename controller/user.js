//用户操作相关中间件
const dbConfig = require('../db/dbConfig');
const userModel = require('../models/user');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符

//登录
const Login = async ctx => {
    console.log('login test')
    ctx.body = {
        code: 200,
        msg: "login test"
    };
};

//注册
const Register = async ctx => {
    console.log('login Register')
    ctx.body = {
        code: 200,
        msg: "login Register"
    };
};

//添加
const Add = async (ctx) => {
    console.log('login test')
    ctx.body = {
        code: 200,
        msg: "login test"
    };
};


// 删除
const Del = async (ctx, next) => {
    console.log('login test')
    ctx.body = {
        code: 200,
        msg: "login test"
    };    
};

// 修改
const Update = async (ctx, next) => {
    console.log('login test')
    ctx.body = {
        code: 200,
        msg: "login test"
    };    
};


//查找全部
const FindAll = async (ctx, next) => {
    const data = await dbConfig.query("SELECT * FROM `qx_users`", { type: QueryTypes.SELECT }); //原始查询
    ctx.body = {
      code: 200,
      data
    }   
};

const FindOne = async (ctx, next) => {
    const data = await dbConfig.query("SELECT * FROM `qx_users`", { type: QueryTypes.SELECT }); //原始查询
    ctx.body = {
      code: 200,
      data
    }   
};

const List = async (ctx, next) => {
    const query = ctx.query; {}
    console.log('query',query)
    const { rows: data, count: total } = await userModel.findAndCountAll({ //结合了 findAll 和 count 的便捷方法
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


module.exports = {
    Login,
    Register,
    Add,
    Del,
    Update,
    FindAll,
    FindOne,
    List
    
};
