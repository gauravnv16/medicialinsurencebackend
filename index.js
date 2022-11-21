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

app.get('/api/user/:id',(req,res) => {
    User.find({Id:req.params.id},(err,result) => {
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
        });
    });
});

//logi

app.post('/api/register',urlencodedParser,(req,res) => {
    const uname = req.query.uname;
    const email = req.query.email;
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
                Proof_Verified_Status:false,
                ApprovalType:'Profile',
        });
            user.save((err,res) => {
                if (err) throw err;
            })
            
        }
    });
})

// API_URL+'api/user/'+params.id+"/approve"
app.get('/api/user/:id/approve',(req,res) => {
    User.updateOne({Id:req.params.id},{isApproved:true,ApprovalType:''},(err,msg) => {
        res.send("Updated");
        console.log("Approved")
    })
});


app.post('/api/user/file',urlencodedParser,(req,res) => {
    if(req.query.type === 'pic'){
        User.updateOne({Id:req.query.id},{Pic:req.query.pic},(err,msg) => {
            console.log(msg)
        }) 
    }
    else if(req.query.type == 'proof') {
        User.updateOne({Id:req.query.id},{Proof:req.query.proof},(err,msg) => {
            res.send("Updated");
        }) 
    }
    res.send("success")
    // console.log(req.query)

})

app.listen(PORT);
