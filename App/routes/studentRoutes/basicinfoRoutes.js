let express = require ("express");
const { BasicInfoController,GetBasicInfoController  } = require ("../../controllers/student/basicinfoController");


let BasicInfoRoutes = express.Router();


const auth = require('../../middlewares/auth');
//------------------ Basic Info ------------------//

BasicInfoRoutes.post("/basicinfo", auth, BasicInfoController);  

//------------------ Get Basic Info ------------------//

BasicInfoRoutes.get("/getbasicinfo", auth, GetBasicInfoController); 

module.exports = BasicInfoRoutes;