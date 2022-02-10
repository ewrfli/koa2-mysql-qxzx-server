const Router = require("@koa/router")
const blogCtl = require("../controller/blog");

const blogRouter = new Router({  
    prefix: '/blog'
});

blogRouter.get("/findall", blogCtl.findall);
blogRouter.get('/list', blogCtl.list)
blogRouter.post('/create', blogCtl.create)
blogRouter.post('/destroy', blogCtl.destroy)
blogRouter.get('/details', blogCtl.details)
blogRouter.post('/update', blogCtl.update)

module.exports = blogRouter