/*-----------------------------------------------USER VALIDATION-----------------------------------------------*/

const { off } = require("../models/userModel");

//title validation
function isValidTitle(x){
    // if(!x) return false;
    if(typeof x !== "string") return false;
    x = x.trim(); 
    if(x==="Mr" || x==="Mrs" || x=="Miss") return true
    else return false
}

//name validation
function isValidName(x){
    if(typeof x !== "string") return false;
    const regEx = /^\s*[a-zA-Z]+(\.[a-zA-Z\s]+)*[a-zA-Z\s]{2,64}\s*$/ ;
    return regEx.test(x);
}


//phone no. validation
function isValidPhone(x){
    if(typeof x !== "string") return false         
    const regEx = /^\s*(\+[9][1][\-]?)?[6789][0-9]{9}\s*$/;
    return regEx.test(x);
}



//email validation
function isValidEmail(x){
    const regEx = /^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zA-Z]{2,5})+\s*$/;
    return regEx.test(x)
}


//password validation
function isValidPassword(x){
    const regEx = /^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}\s*$/    ;
    return regEx.test(x);
}
//review password as per TA instruction.


function isValidAddress(x){
    if(typeof x !== "object") return false;
    if(Object.keys(x).length === 0) return false;
    return true
}

function isValidStreet(x){
    if(typeof x !== "string") return false;
    const regEx = /^\s*([\w]+([\s\.\-\:\,][a-zA-Z0-9\s]+)*){2,64}\s*$/
    return regEx.test(x);
}


//city calidation
function isValidCity(x){
    return isValidStreet(x);
}



//pincode validation
function isValidPincode(x){
    if(typeof x !== "string") return false;
    const regEx = /^\s*[123456789][0-9]{5}\s*$/
    return regEx.test(x);
}


//remove spaces
function removeSpaces(x){
    return x.split(" ").filter((y)=> y ).join(" ")
}



//convert to upperacse
function trimAndUpperCase(x){
    x = x.split(" ").filter((y)=> y )
    return x.map((y)=> y.charAt(0).toUpperCase() + y.slice(1)).join(" ")
}

//reduce phoneNo
function reduceNumber(x){
    return x.slice(x.length-10)
}


module.exports = {
                isValidTitle,
                isValidName,
                isValidPhone,
                isValidEmail,
                isValidPassword,
                isValidAddress,
                isValidStreet,
                isValidCity,
                isValidPincode,
                removeSpaces,
                trimAndUpperCase,
                reduceNumber
            }
