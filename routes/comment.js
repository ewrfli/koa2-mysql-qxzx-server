const Router = require("@koa/router")
const commentCtl = require("../controller/comment");

const commentRouter = new Router({  
    prefix: '/comment'
});

commentRouter.get('/list', commentCtl.List)

commentRouter.post('/add', commentCtl.Add)

commentRouter.post('/del', commentCtl.Del)

commentRouter.post('/update', commentCtl.Update)

commentRouter.get('/findone', commentCtl.FindOne);

commentRouter.get('/findall', commentCtl.FindAll);

commentRouter.get('/details', commentCtl.Details)

module.exports = commentRouter