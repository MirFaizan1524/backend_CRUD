const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
// Here Validation is done :
router.post("/", [
  body("Name", "Name must be Of minimum 5 chars").isLength({ min: 5 }),
  body("Email").isEmail(),
  body("Password").isLength({ min: 5 })
], async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Finding user");
    // Destructuring Email and Password FRom the Body :
    console.log(req.body);
      let {Email,Password} = req.body;
                
    let user = await User.findOne({ Email: Email }).select({Email:1});
 
 if (user) {
      console.log("user already exists");  
      return res.status(401).json({ error: "User already Exists!" });;
 
    }
    else {
        // Generating the salt for the hashedCode: 
        let saltRounds =  await bcrypt.genSalt(10);
        // Calculating the hash of the Password For More Security
        let hashPassword = await bcrypt.hash(Password,saltRounds);         
      console.log("creating new user");
      user = await User.create({
        Name: req.body.Name,
        Email: Email,
        Password: hashPassword,
      }).then(user => res.json(user));


    }

  }
  catch(err){
     console.log(err);
     res.status(409).send("Internal server Error");
  }            
});



module.exports = router;