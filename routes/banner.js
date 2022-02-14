const Router = require("@koa/router")
const bannerCtl = require("../controller/banner");

const bannerRouter = new Router({  
    prefix: '/banner'
});

bannerRouter.get('/list', bannerCtl.List)

bannerRouter.post('/add', bannerCtl.Add)

bannerRouter.post('/del', bannerCtl.Del)

bannerRouter.post('/update', bannerCtl.Update)


module.exports = bannerRouter