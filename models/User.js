const Sequelize= require('sequelize')
const db= require('../db/conn')

const User= db.define('usuarios', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allownull:false,
        primaryKey:true
    },
    nome:{
        type: Sequelize.STRING,
        allownull:false
    },
    email:{
        type:Sequelize.STRING,
        allownull:false,
    },
    senha:{
        type:Sequelize.STRING,
        allownull:false,
    }
})

User.sync()

module.exports = User