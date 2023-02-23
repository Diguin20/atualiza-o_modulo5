const express = require( 'express' )
const { engine } = require( 'express-handlebars' )
const session = require("express-session");
const FileStore= require('session-file-store')(session)

//models conexão com o banco de dados e tabelas
const conn = require( './db/conn' )
const User = require( './models/User' )
const Transaction = require('./models/Transaction')

//rotas
const dashRouters = require('./routes/dashRouters')
const authRouters = require('./routes/authRouters')

const app = express()

app.engine( 'handlebars', engine() )
app.set( 'view engine', 'handlebars' )

app.use( express.urlencoded( { extended: true } ) )

app.use( express.json() )
app.use(express.static('public'))

app.use('/', authRouters)
app.use('/transactions', dashRouters)

//session middleware

app.use(
    session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),
      cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      },
    }),
  )


conn
.sync()
.then( () => {
app.listen( 3000 )
console.log('rodando...')
})
.catch( ( err ) => console.log( err ) )