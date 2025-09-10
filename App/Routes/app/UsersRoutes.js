let express = require ("express");
const { usersInsert,userLogin, userProfile, uploadProfilePicture ,getProfile} = require ("../../Controllers/app/UsersController");
const { EducationReceive } = require ("../../Controllers/app/EducationController");
let UserRouter = express.Router();


const upload = require('../../Middlewares/multer');
const auth = require('../../Middlewares/auth');



UserRouter.post("/register", usersInsert);

UserRouter.post("/login", userLogin);

UserRouter.post("/CreateProfileAboutUs", auth, userProfile);

UserRouter.post("/ProfilePicture", auth , upload.single('profilePicture'), uploadProfilePicture);

UserRouter.post("/CreateEducation", auth , EducationReceive);


// GET profile (JWT auth required)
UserRouter.get('/GetProfile', auth, getProfile);


module.exports = UserRouter;