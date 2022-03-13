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

riskRouter.get('/findone', riskCtl.FindOne);//findone?company_id=1 公司主界面 监控列表

riskRouter.get('/findall', riskCtl.FindAll);

riskRouter.get('/details', riskCtl.Details)

module.exports = riskRouter