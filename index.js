let express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
let app = express();


const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_KEY_PATH); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});




// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const UserRouter = require("./App/Routes/app/UsersRoutes");

// ✅ Routes
app.use("/app", UserRouter);

// ✅ Connect to MongoDB and start the server
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 8020, () => {
      console.log(`Server is running on port ${process.env.PORT || 8020}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
