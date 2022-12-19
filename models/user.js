//UserModel Schema
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
name:{
 type:String,
 required:[true,'name is required'],
 },
username:{
 type:String,
 required:[true,'email is required'],
 unique:true
},
password:{
 type:String,
required:[true, 'password is required']
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]
});
userSchema.methods.generateAuthToken=async function(){
    try{
        const token= jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
        // console.log(token);
    }catch(error)
    {
        console.log(error);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
});

const userModel=mongoose.model('Users',userSchema);
module.exports=userModel;