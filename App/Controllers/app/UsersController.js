
const Users = require('../../Models/Users');
const UserProfiles = require('../../Models/UserProfiles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//---------------------------------------------------------//

// User Registration Controller Basically Signup
let usersInsert = async (req , res) => {

let {Username, Email, Password}=req.body;
// Frontend se body me email (ya username) aur password aayega
        
// Database me user dhoondo
    const existingUser = await Users.findOne({
      $or: [
        { Email: Email },
        { Username: Email }
      ]
    });

    if (existingUser) {
      return res.status(404).json({ status: 0, message: "User already Exists" });
    }

  // Password hash karo
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    //console.log(sName,sEmail,sPhone,sMessege);
   let user = new Users ({
Username: Username,
Email: Email,
Password: hashedPassword
   })

//Here is working with JWT
   
    // let token = jwt.sign({ email: Email }, process.env.JWT_SECRET);
    // console.log(token);
    // res.cookie("token", token, {httpOnly: true});
    // console.log("Cookie Set"); 


user.save().then(() => {

console.log("data saved");
res.send({status: 1, Messege: "Data saved in Mongo" })

}).catch ((err) =>{

console.log(err);
res.send({status: 0, Messege: "Data not saved in Mongo",error:err});

})
}




//---------------------------------------------------------//

// Login controller
let userLogin = async (req, res) => {
  try {
    // Frontend se body me email (ya username) aur password aayega
    const { email, password } = req.body;

    // Database me user dhoondo
    const user = await Users.findOne({
      $or: [
        { Email: email },
        { Username: email }
      ]
    });

    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
      //throw new ApiError(404, "User does not exist");
    }

    // Ab hashed password compare karo
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: 0, message: "Password not match" });
    }
    // Password match ho gaya, JWT token generate karo
let token = jwt.sign({id: user._id, email: user.Email },  process.env.JWT_SECRET,{ expiresIn: '1h' });
    console.log(token);
    res.cookie("token", token, {httpOnly: true});
    console.log("Cookie Set");
    // Login successful, user details bhejo (password hata ke)

  res.status(200).json({
  status: 1,
  message: "Login successful",
  token: token,
  data: {
    _id: user._id,
    Username: user.Username,
    Email: user.Email
  }


  
});
  } catch (err) {
    res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

//---------------------------------------------------------//

// Create your profile api after login
let userProfile = async (req, res) => {
  try {
    let { Phone, Experience, Country, Location, Language, Subject } = req.body;
    // Frontend se body me USer ka data aarha ha profile create ka

 // yahan assume karo JWT se tumne user ka _id nikal liya hai
    let UserId = req.user.id;  // req.user me JWT middleware se user info aayega

    //console.log(sName,sEmail,sPhone,sMessege);
   let profile = await UserProfiles.findOneAndUpdate(
   { userId: UserId}, 
   {phoneNumber: Phone,
experience: Experience,
country: Country,
location: Location,
language: Language,
subject: Subject}, 
{ new: true, upsert: true } // agar profile nahi hai to naya create kar do
   )

console.log("data saved/Updated");
res.send({status: 1, Messege: "About us Data Saved Successfully", data: profile });
} catch (err) {

console.log(err);
res.send({status: 0, Messege: "About us Data not saved",error:err});

}};  


//---------------------------------------------------------// 

let uploadProfilePicture = async (req, res) => {
console.log(req.file);

}
//   try {
//     let UserId = req.user.id;
//     console.log("UserId from JWT:", UserId);
//     console.log("File received:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ status: 0, message: "No file uploaded" });
//     }

//     let imagePath = `/uploads/${req.file.filename}`; // ✅ sirf /uploads rakho
//     console.log("Generated imagePath:", imagePath);

//     let profile = await UserProfiles.findOneAndUpdate(
//       { userId: UserId },
//       { picture: imagePath },
//       { new: true, upsert: true }
//     );

//     console.log("Updated profile:", profile);

//     res.send({ status: 1, message: "Profile picture saved successfully", data: profile ,
//       imageUrl: `${req.protocol}://${req.get('host')}${imagePath}` // Full URL

//     });
//   } catch (err) {
//     console.error("Error while uploading profile pic:", err);
//     res.send({ status: 0, message: "Profile picture not saved", error: err });
//   }
// };




//---------------------------------------------------------//

module.exports = {
    usersInsert,
    userLogin   ,
    userProfile,
    uploadProfilePicture
    
}