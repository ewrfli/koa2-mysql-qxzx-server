const Router = require("@koa/router")
const commentCtl = require("../controller/comment");

const commentRouter = new Router({  
    prefix: '/comment'
});

commentRouter.get('/curarticle', commentCtl.findArticliCommentList)//获取文章的评论

commentRouter.get('/list', commentCtl.List)

commentRouter.post('/add', commentCtl.Add)//用户添加评论

commentRouter.post('/del', commentCtl.Del)

commentRouter.post('/update', commentCtl.Update)

commentRouter.get('/findone', commentCtl.FindOne);

commentRouter.get('/findall', commentCtl.FindAll);

commentRouter.get('/details', commentCtl.Details);

commentRouter.get('/like', commentCtl.Like)

module.exports = commentRouter