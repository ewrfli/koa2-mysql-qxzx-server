const Router = require("@koa/router")
const fansCtl = require("../controller/fans");

const fansRouter = new Router({  
    prefix: '/fans'
});

fansRouter.get('/list', fansCtl.List)

fansRouter.post('/add', fansCtl.Add)

fansRouter.post('/del', fansCtl.Del)

fansRouter.post('/update', fansCtl.Update)

fansRouter.post('/findone', fansCtl.FindOne);

fansRouter.post('/findall', fansCtl.FindAll);

fansRouter.post('/details', fansCtl.Details)

module.exports = fansRouter