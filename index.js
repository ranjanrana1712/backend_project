const express = require('express');
const dotenv = require('dotenv');
const authRoute =require('./Routers/auth')
const fs = require('fs');
const mongoose = require('mongoose');

const cors = require('cors');



dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

app.get('/',(req,res)=>{
res.send('hello world');
})

app.get('/example',(req,res)=>{
    res.json({message:'this example of cors'})
})



//create log.txt and keep records of all logs
app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url}\n`;
    fs.writeFile('log.txt',reqString,{flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    })
    next();
})


app.use('/v1/auth/',authRoute)

//create error.txt and keep records of all error
app.use((err,req,res,next) =>{
    const errString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`;

    fs.writeFile('err.txt',errString, {flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    });
    res.status(500).send('internal server error')
    next();
})

//creating middleware err handler
app.use((err, req,res, next)=>{
    console.log(err);
    res.status(500).send('something went wrong');
})


mongoose.connect(process.env.DB_CONNECT).then(()=>console.log('db established')).catch((err)=> console.log(err))

app.listen(port,(error)=>{
    console.log(`example of app listening on port ${port}!`)
})