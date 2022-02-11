//用户操作相关中间件
const dbConfig = require('../db/dbConfig');
const userModel = require('../models/user');
const sequelize = require('sequelize');
const { Op, QueryTypes } = require('sequelize'); //运算符

//登录
const Login = async (ctx) => {
    const params = ctx.request.body;
    const data = await userModel.findOne({
        where: {
            user_phone: {
                [Op.eq]: `${params.user_phone}`,
            },
            user_password: params.user_password,
        },
    });
    ctx.body = {
        code: data ? 200 : 300,
        desc: data ? '登陆成功' : '账号或密码错误',
        data
    };
};

//注册
const Register = async (ctx) => {
    const params = ctx.request.body;
    console.log('create:', params);
    if (!params || !params.user_name) {
        ctx.body = {
            code: 1003,
            msg: '不能为空',
        };
        return false;
    }
    try {
        const rel = await userModel.create(params);
        ctx.body = {
            code: rel ? 200 : 300,
            msg: rel ? '创建成功' : '创建失败',
            data: rel,
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: '创建失败',
            data: err,
        };
    }
};

//添加
const Add = async (ctx) => {
    const params = ctx.request.body;
    console.log('create:', params);
    if (!params || !params.user_name) {
        ctx.body = {
            code: 1003,
            msg: '不能为空',
        };
        return false;
    }
    try {
        const rel = await userModel.create(params);
        ctx.body = {
            code: rel ? 200 : 300,
            msg: rel ? '创建成功' : '创建失败',
            data: rel,
        };
  
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: '创建失败',
            data: err,
        };
    }
};

// 删除
const Del = async (ctx, next) => {
    console.log('Del', ctx.request.body);
    try {
        const rel = await userModel.destroy({ where: ctx.request.body });
        ctx.body = {
            code: rel ? 200 : 300,
            msg: rel ? '删除成功' : '删除失败',
            rel: rel, //1成功 0失败
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: '删除失败',
            err: err,
        };
    }
};

// 修改
const Update = async (ctx, next) => {
    const params = ctx.request.body;
    if (!params.user_id) {
        ctx.body = {
            code: 1003,
            msg: 'id不能为空',
        };
        return false;
    }
    const rel = await userModel.update(params, {
        where: { user_id: params.user_id },
    });
    ctx.body = {
        code: rel[0] ? 200 : 300,
        msg: rel[0] ? '修改成功' : '修改失败',
        data: rel,
    }
};

//查找全部
const FindAll = async (ctx, next) => {
    const data = await userModel.findAll({
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code: 200,
        data,
    };
};

//查询某一个
const FindOne = async (ctx, next) => {
    const params = ctx.request.body;
    console.log('findone', params);
    const data = await userModel.findAll({
        where: params,
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code: data[0] ? 200 : 300,
        msg: data[0] ? '查询成功' : '查询失败',
        data,
    };
};

const List = async (ctx, next) => {
    const query = ctx.query;
    console.log('query', query);
    const { rows: data, count: total } = await userModel.findAndCountAll({
        //结合了 findAll 和 count 的便捷方法
        // where: { // count符合查询条件的记录总数
        // },
        offset: (+query.page - 1) * +query.pageSize, //跳过。。个
        limit: +query.pageSize,
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        data,
        total,
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
    List,
};
