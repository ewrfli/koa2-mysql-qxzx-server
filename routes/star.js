const Router = require("@koa/router")
const starCtl = require("../controller/star");

const starRouter = new Router({  
    prefix: '/star'
});

starRouter.get('/list', starCtl.List)

starRouter.post('/add', starCtl.Add)

starRouter.post('/del', starCtl.Del)

starRouter.post('/update', starCtl.Update)

starRouter.get('/findone', starCtl.FindOne);

starRouter.get('/findall', starCtl.FindAll);

starRouter.get('/details', starCtl.Details)

module.exports = starRouter