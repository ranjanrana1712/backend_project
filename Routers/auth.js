const express = require('express');
//it is bundle of routers
const router = express.Router();

router.get('/', (req,res)=>{
    // throw new Error('this is forced error');
    res.send('login page')
    
})

module.exports = router