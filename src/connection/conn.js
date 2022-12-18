var mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();



mongoose.connect(process.env.db , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
}).then(function (){
    console.log("connection sucessful");
}).catch(function(err){
    console.log(err);
})
    
 
