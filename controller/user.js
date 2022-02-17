//用户操作相关中间件
const dbConfig = require('../db/dbConfig');
const userModel = require('../models/user');
const sequelize = require('sequelize');
const { Op, QueryTypes } = require('sequelize'); //运算符
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

//用户登录
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
     //如果用户名密码在数据库查询到
     if(data){
        // 签发token
        let token = JWT.getToken({user_phone: data.user_phone, user_id: data.user_id}) || 0
        ctx.body = {
            code: data ? 200 : 433,
            msg: data ? '登陆成功' : '手机号或密码错误',
            data,
            token: token || 0
        };
    }else {
        ctx.body = {
            code: 433,
            msg: "登录失败 手机号密码错误或不存在"
        };
    }
};

//注册
const Register = async (ctx) => {
    const params = ctx.request.body;
    console.log('create:', params);
    if (!params || !params.user_name) {
        ctx.body = {
            code: 1003,
            msg: 'name不能为空',
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

//验证是否登录有jwt
const verify = async ctx => {
    let token = ctx.header.authorization //签发token 下次请求中附带在authorization:Bearer ...Jwt...
    token = token.replace('Bearer ','')
    try {
        let result = JWT.verifyToken(token, SIGN_KEY) //解析token里 admin_name: data.admin_name, admin_id: data.admin_id
        console.log('verify解析后', result)
        const data = await userModel.findOne({
            where: {
                user_phone: {
                    [Op.eq]: `${result.user_phone}`,
                },
                user_id: result.user_id,
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
            data: rel
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
            rel: rel //1成功 0失败
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
        where: { user_id: Number(params.user_id) },
    });
    ctx.body = {
        code: rel[0] ? 200 : 300,
        msg: rel[0] ? '修改成功' : '修改失败',
        data: rel
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
    const query = ctx.query
    const where = {
        user_name: {
          [Op.like]: `%${query.user_name}%`
        }
    }
    console.log('findone', where);

    const data = await userModel.findAll({
        where,
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code: data[0] ? 200 : 300,
        msg: data[0] ? '查询成功' : '查询失败',
        data
    };
};

const List = async (ctx, next) => {
    const query = ctx.query;
    console.log('query', query);
    const where = {
        user_name: {
          [Op.like]: `%${query.user_name}%`
        }
    }
    const { rows: data, count: total } = await userModel.findAndCountAll({
        //结合了 findAll 和 count 的便捷方法
        // where: { // count符合查询条件的记录总数
        // },
        where,
        offset: (+query.pageNo - 1) * +query.pageSize, //跳过。。个
        limit: +query.pageSize,
        order: [['updatedAt', 'DESC']],
    });
    ctx.body = {
        code:  200,
        msg:  '列表查询成功',
        data,
        total
    };
};

module.exports = {
    verify,
    Login,
    Register,
    Add,
    Del,
    Update,
    FindAll,
    FindOne,
    List,
};
