const mongoose  = require('mongoose');
 const { Schema } = mongoose;

const userSchema = new Schema({

  Name:{
    type: String,
    required: true 
  },
  Email:{
    type: String,
    required: true 
  },
  Password:{
    type: String,
    required: true 
  },
  Date:{
    type: Date,
    default :Date.now
    
  },

});
const User = mongoose.model("User",userSchema);
  module.exports = User;
