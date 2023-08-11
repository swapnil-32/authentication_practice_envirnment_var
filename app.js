//jshint esversion:6
import express from "express"
import bodyparser from "body-parser"
import ejs from "ejs"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"
import md5 from "md5"
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
    const newuser=new user({
        email:req.body.username,
        password:md5(req.body.password)
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
app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=md5(req.body.password);
    user.findOne({email:username},(err,fitem)=>{
        if(err){
            console.log(err);
        }
        else{
            if(fitem.password==password){
                res.render("secrets");
            }
        }
    })
})
app.listen(3000,()=>{
    console.log("server running on port 3000");
})