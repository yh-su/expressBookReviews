const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if(!username && !password) {
        return res.status(404).json({message: "Username and password not provided."});
    }
    if(!username) {
        return res.status(404).json({message: "Username not provided."});
    }
    if(!password) {
        return res.status(404).json({message: "Password not provided."});
    }

    let filtered_users = users.filter((user)=>{
        return user.username === username
      });
    
    if (filtered_users.length == 0) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred."});
    }
    return res.status(404).json({message: "User already exists!"});    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let filtered_books = {};
    Object.keys(books).forEach(function(key) {
    if(books[key]["author"] == req.params.author) {
        filtered_books[key] = books[key];
    }
  })
  return res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let filtered_books = {};
    Object.keys(books).forEach(function(key) {
    if(books[key]["title"] == req.params.title) {
        filtered_books[key] = books[key];
    }
  })
  return res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]["reviews"], null, 4));
});

module.exports.general = public_users;
