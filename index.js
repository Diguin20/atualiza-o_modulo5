const express= require('express')
const app= express()
const {engine} = require('express-handlebars')

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const {eAdmin} = require('./middlwares/auth')
const db= require('./db/conn')
const User = require('./models/User')


app.get('/', async (req,res)=>{
    res.render('login')
})
app.get('/home', async (req,res)=>{
    res.render('home')
})

app.get('/cadastro', async(req,res)=>{
    res.render('cadastro')
})


app.post('/cadastro', async(req,res)=>{
    const senha = req.body.senha
    const conf_senha= req.body.conf_senha
    const email = req.body.email
    const nome = req.body.nome

    const senhacript=await bcrypt.hashSync(senha, 10)

    const user = await User.findOne({
        attributes:['id', 'nome', 'email', 'senha'],
        where:{
            email
        }
    })

    if(senha!=conf_senha){
        console.log('As senhas não conferem, tente novamente!')
      return res.status(400)

    }

    if(user.email!=null){
        console.log('usuario já possui cadastro')
        return res.status(400)
    }


    const users_cad={
        nome,
        email,
        senha: senhacript
    }
    await User.create(users_cad)

    return res.render('login')
})


app.post('/login', async(req,res)=>{
    const senha = req.body.senha
    const email = req.body.email

    const user = await User.findOne({
        attributes:['id', 'nome', 'email', 'senha'],
        where:{
            email
        }
    })
    if(user.email===null){
        console.log('nenhum usuario com esse email')
        return res.status(400)
        
    }

    if(!(await bcrypt.compare(senha, user.senha ))){
        console.log('usuario ou senha erradas')
        return res.status(400)
    }

    var token= jwt.sign({id:user.id},"chave complexa para gerar e validar o token", {
        expiresIn:600 //10 min
    })

    console.log(token)


    return res.redirect('/home')
})

//app.get('/', eAdmin, async (req,res)=>{
//    res.render('home')
//} )

app.listen(3000, ()=>{
    console.log('iniciado com sucesso na porta 3000')
})

