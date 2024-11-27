const express = require('express');
const NotesRouter = express.Router();
const fetchUser = require("../middlewares/fetchUser");
const Notes = require('../models/Notes.js');
const { body, validationResult } = require('express-validator');

// This Is Route for Fetching the Notes Corressponding to the USerId.Here Login is Reqd:
NotesRouter.get('/getnotes',fetchUser,async(req,res)=>
{
 try{
    let userId = await req.user.id;
    let getNotes = await Notes.find({UserId:userId});
    console.log(`These are the notes ${getNotes}`);
       if(getNotes==null){
          res.status(500).json({error:"Notes Not Found Please Add Notes"});
       }
       else{
        res.status(200).json({Notes:getNotes});        
       }       
 }
 catch(err){
    console.log(err);
  res.status(401).send(err); 

 }   
 
});
//   Route for Adding a new Note Corressponding to the User Id .Here Loggin is reqd:

NotesRouter.post('/addnotes',[
     // here Validations are Performed So that The User Will Not store empty Lists:
    body("Title", "Must be at Least 5 charactes").isLength({ min: 5 }),
    body("Description","Must be at least 10 characters long").isLength({min:10}),
    body("Tags","Must be at least 5 characters long").isLength({min:5})],fetchUser,async(req,res)=>{
   try{   

      // If Notes Will be Empty Then it Will return Errors:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
       /// Creation Of Notes coressponding To the user Id:
      let id  = req.user.id; 
       let createNote = await Notes.create({
         UserId:id,  
        Title:req.body.Title,
        Description: req.body.Description,
        Tags:req.body.Tags
       })
       if(createNote){
          res.json(createNote);
       }        
   }
   catch(err){
    console.log(err);
    res.status(401).send(err);
   }        


});
   // Router to update an existting note.Login is reqd: 
NotesRouter.put('/updatenotes/:id',fetchUser,async(req,res)=>{
   try{
       // Desctructuring the Body:
      //  let [Title,Description,Tags] =  await req.body;
         // user Id Token is Reqd for updating the notes:  
       let userId = JSON.stringify(req.user.id);                         
         console.log(userId," authid");
      let updatedData = {
         Title:req.body.Title,
         Description:req.body.Description,
         Tags:req.body.Tags
      }
            
      let validNote = await Notes.findOne({_id:req.params.id});
           let idStr  =   JSON.stringify(validNote.UserId);
           console.log(idStr,"UserId");       
         if(idStr==userId)
         {           
            let updatedNote = await  Notes.findByIdAndUpdate(req.params.id,{$set:updatedData});
                 if(updatedNote){
                  console.log("Note Updated Successfully");
                    res.json({updatedNote:updatedNote}); 
                 }
            } 
            else{
               res.status(400).send("Sorry You are not Authorised To Update This Note");
            }             
   }
   catch(err){
      console.log(err);
      res.status(400).send("Error in Updating");
   }
});

NotesRouter.delete('/deletenotes/:id',fetchUser,async(req,res)=>{
     try{

       // Getting note Id from Parameters :
        let noteId  =  req.params.id;
          // Checking Note Corressponding to the note id:
        let getNote = await Notes.findOne({_id:noteId});
        
           if(!getNote){
            res.status.send("No Such Note Found in directory!")
           }        
         let UserId =  await  JSON.stringify (getNote.UserId);
         console.log(UserId,"USerId");
          // getting authId FRom fetchuser MiddleWare:
          let authId = JSON.stringify(req.user.id);
          console.log(authId,"AuthId");
          //Cjhecking if user is Auth and Owner Of this Very Note:
          if(UserId==authId){
            let deletedNote  = await Notes.deleteOne({_id:req.params.id}); 
                if(deletedNote){
                  res.json({note:"Note Deleted SucessFully",deletednote:deletedNote});
                }
                else{
                  res.send("Problem Occured While Deleting Note!");
                }
                                               
          }
          else{
            res.status(401).json({error:"UnAuthorized Acess ! Please Login From Your Personal Account"})
          } 

     }
     catch(err){
      console.log(err);
      res.status(401).send("Note Not Found!");
     }  

})

module.exports = NotesRouter;