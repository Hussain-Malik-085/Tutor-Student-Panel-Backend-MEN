


let express = require ("express");

const { uploadProfilePicture ,getProfilePic} = require ("../../controllers/tutor/profilepictureController");

let pictureRouter  = express.Router();


const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');


//-----------------------------------------// Profile Picture Routes

pictureRouter.post("/profilepicture", auth , upload.single('profilePicture'), uploadProfilePicture);

pictureRouter.get("/getprofilepic", auth, getProfilePic);


module.exports = pictureRouter;


