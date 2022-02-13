const Router = require("@koa/router")
const adminCtl = require("../controller/admin");

const unproAdminRouter = new Router({  //unprotected无保护的
    prefix: '/admin'
});

unproAdminRouter.post("/verify", adminCtl.verify); //验证是否登录成功测试路由

unproAdminRouter.post("/login", adminCtl.Login);

unproAdminRouter.post("/add", adminCtl.Add);

const proAdminRouter = new Router({ //有保护的
    prefix: '/admin'
});


proAdminRouter.post("/update", adminCtl.Update);

proAdminRouter.post("/del", adminCtl.Del);

proAdminRouter.get("/findall", adminCtl.FindAll);


module.exports = { unproAdminRouter, proAdminRouter };
