
let express = require ("express");

const { userProfile, getProfile} = require ("../../controllers/tutor/aboutusController");

let aboutusRouter = express.Router();

const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');


//------------------ Create About US Profile ------------------//

aboutusRouter.post("/createprofileaboutus", auth, userProfile);

aboutusRouter.get('/getprofile', auth, getProfile);


//-----------------------------------------// 

module.exports = aboutusRouter;