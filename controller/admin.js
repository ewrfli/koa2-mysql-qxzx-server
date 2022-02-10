//管理员操作相关中间件
const dbConfig = require('../db/dbConfig');
const adminModel = require('../models/admin');
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



//添加管理员
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


//查找
const FindAll = async (ctx, next) => {
    const data = await dbConfig.query("SELECT * FROM `qx_admins`", { type: QueryTypes.SELECT }); //原始查询
    ctx.body = {
      code: 200,
      data
    }   
};



module.exports = {
    Login,
    Add,
    Del,
    Update,
    FindAll
    
};
