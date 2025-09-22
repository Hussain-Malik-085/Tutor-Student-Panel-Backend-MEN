let express = require ("express");

const { abc } = require ("../controllers/selectionController");

let SelectionRouter = express.Router();

const auth = require('../middlewares/auth');


//------------------ Selection Route ------------------//
SelectionRouter.put("/api/:id/role", auth, abc);

module.exports = SelectionRouter;
