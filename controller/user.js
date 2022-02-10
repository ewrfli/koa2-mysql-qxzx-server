//用户操作相关中间件


//登录
const userLogin = async ctx => {
    console.log('login test')
    ctx.body = {
        code: 200,
        msg: "login test"
    };
};

//注册
const userRegister = async ctx => {
};


//添加用户
const userAdd = async (ctx) => {
};


// 删除用户
const userDel = async (ctx, next) => {
};


//查找所有用户
const userFindAll = async (ctx, next) => {
};



module.exports = {
    userLogin,
    userRegister,
    userAdd,
    userDel,
    userFindAll
    
};
