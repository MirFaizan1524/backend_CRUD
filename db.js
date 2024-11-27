const mongoose = require('mongoose');
//console.log(mongoose);
  
let  connectMongo  = async()=>{
   
     let connectionRes =  await mongoose.connect('mongodb://127.0.0.1:27017/inotebook');
        if(connectionRes){
            console.log("Connected to MongoDb");
        }
        
    }  
module.exports = connectMongo;  
