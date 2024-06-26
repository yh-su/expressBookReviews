const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let valid_users = users.filter((user)=>{
        return (user.username === username)});
    return (valid_users.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let valid_users = users.filter((user)=>{
        return (user.username === username && user.password === password)});
    return (valid_users.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Username or password missing"});
    }

    if (!isValid(username)) {
        return res.status(404).json({message: "Username does not match existing user"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Login failed"});
    }  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => { 
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];
    if(!books[isbn]) {
        return res.status(404).json({message: "No book exists for given ISBN"});
    }
    books[isbn]["reviews"][username] = review;
    return res.status(200).json({message: "Review successfully added"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => { 
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    if(!books[isbn]) {
        return res.status(404).json({message: "No book exists for given ISBN"});
    }
    if (!books[isbn]["reviews"][username]) {
        return res.status(404).json({message: "No review to delete"});
    }
    delete books[isbn]["reviews"][username];
    return res.status(200).json({message: "Review successfully deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
