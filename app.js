const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const mylogger = require('./controller/mylogger')

//引入路由
const { unproAdminRouter, proAdminRouter } = require('./routes/admin')
const webRouter = require('./routes/web')
const blogRouter = require('./routes/blog')
const articleRouter = require('./routes/article')
const { unprotectedRouter, protectedUserRouter } = require('./routes/users')

// error handler
onerror(app)

// middlewares koa原生中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
})) //请求体解析中间件 ctx.response.body
app.use(json())
app.use(logger()) //日志记录
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
//


// 自定义请求日志记录logger中间件
// app.use(mylogger())

//跨域cors中间件
app.use(cors())


// 不受保护的routes
app.use(unproAdminRouter.routes(), unproAdminRouter.allowedMethods())



app.use(unprotectedRouter.routes(), unprotectedRouter.allowedMethods()) //allowedMethods: ctx.status为空或者404的时候,丰富response对象的header头.
app.use(blogRouter.routes(), blogRouter.allowedMethods())
app.use(articleRouter.routes(), articleRouter.allowedMethods())//文章相关路由

// 注册 JWT 中间件 

//受jwk保护的routes放后面
app.use(proAdminRouter.routes(), proAdminRouter.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
console.log('listening port: localhost:3002')
module.exports = app
