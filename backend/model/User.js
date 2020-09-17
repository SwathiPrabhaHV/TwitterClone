const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const Tweet=require('./Twitter.js');

const userSchema= new Schema({
  username:{
    type: String,
    unique:true,
    required:true
  },
  email:String,
  password:{
    type:String,
    required:true,
  },
  tweets:[{
    type:Schema.Types.ObjectId,
    ref:'Tweet'
  }]
});

const User= mongoose.model("User",userSchema);

module.exports=User;
