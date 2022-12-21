
var express = require("express");
const app = express();

require("./src/connection/conn");

const dotenv = require('dotenv');
dotenv.config();
const userRouter = require("./src/routes/userRouter");

const port = process.env.PORT || 5000 ;
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
    



require("dotenv").config();


app.use(cors({
    origin:"*",
    credentials: true,
}));



app.use(userRouter);

app.get("/" , (req,res)=>{
    res.send("hello from server");
})





app.listen(port , (req,res)=>{
    console.log("server is running on port 5000");
})