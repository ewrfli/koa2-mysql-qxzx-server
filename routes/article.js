const Router = require("@koa/router")
const articleCtl = require("../controller/article");

const articleRouter = new Router({  
    prefix: '/article'
});

articleRouter.get("/findall", articleCtl.findall);
articleRouter.get('/list', articleCtl.list)
articleRouter.post('/create', articleCtl.create)
articleRouter.post('/destroy', articleCtl.destroy)
articleRouter.get('/details', articleCtl.details)
articleRouter.post('/update', articleCtl.update)

module.exports = articleRouter