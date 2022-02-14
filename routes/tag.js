const Router = require("@koa/router")
const tagCtl = require("../controller/tag");

const tagRouter = new Router({  
    prefix: '/tag'
});

tagRouter.get('/list', tagCtl.List)

tagRouter.post('/add', tagCtl.Add)

tagRouter.post('/del', tagCtl.Del)

tagRouter.post('/update', tagCtl.Update)

tagRouter.get('/findone', tagCtl.FindOne);

tagRouter.get('/findall', tagCtl.FindAll);

tagRouter.get('/details', tagCtl.Details)

module.exports = tagRouter