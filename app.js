//jshint esversion:6
import express from "express"
import bodyparser from "body-parser"
import ejs from "ejs"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"
import bcrypt from "bcrypt"
const saltround=5;
const app=express();
app.use(express.static("public"))
app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});
const userschema=new mongoose.Schema({
    email:String,
    password:String
});
// userschema.plugin(encrypt,{secret:process.env.secretes,encryptedFields:["password"]});
// userschema.plugin(encrypt,{secret:process.env.secretes,encryptedFields:["password"]});
const user=mongoose.model("user",userschema);
app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password,saltround,(err,hash)=>{
        const newuser=new user({
            email:req.body.username,
            password:hash
        })
        newuser.save((err)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        })
    })
})
app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    user.findOne({email:username},(err,fitem)=>{
        if(err){
            console.log(err);
        }
        else{
            bcrypt.compare(password, fitem.password, function(err, result) {
                if(result==true){
                    res.render("secrets");
                }
            });
        }
    })
})
app.listen(3000,()=>{
    console.log("server running on port 3000");
})