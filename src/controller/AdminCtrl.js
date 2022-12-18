
const Admin = require("../model/Admin_model");


const postAdminLogin = async (req , res) =>{
    try {


        const { email, password } = req.body;

        if(!email || !password ){
            return res.status(200).send("Plz Fill The all fields ");
        }

        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            return res.status(400).json({
                    success: false,
                    message: "Admin Not Existed"
                })
        }else{

            const isMatch = await admin.matchPassword(password)
            if (!isMatch) {
                return res.status(400).json({
                    sucess: false,
                    message: "Incorrect password",
                })
            }else{
            const token = await admin.generateToken();
            const option = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                
            }

            const aa = admin._id;
            res.cookie("admin_id" , aa.toString() , option);
            res.status(200).cookie("token", token, option).json({
                success: true,
                admin,
                token,
            })
          }   
      }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}




const getAdminData = async (req,res) =>{
    try {

        const { id } = req.params;

        const user = await Admin.findById(id);

        res.status(200).json({
            code:200,
            status:"success",
            message:"admin fetched successfully",
            data : user
        })
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}




const getQuizData = async (req,res) =>{
    try {

       

        const quiz = await Admin.find({'_id':req.params.id});
        console.log(quiz);
        res.status(200).json({
            code:200,
            status:"success",
            message:"QuizData fetched successfully",
            data : quiz
        });
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}


const getAllQuizData = async (req,res)=>{
    try {

       

        const quiz = await Admin.find({ Quiz: {$elemMatch: { Status_quiz : "open"  } }});
        console.log(quiz);
        res.status(200).json({
            code:200,
            status:"success",
            message:"QuizData fetched successfully",
            data : quiz
        });
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
};


const getSpecificQuiz = async (req,res)=>{
    try {

       const { id , Quiz_id } = req.params;

        const quiz = await  Admin.findById({'_id':id} , { Quiz: {$elemMatch: { _id : Quiz_id }}});

        res.status(200).json({
            code:200,
            status:"success",
            message:"QuizData fetched successfully",
            data : quiz
        })
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }

    
   
};






const getQuestionData = async (req,res)=>{
    try {

       const { title } = req.body;

        const Question = await  Admin.find({ Quiz: {$elemMatch: {  Questions : { Title_quiz : title } } }});

        res.status(200).json({
            code:200,
            status:"success",
            message:"Question fetched successfully",
            data : Question
        })
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }

    
   
};





changeStatus =  (req,res)=>{


    console.log("Hii");

       
    Admin.findOneAndUpdate({ _id : req.params.post_id , "Quiz._id" : req.params.Quiz_id } ,
                             { '$set' : { 'Quiz.$.Status_quiz' : 'Close'}} ,(err, data)=>{
        if(!err){

                var index = data.Quiz.findIndex(x => x.id === req.params.Quiz_id);
                console.log(index);
            
                Admin.findOne({ _id : req.params.post_id } , ( err , user ) =>{
                    if(err){
                        console.log(err)
                    }
                            
                        const temp = user.Del_Quiz ; 
                    
                        temp.unshift({

                        Status_quiz : "Done",
                        Title_quiz : data.Quiz[index].Title_quiz , 
                        Desc_quiz : data.Quiz[index].Desc_quiz 
                                
                        })
                        user.Del_Quiz = temp;
                    
                
                
                 user.save()                            
                .then((data)=>{
                        console.log("Doned");

                                Admin.findByIdAndUpdate({'_id':req.params.post_id} , {$pull: { Quiz: { _id : req.params.Quiz_id }}} , (err,data)=>{

                                if(!err){
                                    console.log("deleted");
                                    
                                }else{
                                    console.log(err);
                                }
                            })

                            res.status(200);
                        })
                    .catch((err)=>{
                        console.log(err);
                    });
                })


            
                res.status(200);
        }else{
            console.log(err);
        }
    })
};




QuestionEntry = (req,res)=>{

    const body=req.body;
    console.log(req.body);

    Admin.findOne({ _id : req.params.id } , ( err , user ) =>{

        if(err){
            console.log(err)
        }
        var aaa;
        console.log(user.Quiz.findIndex(x => x.Title_quiz == req.body.Title_quiz));

        var index = user.Quiz.findIndex(x => x.Title_quiz == body.Title_quiz);
        console.log(index);
        
        if(index == -1){
            index=0;
        
           
            const sender = user.Quiz ; 

            sender.unshift({
                
                Title_quiz : body.Title_quiz,
                Status_quiz:"open",
                Desc_quiz : body.Desc_quiz

    
            })
    
            user.Quiz = sender;
    
        
            const sss = user.Quiz[index].Questions ; 

            sss.unshift({

                que : body.que ,  
                option1 : body.option1,
                option2 : body.option2,
                option3 : body.option3,
                option4 : body.option4,
                ans : body.ans, 

            })
            
            user.Quiz[index].Questions = sss;


            console.log("Doned New Created");
    
    
        }else{
            if(user.Quiz[index].Title_quiz == body.Title_quiz){
                console.log(index);
            console.log(user.Quiz[index].Title_quiz);

                console.log(user.Quiz[index].Questions);

                const sss = user.Quiz[index].Questions ; 

                sss.unshift({

                    que : body.que , 
                    option1 : body.option1,
                    option2 : body.option2,
                    option3 : body.option3,
                    option4 : body.option4, 
                    ans : body.ans, 

                })
                
                user.Quiz[index].Questions = sss;
                console.log("Doned Modified");

        }


    }

        

                


       
        user.save()        
        .then((data)=>{
            
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err);
        });
    })
};


quizEntry = (req,res)=>{

    const body=req.body;
   
    Admin.findOne({ _id : req.params.id } , ( err , user ) =>{

        if(err){
            console.log(err)
        }
        
        const sender = user.Quiz ; 

        sender.unshift({
            Status_quiz : "open" ,
            
            Title_quiz : body.Title_quiz ,  
            
            Desc_quiz : body.Desc_Quiz, 

        })

        user.Quiz = sender;





       
        user.save()        
        .then((data)=>{
            console.log("Doned");
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err);
        });
    })
};




const deleteAdminPermanent = async (req,res) =>{
    try {

        const { id  , Quiz_id} = req.params;

        const skill = await Admin.findByIdAndUpdate({'_id': id} , {$pull: { Del_Quiz: { _id : Quiz_id }}});

        if(!skill){
            res.status(404).json({
                code:404,
                status:"failure",
                message:"Skill not found"
            })  
        }

        


        res.status(200).json({
            code:200,
            status:"success",
            message:"Skill deleted successfully",
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}



const updateAdmin = async (req,res) =>{
    try {

        const { id } = req.params;
        const {name , email , pass , sirname , mobile_no , address} = req.body;

        const admin = await Admin.findById(id);

        if(!admin){
            res.status(404).json({
                code:404,
                status:"failure",
                message:"admin not found"
            })  
        }

        const updatedadmin = {
            _id: id,
            name , email , pass , sirname , mobile_no , address
        }

        await Admin.updateOne({_id : id} , {$set: updatedadmin} , {new : true});

        res.status(200).json({
            code:200,
            status:"success",
            message:"admin updated successfully",
            data : updatedadmin
        })
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}



module.exports = {
  postAdminLogin,

  getAdminData,
  getSpecificQuiz,
  getQuizData,
  getQuestionData,
  getAllQuizData,
  QuestionEntry,
  quizEntry,
  changeStatus,
  
  deleteAdminPermanent,
  
  updateAdmin,
  
};
