const Router = require("@koa/router")
const userCtl = require("../controller/user");


const unprotectedRouter = new Router({  //unprotected无保护的
    prefix: '/users'
});
unprotectedRouter.post("/login", userCtl.userLogin);
unprotectedRouter.post("/register", userCtl.userRegister);


const protectedUserRouter = new Router({ //有保护的
    prefix: '/users'
});

protectedUserRouter.post("/add", userCtl.userAdd);

protectedUserRouter.post("/del", userCtl.userDel);



module.exports = { unprotectedRouter, protectedUserRouter };
