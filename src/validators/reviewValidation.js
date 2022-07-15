const mongoose = require('mongoose')

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

module.exports = {isValid, isValidObjectId, isValidRequest, removeSpace}