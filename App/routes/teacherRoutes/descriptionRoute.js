let express = require ("express");
const { DescriptionReceive,getDescriptionData } = require ("../../controllers/tutor/descriptionController");

let descriptionRouter = express.Router();



const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');


//------------------------------------------// Description Routes
descriptionRouter.post("/createdescription", auth , DescriptionReceive);

descriptionRouter.get("/getdescription", auth, getDescriptionData);


module.exports = descriptionRouter;