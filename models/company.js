//定义模型，告诉Sequelize如何映射数据库表
const dbConfig = require('../db/dbConfig');
const sequelize = require("sequelize"); 
const { DataTypes } = require("sequelize"); // 导入内置数据类型
const moment = require('moment');

// 定义表结构
const company = dbConfig.define(
  'qx_company',
  {
    company_id: {
        type: DataTypes.INTEGER(11), // 设置字段类型
        primaryKey: true, // 设置为主键
        autoIncrement: true // 自增
    },
    company_name: {
        type: DataTypes.STRING
    },
    company_coverimg: {
        type: DataTypes.STRING
    },
    company_category_name: {
        type: DataTypes.STRING
    },
    company_tag_name: {
        type: DataTypes.STRING
    },
    company_desc: {
        type: DataTypes.STRING
    },
    company_content: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        get() {
            // this.getDataValue 获取当前字段value
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm');
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm');
        }
    }
  },
  {
    // sequelize会自动使用传入的模型名（define的第一个参数）的复数做为表名 设置true取消默认设置
    freezeTableName: true
  }
);
module.exports = company;