//管理员操作相关中间件
const dbConfig = require('../db/dbConfig');
const adminModel = require('../models/admin');
const sequelize = require("sequelize"); 
const { Op, QueryTypes  } = require('sequelize');//运算符
const jwt = require('jsonwebtoken')
const SIGN_KEY = 'qxzx-server-jwt'

class jwtUtil {
    getToken(userDate) {
        return jwt.sign(userDate, SIGN_KEY, { expiresIn: 3600 * 24 *7 })//过期时间 3600 * 24 *7
    }

    verifyToken(token) {
        return jwt.verify(token, SIGN_KEY)
    }
    ////解析token里 {username: 'qqqq',_id: '61dae237144807cea88cc7e5',iat: 1641744804,exp: 1642349604}
}
const JWT = new jwtUtil()

//登录
const Login = async ctx => {
    const params = ctx.request.body;
    const data = await adminModel.findOne({
        where: {
            admin_name: {
                [Op.eq]: `${params.admin_name}`,
            },
            admin_password: params.admin_password,
        },
    });
    //如果用户名密码在数据库查询到
    if(data){
        // 签发token
        let token = JWT.getToken({admin_name: data.admin_name, admin_id: data.admin_id}) || 0
        ctx.body = {
            code: data ? 200 : 300,
            desc: data ? '登陆成功' : '账号或密码错误',
            data,
            token
        };
    }else {
        ctx.body = {
            code: 300,
            msg: "登录失败用户名密码错误或不存在",
            data,
            token
        };
    }

};

//验证是否登录有jwt
const verify = async ctx => {
    let token = ctx.header.authorization //签发token 下次请求中附带在authorization:Bearer ...Jwt...
    token = token.replace('Bearer ','')
    try {
        let result = JWT.verifyToken(token, SIGN_KEY) //解析token里 admin_name: data.admin_name, admin_id: data.admin_id
        console.log('verify解析后', result)
        const data = await adminModel.findOne({
            where: {
                admin_name: {
                    [Op.eq]: `${result.admin_name}`,
                },
                admin_id: result.admin_id,
            },
        })
        //如果用户名密码在数据库查询到
        if(data){
            ctx.body = {
                code: 200,
                msg: "认证成功",
                data: data
            };
        }else {
            ctx.body = {
                code: 500,
                msg: "认证失败null",
                data: data
            };
        }
    }catch (err) {
        ctx.body = {
            code: 500,
            msg: "认证失败err",
        };
    }
}

//添加管理员
const Add = async (ctx) => {
    const params = ctx.request.body;
    console.log('create:', params);
    if (!params || !params.admin_name) {
        ctx.body = {
            code: 1003,
            msg: '不能为空',
        };
        return false;
    }
    const rel = await adminModel.create(params);
    ctx.body = {
        code: rel ? 200 : 300,
        msg: rel ? '创建成功' : '创建失败',
        data: rel,
    };
};


// 删除
const Del = async (ctx, next) => {
    console.log('Del', ctx.request.body);
    const rel = await adminModel.destroy({ where: ctx.request.body });
    ctx.body = {
        code: rel ? 200 : 300,
        msg: rel ? '删除成功' : '删除失败',
        rel: rel, //1成功 0失败
    };
 
};

// 修改
const Update = async (ctx, next) => {
    const params = ctx.request.body;
    if (!params.admin_id) {
        ctx.body = {
            code: 1003,
            msg: 'id不能为空',
        };
        return false;
    }
    const rel = await adminModel.update(params, {
        where: { admin_id: params.admin_id },
    });
    ctx.body = {
        code: rel[0] ? 200 : 300,
        msg: rel[0] ? '修改成功' : '修改失败',
        data: rel,
    }    
};


//查找全部
const FindAll = async (ctx, next) => {
    const data = await adminModel.findAll({
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code: 200,
        data,
    };   
};

//查询某一个
const FindOne = async (ctx, next) => {
    const params = ctx.request.body;//{admin_name: admin}
    console.log('findone', params);
    const data = await adminModel.findAll({
        where: params,
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code: data[0] ? 200 : 300,
        msg: data[0] ? '查询成功' : '查询失败',
        data,
    };
};

module.exports = {
    verify,
    Login,
    Add,
    Del,
    Update,
    FindAll,
    FindOne
    
};
