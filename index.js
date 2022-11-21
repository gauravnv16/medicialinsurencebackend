const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8000;
require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./Users/Users');
const bcrypt = require('bcrypt');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const uuid = require('uuid');
mongoose.connect(`mongodb+srv://Gaurav_nv:Amirtha28@cluster0.83xxr.mongodb.net/medicalinsurence?retryWrites=true&w=majority`,() => {

});

app.use(cors({
    origin: '*'
}));


app.get("/",(req,res) => {
    res.send("server ready!!");
})

app.get('/api/users',(req,res) => {
    User.find({},(err,result) => {
        res.send(result);
    });
});

app.post('/api/login',urlencodedParser,(req,res) => {
    const uname = req.query.uname;
    const pass = req.query.pass;
    User.find({"Username":uname},(err,result) => {
        const resp = bcrypt.compare(pass,result[0].Password,(err,match) => {
            res.send(
                result
            )
            console.log("completed")
        });
    });
});

//logi

app.post('/api/register',urlencodedParser,(req,res) => {
    const uname = req.query.uname;
    const email = req.query.email;
    console.log("[+] got the request!!!");
    console.log("[+] processing request!!!");
    bcrypt.hash(req.query.pass,10,(err,result) => {
        if(result!=undefined){
            const user = new User({
                Id:uuid.v4(),
                Name:'',
                Username:uname,
                Phone_no:'',
                Email:email,
                Gender:'',
                Alternate:[],
                Password:result,
                Address:'',
                Pic:'',
                Proof_file:String,
                Proof_type:String,
                Policy:[],
                isAdmin:false,
                isEditable:false,
                isApproved:false,
                notes:'',
                messages:[],
                Proof_Verified_Status:false
        });
            user.save((err,res) => {
                if (err) throw err;
            })
            
        }
    });
})




app.listen(PORT);
