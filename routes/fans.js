const Router = require("@koa/router")
const fansCtl = require("../controller/fans");

const fansRouter = new Router({  
    prefix: '/fans'
});

fansRouter.get('/list', fansCtl.List)

fansRouter.post('/add', fansCtl.Add)

fansRouter.post('/del', fansCtl.Del)

fansRouter.post('/update', fansCtl.Update)

fansRouter.get('/findone', fansCtl.FindOne);

fansRouter.get('/findall', fansCtl.FindAll);

fansRouter.get('/details', fansCtl.Details)

module.exports = fansRouter