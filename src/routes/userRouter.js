const express = require("express");
const router = express.Router();

const UserCtrl = require("../controller/UserCtrl");
const AdminCtrl = require("../controller/AdminCtrl");





//Admin_Controller Operations

router.post("/admin_login", AdminCtrl.postAdminLogin);

router.get("/get_specific_admin/:id" , AdminCtrl.getAdminData);
router.get("/get_Quiz/:id" , AdminCtrl.getQuizData);

router.get("/get_all_Quiz"  , AdminCtrl.getAllQuizData);
router.get("/get_que/:id" , AdminCtrl.getQuestionData);
router.get("/get-specific-quiz/:id/:Quiz_id" , AdminCtrl.getSpecificQuiz);

router.put("/update_admin/:id" , AdminCtrl.updateAdmin);
router.put("/entry/:id" , AdminCtrl.quizEntry);
router.put("/question/:id" , AdminCtrl.QuestionEntry);
router.put("/update/:post_id/:Quiz_id" , AdminCtrl.changeStatus);

router.delete("/delete_adminquiz_permanent/:id/:Quiz_id", AdminCtrl.deleteAdminPermanent);


//User_Controller Operations 

router.post("/register", UserCtrl.PostRegister);
router.post("/user_login", UserCtrl.PostUserLogin);

router.get("/getdata" , UserCtrl.getAllData);
router.get("/get_specific_user/:id" , UserCtrl.getUserData);
router.get("/get_user_Quiz/:id" , UserCtrl.getUserQuizData);
router.get("/score_quiz/:id/:title" , UserCtrl.scoreQuiz);
router.get("/get_scored_quiz_data/:id" , UserCtrl.getScoredQuizData);

router.put("/update_user/:id" , UserCtrl.updateUser);
router.put("/sub_que/:user_id/:id/:Quiz_id" , UserCtrl.subQuestion);




module.exports = router;
