const mongoose = require('mongoose')
let ObjectId =  mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId : {
        type : ObjectId,
        ref: 'book',
        required: true
    },
    reviewedBy : {
        type :String,
        default: "Guest",
        required: true,
        trim : true
    },
    reviewedAt : {
        type : Date,
        required : true
    },
    rating: {
        type : Number,
        required: true
    },
    review : {
        type : String,
        trim : true
    },
    isDeleted : {
        type : Boolean,
        default: false
    }
})

module.exports = mongoose.model('Review', reviewSchema)