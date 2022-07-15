const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');
const userModel = require('../models/userModel.js');
const bookModel = require('../models/bookModel.js');
// const reviewModel = require('../models/reviewModel.js');
const {isBookTitle, isExcerpt, isISBN, isCategory, isSubcategory,isValid, isValidObjectId, isValidRequest, removeSpace, isDate} = require('../validators/bookValidation.js');

const {isValidTitle, isValidName, isValidPhone, isValidEmail, 
    isValidPassword, isValidAddress, isValidStreet, isValidCity, 
    isValidPincode, removeSpaces, trimAndUpperCase, reduceNumber} = require('../validators/userValidation.js');


//validating user datils
const validateUser = async function(req, res, next) {
    try{
    const data = req.body;
    if(Object.keys(data).length === 0) return res.status(400).send({status: false, message: "can't create data with empty body"});

    const msg = {}; //validating mandatory fields
    if(!data.title)     {msg.titleError = "mandatory title is missing"}
    if(!data.name)      {msg.titleError = "mandatory name is missing"}
    if(!data.phone)     {msg.phoneError = "mandatory phone is missing"}
    if(!data.email)     {msg.emailError = "mandatory email is missing"}
    if(!data.password)  {msg.passwordError = "mandatory password is missing"};
    if(Object.keys(msg).length > 0) return res.status(400).send({status:false, message:msg});//return

    const invalid = {}; //checking field formats
    if(!isValidTitle(data.title))       invalid.titleError = "title is invalid"; 
    if(!isValidName(data.name))         invalid.nameError = "name is invalid"; 
    if(!isValidPhone(data.phone))       invalid.phoneError = "phone is invalid"; 
    if(!isValidEmail(data.email))       invalid.emailError = "email is invalid";    //review
    if(!isValidPassword(data.password)) invalid.passwordError = "password is invalid";

    if(data.address && !isValidAddress(data.address)) invalid.addressError = "address is invalid"; 
    if(data.address.street && !isValidStreet(data.address.street)) invalid.streetError = "street is invalid"; 
    if(data.address.city && !isValidCity(data.address.city)) invalid.cityError = "city is invalid"; 
    if(data.address.pincode && !isValidPincode(data.address.pincode)) invalid.pincodeError = "pincode is invalid"; 
    if(Object.keys(invalid).length > 0) return res.status(400).send({status:false, message:invalid});   //return
    
    data.title = removeSpaces(data.title);              //formating data as per standardisation
    data.name = trimAndUpperCase(data.name);
    data.phone = removeSpaces(data.phone);
    data.email = removeSpaces(data.email).toLowerCase();
    if(data.address.street) data.address.street = removeSpaces(data.address.street);
    if(data.address.city) data.address.city = removeSpaces(data.address.city);
    if(data.address.pincode) data.address.pincode = removeSpaces(data.address.pincode);


    const duplicate = {};
    const emailDoc = await userModel.findOne({email: data.email});
    if(emailDoc) duplicate.emailError = `this ${data.email} is already registered`;

    const num = reduceNumber(data.phone)//+91-8974569874, 8974569874
    const phoneDoc = await userModel.findOne({phone: new RegExp(num + '$')});    
    if(phoneDoc) duplicate.phoneError = `this ${data.phone} is already registered`;
    if(Object.keys(duplicate).length > 0) return res.status(409).send({status:false, message:duplicate});   //return
    next();

    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message});
    }
}//by-Ibrahim

//validating Book Details
const validateBooks = async function (req, res, next) {
    try {
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data = req.body

        if(Object.keys(data).length <1) return res.status(400).send({status:false, message:"can't create book with empty details"});   //empty body

        const mandatory = {}; //checking for mandatory fields
        if(!title) mandatory.titleError = "title is mandatory";
        if(!excerpt) mandatory.excerptError = "excerpt is mandatory";
        if(!userId) mandatory.userIdError = "userId is mandatory";
        if(!ISBN) mandatory.ISBNError = "ISBN is mandatory";
        if(!category) mandatory.categoryError = "category is mandatory";
        if(!subcategory) mandatory.subcategoryError = "subcategory is mandatory";
        if(!releasedAt) mandatory.dateError = "releasedAt date is mandatory";
        if(Object.keys(mandatory).length > 0) return res .status(400).send({status:false, message: mandatory}); //return

        const invalid = {}; //checking valid formats of fields
        if (!isBookTitle(title)) invalid.title = "invalid title format";
        if (!isExcerpt(excerpt)) invalid.excerpt = "invalid excerpt format";
        if (!mongoose.Types.ObjectId.isValid(userId)) invalid.userId = "invalid userId";
        if (!isISBN(ISBN)) invalid.ISBN = "invalid ISBN format";
        if (!isCategory(category)) invalid.category = "invalid category format";
        if (!isSubcategory(subcategory)) invalid.subcategory = "invalid subcategory format";
        if (!isDate(releasedAt)) invalid.date = "invalid releasedAt date format, write it in this format YYYY-MM-DD";
        if(Object.keys(invalid).length > 0) return res .status(400).send({status:false, message: invalid}); //return
        
        req.body.title = removeSpaces(title);        //formatting field values
        req.body.excerpt = removeSpaces(excerpt); 
        req.body.userId = removeSpaces(userId);
        req.body.ISBN = ISBN.trim().split("-").join("");    //ISBN
        req.body.category = removeSpaces(category); 
     
        let idDoc = await userModel.findOne({ _id: userId })    //userId
        if(!idDoc){return res.status(404).send({status:false, message:"user not exists with this userId"})} //return
        
        const duplicate = {};   //checking duplicate keys
        const titleDoc = await bookModel.findOne({title:data.title});
        if(titleDoc) duplicate.titleError = "This title is already registered";
        const ISBNDoc = await bookModel.findOne({ISBN: data.ISBN});
        if(ISBNDoc) duplicate.ISBNError = "This ISBN is already registered";
        if(Object.keys(duplicate).length > 0) return res .status(409).send({status:false, message: duplicate}); //409 for conflicts
        next();
     
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, message: error.message })
    }
}//By- Ibrahim, Sujeet





module.exports = {validateUser, validateBooks}


