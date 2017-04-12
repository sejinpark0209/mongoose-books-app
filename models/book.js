// book.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
     title: String,
    // you should fill the rest of this in
     author: String,
     image: String,
     release_date: String

 });

var Book = mongoose.model('Book', BookSchema);


module.exports = Book;