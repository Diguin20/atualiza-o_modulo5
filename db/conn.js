const { Sequelize } = require( 'sequelize' )

const sequelize = new Sequelize( 'Financial', 'root', '', {
    host:  'localhost',
    dialect: 'mysql'
})

module.exports = sequelize