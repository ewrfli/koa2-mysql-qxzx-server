//管理员对每个文章增删改查
//用户 查看文章列表 查看文章详情 
// 转发文章 点赞文章
// 用户发布文章 设置标题 封面 描述 内容 自动添加用户名 用户id
// 用户发布文章 选择或新建tag category company 
//  用户删除自己发布的文章 
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

articleRouter.get('/details', articleCtl.Details) //http://127.0.0.1:3002/article/details?id=1 点击read_count自增

articleRouter.get('/like', articleCtl.FindAll);

articleRouter.get('/repost', articleCtl.FindAll);

module.exports = articleRouter