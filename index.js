const connectMongo = require('./db.js');
const express = require('express');

connectMongo();

const app = express();

let portNumber = 5000;
   // Available routes:
app.use(express.json());
app.use(express.urlencoded({extended:false}));
 app.use('/signup',require("./Routes/register.js"),(req,res)=>{
//     res.send("Hello Signup");
 });
app.use('/login',require("./Routes/login.js"),(req,res)=>{
    //  res.send("Hello Login");
});
app.use('/notes',require("./Routes/Notes.js"),(req,res)=>{
    // res.send("Welcome To the Notes Page");
});
app.get('/about',(req,res)=>{
 
    res.send("Hello this is about page");  
 

})
app.listen(portNumber,()=>{
    console.log(`listening to the portnumber : ${portNumber}`);
})
