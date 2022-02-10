const Router = require("@koa/router")
const articleCtl = require("../controller/article");

const articleRouter = new Router({  
    prefix: '/article'
});

articleRouter.get('/list', articleCtl.List)

articleRouter.post('/add', articleCtl.Add)

articleRouter.post('/del', articleCtl.Del)

articleRouter.post('/update', articleCtl.Update)

articleRouter.get('/findone', articleCtl.FindOne);

articleRouter.get('/findall', articleCtl.FindAll);

articleRouter.get('/details', articleCtl.Details)

module.exports = articleRouter