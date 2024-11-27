const mongoose  = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
   UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   },

  Title:{
    type: String,
    required: true 
  },
  Description:{
    type: String,
    required: true 
  },
  Tags:{
    type: String,
    default: "General",
    required: true 
  },
  Date:{
    type: Date,
    default :Date.now
    
  },

});
userNotes = mongoose.model("Notes",notesSchema);
module.exports = userNotes;