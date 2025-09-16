let express = require ("express");
const { usersInsert,userLogin, userProfile, uploadProfilePicture ,getProfile,getProfilePic,firebaseLogin} = require ("../../Controllers/app/UsersController");
const { EducationReceive,getEducationData } = require ("../../Controllers/app/EducationController");
let UserRouter = express.Router();


const upload = require('../../Middlewares/multer');
const auth = require('../../Middlewares/auth');

//------------------ Signup ------------------//

UserRouter.post("/register", usersInsert);


//------------------ Login ------------------//

UserRouter.post("/login", userLogin);


//------------------ Firebase Login ------------------//

UserRouter.post("/firebase-login", firebaseLogin);


//------------------ Create About US Profile ------------------//

UserRouter.post("/CreateProfileAboutUs", auth, userProfile);

UserRouter.get('/GetProfile', auth, getProfile);



//-----------------------------------------// Profile Picture Routes

UserRouter.post("/ProfilePicture", auth , upload.single('profilePicture'), uploadProfilePicture);

UserRouter.get("/GetProfilePic", auth, getProfilePic);


//------------------------------------------// Education Routes
UserRouter.post("/CreateEducation", auth ,upload.single('certificate'), EducationReceive);

UserRouter.get("/GetEducation", auth, getEducationData);



module.exports = UserRouter;