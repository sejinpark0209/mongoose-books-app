// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// connect to db models
var db = require('./models');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));




////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find({})
    .populate('author')
    .exec(function(err, books) {
      if(err) {
        res.status(500).send(err);
        console.log(err);
      } else {
        res.json(books);
      }  
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  db.Book.findById(req.params.id)
    .populate('author')
    .exec(function(err, book) {
      if(err) {
        res.status(500).send(err);
        console.log(err);
      } else {
        res.json(books);
      }
    })
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });
  db.Author.findOne({name: req.body.author}, function(err, author) {
    if(err) {
      res.status(500).send();
      console.log(err);
    } else {
      if(author === null) {
        console.log(err);
        res.status(500).send();
      } else {
        newBook.author = author;
        newBook.save(function(err, book) {
          if(err) {
            console.log(err);
            res.status(500).send();
          } else {
            console.log(book);
            res.json(book);
          }
        });
      }
    }
  });
});


// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    if(err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.json(deletedBook);
    }
  });
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});