let express = require ("express");
const { usersInsert,userLogin,firebaseLogin} = require ("../controllers/authController");


let authRouter = express.Router();




//------------------ Signup ------------------//

authRouter.post("/register", usersInsert);


//------------------ Login ------------------//

authRouter.post("/login", userLogin);


//------------------ Firebase Login ------------------//

authRouter.post("/firebase-login", firebaseLogin);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

module.exports = authRouter;