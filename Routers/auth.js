const express = require('express');
const User = require('../schema/user.schema')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const saltRounds = 10;


//it is bundle of routers
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router.get('/', (req, res) => {
    // throw new Error('this is forced error');
    res.send('login page')

})

//to register new user 
router.post('/register', async (req, res) => {
    try {
        //takes n e p from body
        const { name, email, password } = req.body;

        // 
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).send('user already exists')
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        //creates new user
        const user = new User({
            name,
            email,
            password: hash
        })
        //save new users
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        //response is sent back with users details
        res.json({
            name,
            email: user.email,
            token
        })

    } catch (e) {
        res.status(500).send({ error: e.message })
    }

})

//to allow user to login 
//route setup
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.status(400).send('email')
        }
        const validPass = bcrypt.compareSync(password, userExist.password);
        if (!validPass) {
            res.send('password is wrong');
                
        }


        const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
        res.json({

            email: userExist.email,
            token
        })

    } catch (e) {
        res.status(500).send({ error: e.message })
    }

})


//to update password of existing user
router.post('updatePassword', async (req,res)=>{
    try {

        const { email, password, newPassword } = req.body;
        
        const token = req.headers['authorization'];

        const userExists = await User.findOne({email});

        if(!userExists){
            return res.status(400).send('email or password is wrong');
        }

        const validPass = bcrypt.compareSync(password, userExists.password);
        if(!validPass){
            return res.status(400).send('Unauthorized');
        }
        const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = userExists._id.toString();

        if(verifiedToken._id !== userExists._id){
            return res.status(401).send('Unauthorization');

        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);
        await User.findOneAndUpdate({email: userExists.email}, {password:hash});

        res.json({
            message: 'password updated sucessfully'
        })
        
    } catch (error) {
        res.status(500).json(error.message)
        
    }
})

module.exports = router