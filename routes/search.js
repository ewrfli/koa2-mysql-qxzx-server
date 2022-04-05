const Router = require("@koa/router")
const searchCtl = require("../controller/search");

const searchRouter = new Router();


searchRouter.get('/findall', searchCtl.FindAll);

searchRouter.get('/search', searchCtl.search);

module.exports = searchRouter