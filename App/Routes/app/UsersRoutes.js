let express = require ("express");
const { usersInsert,userLogin, userProfile, uploadProfilePicture } = require ("../../Controllers/app/UsersController");
let UserRouter = express.Router();


const upload = require('../../Middlewares/multer');
const auth = require('../../Middlewares/auth');



UserRouter.post("/register", usersInsert);

UserRouter.post("/login", userLogin);

UserRouter.post("/CreateProfileAboutUs", auth, userProfile);

UserRouter.post("/ProfilePicture", auth , upload.single('profilePicture'), uploadProfilePicture);





module.exports = UserRouter;