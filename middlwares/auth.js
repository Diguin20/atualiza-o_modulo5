const jwt = require('jsonwebtoken')
const {promisify}= require('util')

module.exports= {
    eAdmin: async (req,res,next)=>{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(400)
        }

        const token = authHeader.split(' ')

        if(!token){
            return res.status(400)
        }

        try{
            const decode= await promisify(jwt.verify)(token,"chave complexa para gerar e validar o tolen");
            req.userId= decode.id
            return next()
        }catch(err){
            return res.status(400)
        }
    }
}