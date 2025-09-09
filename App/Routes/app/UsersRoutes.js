let express = require ("express");
const { usersInsert,userLogin, userProfile, uploadProfilePicture } = require ("../../Controllers/app/UsersController");
let UserRouter = express.Router();

const upload = require('../../Middlewares/multer');
const path = require('path');


const auth = require('../../Middlewares/auth');



UserRouter.post("/register", usersInsert);

UserRouter.post("/login", userLogin);

UserRouter.post("/CreateProfileAboutUs", auth, userProfile);

UserRouter.post("/ProfilePicture", upload.single('profilePicture'), uploadProfilePicture);


// // UsersRoutes.js me
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../../uploads")); // do baar upar jao
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });


// const upload = multer({ storage: storage });

// //Profile Picture Upload Route
// UserRouter.post("/uploadProfilePicture", auth, upload.single('profilePicture'), uploadProfilePicture);


module.exports = UserRouter;