const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Id:String,
    Name:String,
    Username:String,
    Phone_no:String,
    Email:String,
    Gender:String,
    Alternate:[],
    Password:String,
    Address:String,
    Pic:String,
    Proof_file:String,
    Proof_type:String,
    isAdmin:Boolean,
    isEditable:Boolean,
    isApproved:Boolean,
    notes:String,
    messages:[],
    Proof_Verified_Status:Boolean,

    ApprovalType:String,
    ProofPic:String,
    Userpolicyname:String,
    Userpolicydescription:String

});

module.exports = mongoose.model('User',UserSchema);