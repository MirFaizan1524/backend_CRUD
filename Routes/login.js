const express = require("express");
const Users = require("../models/User.js");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwtToken = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUser");
loginRouter.post('/', async (req, res) => {
     try {
          // Destructuring the Body:
          const { Email, Password } = req.body;
          console.log(req.body, "this is reqdata of login");
          let loginUser = await Users.findOne({ Email: Email });
          let legalUser = await bcrypt.compare(Password, loginUser.Password);
          console.log(legalUser);
            if(legalUser&&loginUser.Email){
                 let data ={
                    id:loginUser.id
                 }        
               //  Assigning webtoken To the LoggedIn user:  
              let secret_key = "this$is$the$world$of$hello$world";
               let auth_token = await jwtToken.sign(data,secret_key);
               // console.log(`jwt token for this user :${auth_token}`)               

             res.status(200).json({jwt_token:auth_token});
         }
            else{
             res.status(401).send("User Doesnt Exists");
            }                                              
     }
     catch (err) {
          console.log(err);
          console.log("Some Error Occured!");
     }

});
loginRouter.post('/getusers',fetchUser,async(req,res)=>{

      try{
          let userId =  await req.user.id;
          // consoled for Testing Purpose:
          console.log(userId,"Here i am");         
           let userDetails = await Users.findOne({_id:userId}).select("-Password");
           if(!userDetails){
               res.status(401).json({Error:"Not Details Found For the User"});
           }
            else{
               res.json(userDetails);
           }             
      }
      catch(err){
          console.log(err);
          res.status(500).send({error:err});
      } 


})

module.exports = loginRouter;