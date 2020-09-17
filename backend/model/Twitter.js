const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const User=require('./User.js');
const twitterSchema= new Schema({
  username:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  tweet:{
    type: String,
    required:true,
  },
  likes:{
    type:Number,
    default:0,
  },
  createdAt:{
    type:Date,
    default:Date.now,
  },
});

const Tweet= mongoose.model("Tweet",twitterSchema);


module.exports=Tweet;
