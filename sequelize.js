const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const DocumentModel =require('./models/document')
const dbConfig=require('./db.config')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });



const User=UserModel(sequelize,Sequelize)
const Document=DocumentModel(sequelize, Sequelize)

 Document.belongsTo(User);
sequelize.sync().then(()=>{
console.log('database was created')
})

module.exports={
    User,
    Document
}