const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ 'username': username, 'password': password });
      return res.status(200).json({ message: 'Customer successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'Username already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user, please provide a username and password.' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    //   res.send(JSON.stringify({books},null,4));
    const getBooks =  new Promise((resolve, reject) => {
        resolve(books);
    }).then((bks) => {
        res.send(JSON.stringify({ books: bks }, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn= parseInt(req.params.isbn);
    book = books[isbn]
    if(book){
        res.json(book);
    }
    else{
        res.status(404).json({"message":`ISBN ${isbn} not found`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        const author = req.params.author;
        const bookList = Object.values(books).filter(book => book.author === author);
        if (bookList.length > 0) {
          resolve(res.status(200).json(bookList));
        } else {
          reject(res.status(404).json({ message: `The books are not found by author: ${author}` }));
        }
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
    const title = req.params.title;
    const bookList = Object.values(books).filter(book => book.title  === title );
    if (bookList.length > 0) {
        resolve(res.status(200).json(bookList));
    } else {
        reject(res.status(404).json({ message: `There is no books with title: ${title}` }));
    }
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
        resolve(res.status(200).json(book.reviews));
    } else {
        reject({status:404, message:`ISBN ${isbn} not found`});
    }
  });
});

module.exports.general = public_users;
