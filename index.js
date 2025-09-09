let express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
let app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRouter = require("./App/Routes/app/UsersRoutes");
//Routes
app.use("/app", UserRouter);


// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Connect to MongoDB and start the server on port
mongoose.connect(process.env.DBURL).then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 8020, () => {
        console.log(`Server is running on port ${process.env.PORT || 8020}`);
    });
}).catch((err) => {
    console.error("DB connection error:", err);
});

