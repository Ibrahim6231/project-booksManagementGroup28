const mongoose = require('mongoose')
const userModel=require('../models/userModel')
const bookModel=require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const {isBookTitle, isExcerpt, isISBN, isCategory, isSubcategory,isValid, isValidObjectId, isValidRequest, removeSpace } = require('../validators/bookValidation')


const createBooks = async function (req, res) {     //1.authentication 2.bookValidation 3.createBooks
    try {

        const { title, excerpt, userId, ISBN, category, subcategory } = data = req.body
        let savedData = await bookModel.create(data);
        return res.status(201).send({ status: true, message: "Success", data: savedData })
     
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}//By- Ibrahim, Sujeet


/*--------------------------------------------------------GET BOOKS-------------------------------------------
Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field.
Query param can have any combination of below filters. By userId, By category, By subcategory. Return all books sorted by book name in Alphabatical order
*/


const booksByQuery = async function(req, res){
    try{
        const {userId, category, subcategory} = req.query;          
        const filters = {isDeleted:false};
        if (!isValidObjectId(userId)) {return res.status(400).send({status: false, message: "please enter valid user Id"})}
        if(userId){filters.userId = userId};

        if(category){filters.category = category};
        if(subcategory){filters.subcategory ={ $all:subcategory.split(",")}};       //{"locations" : { $all : ["New York", "Texas"]}}

        const books = await bookModel.find(filters).select({title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1});
    
        if(books.length === 0) return res.status(404).send({status:false, message:"No match found"});
    
        return res.status(200).send({status:true, message: "Books list", data:books});
    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }

}



//------------------------------------Get book By id----------------------------------------------------------------------//

const getBook = async function (req,res) {
    try {
    let id = req.params.bookId
 
    if (!id) {
        return res.status(400).send({status: false, message: "please give book id in path param"})
    }

    if (!isValidObjectId(id)) {
        return res.status(400).send({status: false, message: "please enter valid objectId"})
    }

    if (id.length != 24) {
        return res.status(400).send({status: false, message: "please enter proper length of ObjectId (24)"})
    }

    let savedData = await bookModel.findById(id).select({deletedAt:0, __v:0}) 


    if(!savedData || savedData.isDeleted == true) {
        return res.status(404).send({status: false, message: "no such book exists or deleted"}) 
    }

    let getReview = await reviewModel.find({bookId : id, isDeleted: false})

    savedData._doc["reviewsData"] = getReview

    return res.status(200).send({status: true, message: "Books list", data : savedData})
} catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message })
}
}

//---------------------------------------------updateBook By id----------------------------------------------------------------------//


const updateBook = async function (req, res) {

    try {
        let bookID = req.params.bookId
        let { title, excerpt, releasedAt, ISBN, userId, category, subcategory, isDeleted } = req.body

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter valid request" })
        }

        if (userId || category || subcategory || isDeleted) {
            return res.status(400).send({ status: false, message: "only title, excerpt, releasedAt, ISBN are allowed to update" })
        }

        if (!isValidObjectId(bookID)) {
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({ _id: bookID, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist or deleted' })
        }

        // check duplicate title
        const duplicateTitle = await bookModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title already exists" })
        }

        // Check duplicate ISBN
        const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
        if (duplicateISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already exist" })
        }

        let updatedData = await bookModel.findOneAndUpdate({ _id: bookID, isDeleted: false }, { $set: {title:title, excerpt: excerpt, releasedAt:releasedAt, ISBN:ISBN} }, { new: true })
        if (!updatedData) {
            return res.status(404).send({ status: false, message: 'Book with this data not found' })
        }
        return res.status(200).send({ status: true, message: "success", data: updatedData });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


//------------------------------------------------deleteBook By Id------------------------------------------------------------------//

const deleteBook = async function (req, res) {
    try {
        let id = req.params.bookId
 
    if (!id) {
        return res.status(400).send({status: false, message: "please give book id in path param"})
    }

    if (!isValidObjectId(id)) {
        return res.status(400).send({status: false, message: "please enter valid objectId"})
    }

    let checkBook = await bookModel.findOne({_id: id})
    if (!checkBook) {
        return res.status(404).send({status: false, message: "no such book exists "})
    }

    if (id.length != 24) {
        return res.status(400).send({status: false, message: "please enter proper length of ObjectId (24)"})
    }
        let deleteBook = await bookModel.updateOne(
            { _id: id, isDeleted: false }, 
            {$set:  {isDeleted: true}, deletedAt : Date.now()}, 
            { new: true })

            if (deleteBook.modifiedCount == 0) {
                return res.status(400).send({status: false, message: "this book has been deleted already"})
            }

        return res.status(200).send({ status: true, message: "This book is deleted successfully", data: deleteBook, })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = {getBook, createBooks, booksByQuery, deleteBook, updateBook}

