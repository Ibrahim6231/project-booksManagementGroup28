const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require('../models/userModel.js');
const bookModel = require('../models/bookModel.js');

//Authentication-IK
const authentication = function(req, res, next){
    try {
        const token = req.headers["x-api-key"];
        if(!token) return res.status(401).send({status:false, message: "token is missing"});    //vald1

        const decoded = jwt.verify(token, "functionup-radon28", {ignoreExpiration:true}, ((err, result)=>{                //vald2
        if(err) return undefined
        else  return result
        }));

        if (decoded == undefined) { return res.status(401).send({status:false, message: "Invalid Token"}) };                                                                                                         
        if(Date.now() > decoded.exp*1000) return res.status(401).send({status:false, message: "Token/login session expired"}); 

        req["decoded"] = decoded 
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});
    }

}

//Authorisation-to createBook -------------------INCOMPLETE
const authorisation = function(req, res, next){      
    try {
        const userId = req.body.userId;                                              

        if(Object.keys(req.body).length <1) return res.status(400).send({status:false, message:"can't create book with empty details"});   //empty body                  
        if(!userId) return res.status(400).send({status:false, message: "please enter userId"});  //vald1
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({staus:false, message: "enter a valid Id"}); //vald2

        const loggedInUserId = req.decoded.userId;      

        if(loggedInUserId !== userId) return res.status(403).send({status:false, message:"You are not authorised to make this request"});
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});        
    }
}

//Authroisation for update and delete books
const authorisationUD = async function(req, res, next){      
    try {
        const bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status:false, message: "please enter bookId"});  //vald1
        if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({staus:false, message: "enter a valid Id"}); //vald2

        const doc = await bookModel.findById(bookId);
        if(!doc) return res.status(404).send({status:false, message:"no books found with this bookId"});
        const bookUserId = doc.userId.toString();                                              
        

        const loggedInUserId = req.decoded.userId;      
        if(loggedInUserId !== bookUserId) return res.status(403).send({status:false, message:`user with id ${loggedInUserId} is not authorised to make changes in book of ${bookUserId}`});
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});        
    }
}

module.exports = {authentication, authorisation, authorisationUD}


