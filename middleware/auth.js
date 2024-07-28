const jwt = require('jsonwebtoken')

const middleware = async(req, res, next)=>{
    
    authHeader = req.headers['Authorization'];
    console.log('Authorization Header:',authHeader );

    if(!authHeader){
        return res.status(401).send('Access denied');

    }
    try{
        const verified = jwt.verify(authHeader, process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    }
    catch(e){
        return res.status(400).send('invalid token')

    }
}

module.exports = middleware;

