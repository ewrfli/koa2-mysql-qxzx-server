const Router = require("@koa/router")
const categoryCtl = require("../controller/category");

const categoryRouter = new Router({  
    prefix: '/category'
});

categoryRouter.get('/list', categoryCtl.List)

categoryRouter.post('/add', categoryCtl.Add)

categoryRouter.post('/del', categoryCtl.Del)

categoryRouter.post('/update', categoryCtl.Update)

categoryRouter.get('/findone', categoryCtl.FindOne);

categoryRouter.get('/findall', categoryCtl.FindAll);

categoryRouter.get('/details', categoryCtl.Details)

module.exports = categoryRouter