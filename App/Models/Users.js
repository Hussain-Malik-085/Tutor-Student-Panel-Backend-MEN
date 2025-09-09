let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let UserSchema=new Schema({

    Username:{
        type:String,
        required:true,
        unique:true
    },

    Email:{
        type:String,
        required:true,
        unique:true
    },

    Password:{
        type:String,
        required:true,
      
    }
});



let UserModel=mongoose.model('Users',UserSchema);
module.exports=UserModel;