const express = require("express");
const jwtToken = require('jsonwebtoken');

const fetchUser = async (req, res, next) => {
    let secret_key = "this$is$the$world$of$hello$world";
    // get token from the header inorder to get details of user: 
    let token = req.header('auth-token');
    if (!token) {
        res.status(401).send("Access Denied for the User!");
    }
     else {
        try {
            let verifiedToken = jwtToken.verify(token, secret_key);
            // This verified Token contains the Unique Id which was Assigned During LoGIn:                            
            req.user = verifiedToken;
            next();
        }
        catch (err) {
            console.log(err);
            res.status(401).json({ error: 'invalid token ' });
        }
    }
}

module.exports = fetchUser;
