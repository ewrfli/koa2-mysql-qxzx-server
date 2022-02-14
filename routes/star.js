const Router = require("@koa/router")
const starCtl = require("../controller/star");

const starRouter = new Router({  
    prefix: '/star'
});

starRouter.get('/list', starCtl.List) //用户端读取 http://127.0.0.1:3002/star/list?user_id=1

starRouter.post('/add', starCtl.Add)

starRouter.post('/del', starCtl.Del)

starRouter.post('/update', starCtl.Update)

starRouter.post('/findone', starCtl.FindOne);

starRouter.get('/findall', starCtl.FindAll);

starRouter.get('/details', starCtl.Details)

module.exports = starRouter