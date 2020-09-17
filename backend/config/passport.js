const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const  bcrypt=require('bcryptjs');
//Load User Model
const User =require('../model/User');

module.exports=function(passport){
  console.log('Inside passport config');
  passport.use(
    new LocalStrategy({
      usernameField:'username'},
        (username,password,done)=>{
        //Match User
        console.log(username);
        User.findOne({username:username})
        .then(user=>{
          console.log("The user is "+user);
            if(!user){
            
            return done(null,false,{message:'Username is not registered!Please register'});
          }
        //Match password
        bcrypt.compare(password,user.password,(err,isMatch)=>{
          if(err) throw err;
          if(isMatch){
              
              return done(null,user);
          }
            else {
              console.log('Password incorrect');
              return done(null,false,{message:'Username/Password incorrect'});

            }
        })
      })
      .catch(err=>console.log(err));
    })
  );
  //session
  passport.serializeUser((user, done) =>{
    
  done(null, user._id);
});

passport.deserializeUser((id, done)=> {
  
  User.findOne({_id:id}, (err, user) =>{
   
    done(err, user);
  });
});

}
