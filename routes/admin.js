const Router = require("@koa/router")
const adminCtl = require("../controller/admin");


const unproAdminRouter = new Router({  //unprotected无保护的
    prefix: '/admin'
});
unproAdminRouter.post("/login", adminCtl.Login);


const proAdminRouter = new Router({ //有保护的
    prefix: '/admin'
});

proAdminRouter.post("/add", adminCtl.Add);

proAdminRouter.post("/update", adminCtl.Update);

proAdminRouter.post("/del", adminCtl.Del);

proAdminRouter.get("/findall", adminCtl.FindAll);


module.exports = { unproAdminRouter, proAdminRouter };
