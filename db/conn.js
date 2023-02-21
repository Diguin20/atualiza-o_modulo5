const Sequelize = require('sequelize')

const sequelize = new Sequelize('financial_dashboard', 'root','',{
    host:'localhost',
    dialect:'mysql'
})

sequelize.authenticate()
.then(()=>{
    console.log('Conexaão com o banco de dados realizada com sucesso ')
}).catch((erro)=>{
    console.log("erro com a conexão do banco de dados"+ erro )
})

module.exports = sequelize
