const Router = require("@koa/router")
const companyCtl = require("../controller/company");

const companyRouter = new Router({  
    prefix: '/company'
});

companyRouter.get('/list', companyCtl.List)

companyRouter.post('/add', companyCtl.Add)

companyRouter.post('/del', companyCtl.Del)

companyRouter.post('/update', companyCtl.Update)

companyRouter.get('/findone', companyCtl.FindOne);

companyRouter.get('/findall', companyCtl.FindAll);

companyRouter.get('/details', companyCtl.Details)

module.exports = companyRouter