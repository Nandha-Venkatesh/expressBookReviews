const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if(userswithsamename.length > 0){
        return true;
    }
    else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesExist(username)){
        // The username is not already taken
        users.push({"username": username, "password": password})
        return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    }
    else{
        return res.status(400).json({message: "Username already exists!"});
    }
  }
  else if(!username){
      return res.status(400).json({message: "You didn't enter a username! Please enter a username."});
  }
  else if(!password){
      return res.status(400).json({message: "You didn't enter a password! Please enter a password."});
  }

  // Implicit Else
  return res.status(400).json({message: "An error occurred. Unable to register customer."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    matching_books = Object.values(books).filter((book) => {
        return book.author === author;
    });

    if(matching_books.length > 0){
        return res.status(200).json(matching_books);
    }
    return res.status(404).json({message: "Error: Could not find any book with that author!"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    matching_books = Object.values(books).filter((book) => {
        return book.title === title;
    });

    if(matching_books.length > 0){
        return res.status(200).json(matching_books);
    }
    return res.status(404).json({message: "Error: Could not find any book with that title!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
