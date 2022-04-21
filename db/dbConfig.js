//创建一个sequelize对象实例
const Sequelize = require('sequelize')
// 传入参数 数据库名，用户名，密码 
const sequelize = new Sequelize('417koaqxzxdb', '417koaqxzxdb', '123456', {
  host: 'localhost', //数据库IP地址 //101.43.125.66
  dialect: 'mysql',
//   operatorsAliases: false,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
sequelize
  .authenticate()
  .then(() => {
    console.log('MYSQL 连接成功......')
  })
  .catch(err => {
    console.error('链接失败:', err)
  })
// 根据模型自动创建表
// sequelize.sync() //如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
sequelize.sync({ alter: true })//在表中进行必要的更改以使其与模型匹配.
module.exports = sequelize
