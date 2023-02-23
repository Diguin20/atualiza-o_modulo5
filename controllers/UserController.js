const User  = require('../models/User');
const Transaction= require('../models/Transaction')
const bcrypt = require('bcryptjs');
const { raw } = require('mysql2');
const session = require("express-session");


module.exports = class UserController {
    
    static getUserLogin (req, res) {
        res.render('authentication/login')
        
    }
    static async postUserLogin (req,res){
        const email= req.body.email;
        const password= req.body.password;

        const user = await User.findOne({
            where:{
                email: email
            }
        })
        
        //não está funcionando!!!!

        if(user==null){
            console.log('nenhum usuario com esse email')
            //não sei botar isso no HTML
            return res.render('authentication/login')
        }
        

        if(!(await bcrypt.compare(password, user.password))){
            console.log('usuario ou senha invalidos senha!!!')
            return res.render('authentication/login')
        }

        /*
        req.session.userid = user.id
        req.flash('message', 'Login realizado com sucesso!')

        req.session.save(()=>{
            res.redirect('/transactions/dashboard')
        })
        */
        res.redirect('/transactions/dashboard')
    }
    


    static getRegister (req, res) {
        res.render('authentication/register')
        //não sei para o que server esse getRegister
    }

    //adiciona usuairos a tabela users
    static async postRegister (req, res) {
        const name= req.body.name;
        const email= req.body.email;
        const password= req.body.password;
        const conf_password= req.body.conf_password;

        const password_crypt = await bcrypt.hashSync(password,10)

        const user= await User.findOne({
            where:{
                email: email
            }
        })

        if(password!=conf_password){
            console.log('As senhas não conferem')
            //não sei fazer a mensagem de erro aparecer no HTML
            return res.render('authentication/register')
            
        }
        

        if(user!=null){
            console.log('usuarios já possui cadastro')
            //não sei fazer a mensagem de erro aparecer no HTML
            return res.render('authentication/register')
        }
        

        //informações do input do register
        const user_cadastro={
            name,
            email,
            password: password_crypt
        }

        await User.create(user_cadastro)

        //criação do usuario no banco
        /*
        await User.create(user_cadastro)
            .then((user_cadastro)=>{
                req.session.user = user_cadastro.id

                req.flash('message', 'Login realizado com sucesso!')
                req.session.save(()=>{
                    res.redirect('/transactions/dashboard')
                })
            })
            .catch((err)=>{console.log(err + "deu merda")})
        
*/
        res.redirect('/transactions/dashboard')
    }
}