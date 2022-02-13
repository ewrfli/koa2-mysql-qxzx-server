const Router = require("@koa/router")
const uploadCtl = require("../controller/upload");

const UploadRouter = new Router({ //有保护的路由
    prefix: '/upload'
});

UploadRouter.post("/img", uploadCtl.uploadSin, uploadCtl.uploadImg);//
module.exports = UploadRouter