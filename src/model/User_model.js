
var conn = require("../connection/conn");

var mongoose = require("mongoose");
const crypto = require("crypto");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require('dotenv');


const QuestionSchema = new mongoose.Schema({
    que : {
        type : String
    },
    option1 : {
        type : String
    },
    option2 : {
        type : String
    },
    option3 : {
        type : String
    },
    option4 : {
        type : String
    },
    ans : {
        type : String
    },
    selected_option:{
        type:String
    },
    explanation:{
        type:String
    }
    
    
});


const QuizSchema = new mongoose.Schema({
    Title_quiz : {
        type : String
    },
    Desc_quiz : {
        type : String
    },
    Status_quiz : {
        type : String
    },
    Score_Quiz:{
        type:String
    },
    Questions : [QuestionSchema]
    
});


const personSchema = new mongoose.Schema({
        name:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        },
        sirname:{
            type:String
        },
        status:{
            type:String
        },
        gender:{
            type:String
        },
        mobile_no:{
            type:Number
        },
        address:{
            type:String
        },
        product:{
            type:String
        },
        post:{
            type:String
        },
        desc:{
            type:String
        },
        status : {
            type:String
        },
        Quiz:[QuizSchema],
        Scr_Quiz : [QuizSchema],
        

});



personSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next();
})


personSchema.methods.getForgotPasswordToken = function(){

    const forgotToken = crypto.randomBytes(20).toString("hex");

    console.log(forgotToken);
    this.ForgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

    this.ForgotPasswordExpiry = Date.now() + 20*60*1000;

    return forgotToken;
}


personSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}



personSchema.methods.generateToken = function (){
    return jwt.sign({_id:this._id},process.env.jwt_secrete)
}



const Person = new mongoose.model("Person" , personSchema);



module.exports =  Person ;
