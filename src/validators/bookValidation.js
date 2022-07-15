const mongoose = require("mongoose");
const validator = require('validator');

//title validation
function isBookTitle(x){
    const regEx = /^\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9\s]+)*[a-zA-Z0-9\s]{1,64}\s*$/ ;
    return regEx.test(x);
}

//Excerpt validation
function isExcerpt(x){
    if(!x || typeof x !== "string") return false;
    const regEx = /\s*[a-zA-Z]{2,}\s*/g ;
    return Boolean(x.match(regEx)); 
}


//ISBN validation
function isISBN(x){
    if(typeof x !== "string") return false
    const regEx = /^\s*([9][7][89][-]?)?[\d][-]?[\d]{4}[-]?[\d]{4}[-]?[\d]\s*$/;
    return regEx.test(x);
}


//categroy
function isCategory(x){ return isExcerpt(x)}

//subCategory
function isSubcategory(x){ 
    // if(!Array.isArray(x)) return false;
    if(!x) return false
    if(x.trim().length === 0) return false;
    // for(let i=0; i<x.length; i++){
    //     if(!x[i]) return false;
    //     if(typeof x[i] !== "string") return false;
    //     if(x[i].trim().length === 0) return false;
    // }
    return true
}

//review validation
function isReviewCount(x){
    //review count will be updated by server not by user
}

function isDate(x){
    const reg1 = /^[12][\d]{3}[-][01][\d]-[0123][\d](\s[\d]{2}:[\d]{2}:[\d]{2})?$/
    // const reg1 = /^[12][\d]{3}[-][01][\d]-[0123][\d]$/
    return reg1.test(x)
}
// console.log(isDate("12-07-2022"))
// console.log(isDate("12-07-2022 13:29:05"))
// console.log(isDate("2022-12-07"))
// console.log(isDate("2022-05-07 13:29:05"))


const isValid = function (value) {
    if (typeof value == "number" || typeof value == "boolean" || value == null ) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true 
}

const removeSpace = function (value) {
    let check = value.split(" ").filter(abc => abc).join(" ")
     return check
}

const isValidObjectId = function (value) {
    let ObjectId = mongoose.Types.ObjectId
    return ObjectId.isValid(value)
}


const isValidRequest = function (value) {
    if (Object.keys(value).length == 0 ) return false
    return true
}


module.exports = {isBookTitle, isExcerpt, isISBN, isCategory, isSubcategory,isValid, isValidObjectId, isValidRequest, removeSpace, isDate}


