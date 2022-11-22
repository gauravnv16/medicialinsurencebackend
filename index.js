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
const Description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque distinctio consequuntur, non reiciendis deleniti veritatis! Ipsum, deserunt! Ab sunt eum fugiat molestias rerum sint qui necessitatibus, alias veniam dignissimos suscipit voluptate quae tempore id. Nihil iusto sed corrupti temporibus commodi minus qui totam odit harum? Iste omnis dicta eaque deserunt ratione, magni aut nulla natus, cumque qui eum iure odio in eligendi dolorum deleniti excepturi dolor voluptate. Repellendus quos optio voluptates recusandae harum voluptatibus laboriosam quasi, autem sunt vel voluptatem nisi, nesciunt nostrum mollitia laudantium similique quas soluta, voluptate accusantium hic eius. Molestias voluptatibus dicta molestiae, temporibus pariatur unde nisi.'
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
            const user = {
                        Id:uuid.v4(),
                        Userpolicyname:'',
                        Userpolicydescription:'',
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
                        isAdmin:false,
                        isEditable:false,
                        isApproved:false,
                        notes:'',
                        messages:[],
                        Proof_Verified_Status:false,
                        ProofPic:'',
                        ApprovalType:'Profile Approval',
                     
                };
            User.insertMany([user],(err,resu) => {
                res.send("success")
            })
        //     const user = new User({
        //         Id:uuid.v4(),
        //         Userpolicyname:'',
        //         Userpolicydescription:'',
        //         Name:'',
        //         Username:uname,
        //         Phone_no:'',
        //         Email:email,
        //         Gender:'',
        //         Alternate:[],
        //         Password:result,
        //         Address:'',
        //         Pic:'',
        //         Proof_file:String,
        //         Proof_type:String,
        //         isAdmin:false,
        //         isEditable:false,
        //         isApproved:false,
        //         notes:'',
        //         messages:[],
        //         Proof_Verified_Status:false,
        //         ApprovalType:'Profile Approval',
             
        // });
        //     user.save((err,resu) => {
        //         if (err) throw err;
        //         console.log(resu);
        //         res.send("Success");
        //     })
            
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

app.post('/api/user/:id/update',urlencodedParser,(req,res) => {
    User.updateOne({Id:req.params.id},req.query,(err,msg) => {
        console.log(msg)
    })
});


app.post('/api/user/file',urlencodedParser,(req,res) => {
    console.log("requexted");
    console.log(req.query)
    if(req.query.type === 'pic'){
        User.updateOne({Id:req.query.id},{Pic:req.query.pic},(err,msg) => {
            console.log(msg)
        }) 
    }
    else if(req.query.type == 'proof') {
        User.updateOne({Id:req.query.id},{Proof:req.query.proof},(err,msg) => {
            // res.send("Updated");
        }) 
    } else if (req.query.type == 'ProofPic') {
        
        User.updateOne({Id:req.query.id},{ProofPic:req.query.pic,isApproved:false,ApprovalType:'Policy Claim',Userpolicyname:req.query.policyname, Userpolicydescription:Description},(err,msg) => {
            // res.send("Updated");
            console.log(msg)
        }) 
    }
})

app.listen(PORT);
