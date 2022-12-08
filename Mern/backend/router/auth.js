const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const authentication = ('../middleware/authentication')

require('../db/conn')

router.get('/', (req, res)=>{
    res.send(`'Hellow world from the server Auth.js'`)
});

router.get('/contact', (req, res)=>{
    res.cookie("Test", 'Himanshu')
    res.send(`'Hellow contact'`)
});

// router.get('/signin', (req, res)=>{
//     res.send(`'Hellow Signin'`)
// });

router.get('/about', (req, res)=>{
    res.send(`'Hellow ABOUT'`)
});

router.post('/register', async (req, res)=>{
    const {name, email, phone, occupation, password ,cpassword}= req.body;
    if(!name || !email || !phone || !occupation ||!password || !cpassword){
       return res.status(422).json({error: "Please Fill The Fields Properly"}) 
    } 
    try{
    const emailExist = await User.findOne({email: email})
        if(emailExist){
            return res.status(422).json({error: "Email Already Exist"}) 
        } else if (password !== cpassword){
            return res.status(422).json({error: "Password and Confirm Password Not Matched"})
        }else{
        const user= new User({name, email, phone, occupation, password ,cpassword});
        await user.save();
            res.status(201).json({message:"User Registered Successfully"})}
    }catch(err) {
        console.log(err);
    }
})

// Signin Router
router.post('/login', async(req,res)=>{
    try{
        let token;
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({error: "Please Fill the Data"}) 
         }
        // console.log("Hello Data", req.body);
        const Login= await User.findOne({email:email});
        if(Login){
            const isMatch = await bcrypt.compare(password, Login.password)
             token = await Login.generateAuthToken();
            console.log(token , "Hello" );
            res.cookie("jwtoken", token, {
               expires:new Date(Date.now() + 25892000000),
               httpOnly:true  
            }) 
            if(!isMatch){
                res.status(400).json({error: "InValid Credentials"});
            }else{
                res.json({message: "Logged In"});
            }
        }else{
            res.status(400).json({error: "Invalid Credentials"});
        }
       
    }
    catch(err){
        console.log(err, "hell")
    }
})



module.exports= router;
