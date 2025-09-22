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

const authRouter = require("./App/routes/authRoute");
app.use("/app", authRouter);

const selectionRouter = require("./App/routes/SelectionRoute.js");
app.use("/app", selectionRouter);


//Tutor Router Rotes
const aboutusRouter = require("./App/routes/teacherRoutes/aboutusRoute");
app.use("/app/tutor", aboutusRouter);

const pictureRouter = require("./App/routes/teacherRoutes/profilepictureRoute.js");
app.use("/app/tutor", pictureRouter);

const educationRouter = require("./App/routes/teacherRoutes/educationRoute.js");
app.use("/app/tutor", educationRouter);

const descriptionRouter = require("./App/routes/teacherRoutes/descriptionRoute.js");
app.use("/app/tutor", descriptionRouter);



//Student Router Rotes
const BasicInfoRoutes = require("./App/routes/studentRoutes/basicinfoRoutes")
app.use("/app/student",BasicInfoRoutes)

const StudentpictureRouter = require("./App/routes/studentRoutes/ProfilePicRoute")
app.use("/app/student",StudentpictureRouter);

const  AcademicInfoRoutes = require("./App/routes/studentRoutes/academicinfoRoutes.js")
app.use("/app/student", AcademicInfoRoutes )




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
