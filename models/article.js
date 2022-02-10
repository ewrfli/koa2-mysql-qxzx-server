//定义模型，告诉Sequelize如何映射数据库表
const dbConfig = require('../db/dbConfig');
const sequelize = require("sequelize"); 
const { DataTypes } = require("sequelize"); // 导入内置数据类型
const moment = require('moment');

// 定义表结构
const article = dbConfig.define(
  'qx_articles',
  {
    article_id: {
        type: DataTypes.INTEGER(11), // 设置字段类型
        primaryKey: true, // 设置为主键
        autoIncrement: true // 自增
    },
    article_title: {
        type: DataTypes.STRING
    },
    article_coverimg: {
        type: DataTypes.STRING
    },
    article_desc: {
        type: DataTypes.STRING
    },
    article_content: {
        type: DataTypes.TEXT
    },
    article_author: {
        type: DataTypes.STRING
    },
    article_user_id: {
        type: DataTypes.INTEGER(11)
    },
    article_tag: {
        type: DataTypes.STRING
    },
    article_tag_id: {
        type: DataTypes.STRING
    },
    article_category: {
        type: DataTypes.STRING
    },
    article_category_id: {
        type: DataTypes.STRING
    },
    article_company: {
        type: DataTypes.STRING
    },
    article_company_id: {
        type: DataTypes.STRING
    },
    article_comment_count: {
        type: DataTypes.INTEGER
    },
    article_like_count: {
        type: DataTypes.INTEGER,
        defaultValue: '0'
    },
    article_read_count: {
        type: DataTypes.INTEGER,
        defaultValue: '0'
    },
    article_repost_count: {
        type: DataTypes.INTEGER,
        defaultValue: '0'
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
module.exports = article;