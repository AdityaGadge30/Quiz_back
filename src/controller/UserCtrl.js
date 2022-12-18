var Person = require("../model/User_model");
const Admin = require("../model/Admin_model");



const PostRegister = async (req, res) => {
    try {

        const { name , email , password , sirname , gender, mobile_no , address , status } = req.body;
        console.log(status);
   
    if(!name || !email || !password ){
        return res.status(200).send("Plz Fill The all fields ");
    }

    if(status == "Admin"){

        let admin = await Admin.findOne({ email })
        if (admin) {
            return res
                .status(400)
                .json({ success: false, message: "admin already exists" })
        }

        admin = await Admin.create({  name , status ,email , password , sirname , gender, mobile_no , address , status })

        res.status(201).json({
            success: true,
            admin,
            
        })

    }else{

        let user = await Person.findOne({ email })
        if (user) {
            return res.
                status(400).
                json({ success: false, message: "user already exists" })
        }

        user = await Person.create({  name , email ,status , password , sirname , gender, mobile_no , address , status })

        res.status(201).json({
            success: true,
            user,
            
        })

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


const PostUserLogin = async (req , res) =>{
    try {


        const { email, password } = req.body;

        if(!email || !password ){
            return res.status(200).send("Plz Fill The all fields ");
        }

        const user = await Person.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                    success: false,
                    message: "User Not Existed"
                })
        }else{

            const isMatch = await user.matchPassword(password)
            if (!isMatch) {
                return res.status(400).json({
                    sucess: false,
                    message: "Incorrect password",
                })
            }else{
            const token = await user.generateToken();
            const option = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: false
            }

            const aa = user._id;
            console.log(aa);
            res.cookie("user_id" , aa.toString() , option );
            res.status(200).cookie("token", token, option).json({
                success: true,
                user,
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


const getAllData = async (req,res) =>{
    try {

        const data = await Person.find({});

        res.status(200).json({
            code:200,
            status:"success",
            message:"Data fetched successfully",
            data : data
        })
        
    } catch (error) {
        res.status(500).json({
            code:500,
            status:"failed",
            message:"internal server error",
        })
    }
}







const getUserData = async (req,res) =>{
    try {

        const { id } = req.params;

        const user = await Person.findById(id);

        res.status(200).json({
            code:200,
            status:"success",
            message:"user fetched successfully",
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





const getUserQuizData = async (req,res) =>{
    try {

        const { id } = req.params;

        const user = await Person.find({'_id':id});

        res.status(200).json({
            code:200,
            status:"success",
            message:"userQuizData fetched successfully",
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





const getScoredQuizData = async (req,res) =>{
    try {

        const { id } = req.params;

        const user = await Person.find({'_id':id} , { Quiz: {$elemMatch: { Score_Quiz  : " " }}});

        res.status(200).json({
            code:200,
            status:"success",
            message:"Skill fetched successfully",
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






const subQuestion = (req,res)=>{

    const body = req.body;

    console.log(req.body.que);
    console.log(req.body.selected_option);
    console.log(req.body.Title_quiz);


    

    console.log(req.params.user_id);
    console.log(req.params.id);
    console.log(req.params.Quiz_id);

     
    Person.findOne({ _id : req.params.user_id } , ( err , user ) =>{

        if(err){
            console.log(err)
        }
    
        var index = user.Quiz.findIndex(x => x.Title_quiz === body.Title_quiz);
        console.log(index);
    

    Admin.findOne({ _id : req.params.id } , ( err , info ) =>{

        if(err){
            console.log(err)
        }

        

        var index_admin = info.Quiz.findIndex(x => x.Title_quiz === body.Title_quiz);
        console.log(index_admin);

        if(index_admin == -1 ){
            
            console.log("Quizz is not creatd by admin ");
        
    
        }else{
    
            var flag_admin = info.Quiz[index_admin].Questions.findIndex(x => x.que == body.que);
            console.log(flag_admin);
        
            if(flag_admin == -1 ){

                console.log("Question is not present in quiz ")
            }
            else{

            

                if(index == -1 ){
                    index=0;
                
                
                    const sender = user.Quiz ; 

                    sender.unshift({
                        
                        Title_quiz : body.Title_quiz

                    })

                    user.Quiz = sender;

                    
                    var flag = user.Quiz[index].Questions.findIndex(x => x.que == body.que);
                    console.log(flag);

                    if(flag == -1){

                            
                        const sss = user.Quiz[index].Questions ; 

                        sss.unshift({

                            que : info.Quiz[index_admin].Questions[flag_admin].que ,  
                            option1 : info.Quiz[index_admin].Questions[flag_admin].option1,
                            option2 : info.Quiz[index_admin].Questions[flag_admin].option2,
                            option3 : info.Quiz[index_admin].Questions[flag_admin].option3,
                            option4 : info.Quiz[index_admin].Questions[flag_admin].option4,
                            ans : info.Quiz[index_admin].Questions[flag_admin].ans, 
                            selected_option : body.selected_option


                        })
                        
                        user.Quiz[index].Questions = sss;
                    }else{
                

                        user.Quiz[index].Questions[flag].que =info.Quiz[index_admin].Questions[flag_admin].que ,  
                        user.Quiz[index].Questions[flag].option1 = info.Quiz[index_admin].Questions[flag_admin].option1,
                        user.Quiz[index].Questions[flag].option2 = info.Quiz[index_admin].Questions[flag_admin].option2,
                        user.Quiz[index].Questions[flag].option3 = info.Quiz[index_admin].Questions[flag_admin].option3,
                        user.Quiz[index].Questions[flag].option4 = info.Quiz[index_admin].Questions[flag_admin].option4,
                        user.Quiz[index].Questions[flag].ans = info.Quiz[index_admin].Questions[flag_admin].ans, 
                        user.Quiz[index].Questions[flag].selected_option = body.selected_option

                    }

                
                }else{                
                                var flag = user.Quiz[index].Questions.findIndex(x => x.que == body.que);
                                console.log(flag);

                                if(flag == -1){

                                        
                                    const sss = user.Quiz[index].Questions ; 

                                    sss.unshift({

                                        que : info.Quiz[index_admin].Questions[flag_admin].que ,  
                                        option1 : info.Quiz[index_admin].Questions[flag_admin].option1,
                                        option2 : info.Quiz[index_admin].Questions[flag_admin].option2,
                                        option3 : info.Quiz[index_admin].Questions[flag_admin].option3,
                                        option4 : info.Quiz[index_admin].Questions[flag_admin].option4,
                                        ans : info.Quiz[index_admin].Questions[flag_admin].ans, 
                                        selected_option : body.selected_option


                                    })
                                    
                                    user.Quiz[index].Questions = sss;
                                }else{
                            

                                    user.Quiz[index].Questions[flag].que =info.Quiz[index_admin].Questions[flag_admin].que ,  
                                    user.Quiz[index].Questions[flag].option1 = info.Quiz[index_admin].Questions[flag_admin].option1,
                                    user.Quiz[index].Questions[flag].option2 = info.Quiz[index_admin].Questions[flag_admin].option2,
                                    user.Quiz[index].Questions[flag].option3 = info.Quiz[index_admin].Questions[flag_admin].option3,
                                    user.Quiz[index].Questions[flag].option4 = info.Quiz[index_admin].Questions[flag_admin].option4,
                                    user.Quiz[index].Questions[flag].ans = info.Quiz[index_admin].Questions[flag_admin].ans, 
                                    user.Quiz[index].Questions[flag].selected_option = body.selected_option

                                }
                            }
                        }
                    

                
    
          
        user.save()        
        .then((data)=>{
            console.log("Doned");
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err);
        });
    

    }
    })
    

})
}



const scoreQuiz= (req,res)=>{
   
    Person.findOne({ _id : req.params.id } , ( err , user ) =>{

        if(err){
            console.log(err)
        }

        var index = user.Quiz.findIndex(x => x.Title_quiz === req.params.title);
        console.log(index);
        
        
        if(index == -1){
            console.log("I think you have not given any quiz ");
         }

        else{
            if(user.Quiz[index].Title_quiz == req.params.title){
            console.log(req.params.title);

                const end = user.Quiz[index].Questions.length;

                console.log(end);

                let score_count = 0;

                for(let i=0 ; i<end ; i++){

                    if(user.Quiz[index].Questions[i].ans == user.Quiz[index].Questions[i].selected_option){
                        
                        score_count++;
                    }

                }
                console.log(score_count);

            
                user.Quiz[index].Score_Quiz = score_count;
               
                
                


        }

    }
        
        
        user.save()        
        .then((data)=>{
            console.log("Doned");
           
           



  
            Person.findOne({ _id : req.params.id , "Quiz.Title_quiz" : req.params.title } ,
            (err, data)=>{
            if(!err){

                var ind = data.Quiz.findIndex(x => x.Title_quiz === req.params.title);
                console.log(ind);

                Person.findOne({ _id : req.params.id } , ( err , user_info ) =>{
                if(err){
                    console.log(err)
                }
                        
                    const temp = user_info.Scr_Quiz ; 
                
                    temp.unshift({

                    Status_quiz : "Done",
                    Title_quiz : data.Quiz[index].Title_quiz , 
                    Desc_quiz : data.Quiz[index].Desc_quiz ,
                    Score_Quiz : data.Quiz[index].Score_Quiz
                            
                    })
                    user_info.Scr_Quiz = temp;
                


                user_info.save()                            
                .then((info)=>{
                    console.log("Doned");

                           

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






            res.status(200).send(data.Quiz[index]);

        })
        .catch((err)=>{
            console.log(err);
        });
    })
};




const updateUser = async (req,res) =>{
    try {

        const { id } = req.params;
        const {name , email , pass , sirname , mobile_no , address} = req.body;

        const user = await Person.findById(id);

        if(!user){
            res.status(404).json({
                code:404,
                status:"failure",
                message:"user not found"
            })  
        }

        const updateduser = {
            _id: id,
            name , email , pass , sirname , mobile_no , address
        }

        await Person.updateOne({_id : id} , {$set: updateduser} , {new : true});

        res.status(200).json({
            code:200,
            status:"success",
            message:"user updated successfully",
            data : updateduser
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
  PostRegister,
  PostUserLogin,

  getAllData,
  getUserData,  
  getScoredQuizData,
  getUserQuizData,
  
  updateUser,
  
  subQuestion,  
  scoreQuiz,
};
