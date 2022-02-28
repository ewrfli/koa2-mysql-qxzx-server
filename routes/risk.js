const Router = require("@koa/router")
const riskCtl = require("../controller/risk");

const riskRouter = new Router({  
    prefix: '/risk'
});
riskRouter.get('/blogThemeList', riskCtl.blogThemeList)

riskRouter.get('/list', riskCtl.List)

riskRouter.post('/add', riskCtl.Add)

riskRouter.post('/del', riskCtl.Del)

riskRouter.post('/update', riskCtl.Update)

riskRouter.get('/findone', riskCtl.FindOne);

riskRouter.get('/findall', riskCtl.FindAll);

riskRouter.get('/details', riskCtl.Details)

module.exports = riskRouter