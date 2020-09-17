const express=require('express');
const router=express.Router();
const app=express();
const bodyParser=require('body-Parser');
const User=require('./model/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const flash=require('connect-flash');
app.use(flash());

//login page
router.get('/login',(req,res)=>{


  });
  router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { console.log("I'm here");return next(err); }
    if (!user) { console.log(info);return res.status(400).send(info.message); }
    req.logIn(user, function(err) {
      if (err) { return res.status(400).send("Password is incorrect!Try again"); }
      return res.redirect('/tweets');
    });
  })(req, res, next);
});
//Register for new Users
router.get('/register',(req,res)=>{

});

router.post('/register',(req,res)=>{
     User.findOne({username:username})
    .then(user=>{
      if(user){
        res.status(400).send("User exists");
      }
      else{
        const newUser= new User({
          username,
          email,
          password
        });

        //Hash Password
        bcrypt.genSalt(10,(err,salt)=>
          bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            //Set password to hashed
            newUser.password=hash;
            newUser.save()
            .then(user=>{
              res.sendStatus(200);
            })
            .catch(err=>console.log(err));
          })
        )
      }
    })
});


module.exports=router;
