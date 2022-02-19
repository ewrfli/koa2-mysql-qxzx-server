const Router = require("@koa/router")
const starCtl = require("../controller/star");

const starRouter = new Router({  
    prefix: '/star'
});

starRouter.get('/myarticlelist', starCtl.myArticleList) //我的文章收藏用户端读取 http://127.0.0.1:3002/star/list?user_id=1

starRouter.get('/mytaglist', starCtl.myTagList) //我的文章收藏用户端

starRouter.get('/list', starCtl.List) // 管理端/star/list?user_name=admin?pageNo=1&

starRouter.post('/add', starCtl.Add)

starRouter.post('/del', starCtl.Del)

starRouter.post('/update', starCtl.Update)

starRouter.post('/findone', starCtl.FindOne);

starRouter.get('/findall', starCtl.FindAll);

starRouter.get('/details', starCtl.Details)

module.exports = starRouter