const Router = require("@koa/router")
const userCtl = require("../controller/user");


const unproUserRouter = new Router({  //unprotected无保护的
    prefix: '/user'
});
unproUserRouter.post("/login", userCtl.Login);
unproUserRouter.post("/register", userCtl.Register);


const proUserRouter = new Router({ //有保护的
    prefix: '/user'
});

proUserRouter.post("/add", userCtl.Add);

proUserRouter.post("/del", userCtl.Del);

proUserRouter.post("/update", userCtl.Update);

proUserRouter.post("/del", userCtl.Del);

proUserRouter.get("/findall", userCtl.FindAll);

proUserRouter.get("/findone", userCtl.FindOne);

proUserRouter.get("/list", userCtl.List);
module.exports = { unproUserRouter, proUserRouter };
