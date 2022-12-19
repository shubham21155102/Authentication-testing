// app.js file
const express=require('express');
const bodyParser=require('body-parser');
const env=require('dotenv').config();
const app=express();
const bcrypt=require('bcryptjs');
//set up the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//middlewares
app.use(express.json());
require('./config/db');
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.get('/',(req,res)=>{
res.render('login');
}
);
app.get('/register',(req,res)=>{
res.render('admins');
});
const userModel=require('./models/user');
//bcrypt


app.post('/register',async (req,res)=>{
    try{

        var {username ,password,name}=req.body;
        
// var hashName=bcrypt.hashSync(name,salt);
// var hashUsername=bcrypt.hashSync(username,salt);
// username=hashUsername;
// name=hashName;
// password=hash;
        const user=new userModel({
            username:username,
            password:password,
            name:name
        });
        const token=await user.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
        //cookie me token ko save kia
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+300000),
            httpOnly:true,
            // secure:true
        });
        // console.log(user);
        await user.save();
        res.status(201).render('login');
    }catch(error)
    {
        res.status(400).render('error');
        console.log(error);
    }
});
app.post('/',async (req,res)=>{
    try{
        const {username ,password}=req.body;
        const users=await userModel.findOne({
            username:username,
            // password:password       
        });
        // console.log(users)
        const token=await users.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
        console.log(token);
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+500000),
            // expires:'1 day',
            httpOnly:true,
            // secure:true
        });
        // console.log(req.cookies.jwt);
        if(users.username===username && bcrypt.compareSync(password, users.password)){
            res.send('login successfull');
            // res.render('admins');
        }
        else{
            res.render('error');
        }

    }catch(error)
    {
        res.status(400).render('error');
        console.log(error);
    }
// res.render('login');
// const {username ,password}=req.body;
// console.log (username,password);
});
const auth=require('./middlewares/auth');
app.get('/secret',auth, (req,res)=>{
    res.render('secret');
    console.log(req.cookies.jwt);
}
);
const port=process.env.PORT || 3000;
app.listen(port,()=>{
console.log(`Server is running on port `+port);
});