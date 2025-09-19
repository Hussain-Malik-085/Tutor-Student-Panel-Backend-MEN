let express = require ("express");
const { usersInsert,userLogin,firebaseLogin} = require ("../controllers/authController");


let UserRouter = express.Router();


const auth = require('../middlewares/auth');

//------------------ Signup ------------------//

UserRouter.post("/register", usersInsert);


//------------------ Login ------------------//

UserRouter.post("/login", userLogin);


//------------------ Firebase Login ------------------//

UserRouter.post("/firebase-login", firebaseLogin);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

module.exports = UserRouter;