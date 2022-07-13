const { findOne } = require('../models/userModel.js');
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken')


const createUser = async function(req, res){                                    //1.validateUser, 2.createUser
    try {
        const data = req.body
        const savedUser = await userModel.create(data)
        return res.status(201).send({status:true, data:savedUser});

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message})
    }
}

const loginUser = async function(req, res){     //1.loginUser
    try {
        const data = req.body;
        if(Object.keys(data).length === 0) return res.status(400).send({status:false, message: "enter emailId and password"})
        const msg={};
        if(!data.email) msg.emailError = "please enter your email Id"
        if(!data.password) msg.passwordError = "please enter your password"
        if(Object.keys(msg).length > 0) return res.status(400).send({status:false, message: msg})

        const docs = await userModel.findOne({email:data.email});
        if(!docs) return res.status(404).send({status:false, message:"user not found, click on sign UP to create user"});
        const user = await userModel.findOne({email:data.email, password:data.password});
        if(!user) return res.status(401).send({status:false, message:"invalid credentials, useremail or password is incorrect"});

        // const token = jwt.sign({userId:user._id, batch:"radon", project:"bookManagement"}, "functionup-radon28");   //expiry pending
        
        const token = jwt.sign({userId:user._id, batch:"radon", project:"bookManagement"}, "functionup-radon28",  {expiresIn:"72h"});
        const decode = jwt.verify(token, "functionup-radon28", (err, result)=>{
            if(err) return undefined
            else return result;
        });
        const iat = (new Date(decode.iat*1000)).toLocaleString()
        const exp = (new Date(decode.exp*1000)).toLocaleString()
           

        res.setHeader("x-api-key", token);
        return res.status(200).send({status:true, message:"login successful", data : {token, issuedAt:iat, expireAt:exp}})  //one change added
     
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message})
    }
}




module.exports.createUser = createUser;
module.exports.loginUser = loginUser;

