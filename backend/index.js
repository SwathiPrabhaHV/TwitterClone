const express = require('express');
const cors = require('cors');
const flash=require('connect-flash');
const session=require('express-session');
const mongoose = require('mongoose');
const app = express();
const http=require('http').createServer(app);
const socket=require('socket.io')(http);
const bodyParser=require('body-Parser');
const jwt=require('jsonwebtoken');
const passport=require('passport');
var cookieParser = require('cookie-parser')
const { ensureAuthenticated }=require('./config/auth');


//Import Twitter and User Model
const Tweet =require('./model/Twitter');
const User =require('./model/User');
const { update } = require('./model/User');

const server=app.listen(5000, () => {
    console.log('Server started on port 5000');
});

//Socket 
const io=socket.listen(server);
io.on('connection',(socket)=>{
  console.log(socket.id);
    socket.on('send_tweet',(newTweet)=>{
      console.log("New tweet os socket is"+newTweet.username+" "+newTweet.tweet);
    });
    socket.on('send_likes',(updatedTweet)=>{
        console.log("New tweet os socket is"+updatedTweet.username+" "+updatedTweet.tweet);
    });
  
  });
    

//passport config

require('./config/passport')(passport);

//Database connection
const url = `mongodb+srv://test:test@cluster0.zporq.azure.mongodb.net/twitterClone?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false});
const connection=mongoose.connection;
connection.once('open',()=>{
  console.log("MongoDB database connected");
})


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());



//Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  
}));
app.use(bodyParser.urlencoded({extended:false }));
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());
app.use((req,res,next)=>{
  res.locals.error=req.flash('error');
  next();
})
//BodyParser

app.use('/',require('./routes'));




//Get all the tweets
app.get('/tweets',ensureAuthenticated,(req,res,next)=>{
  var user=[];
  user=req.user.username;
    Tweet.find()
    .populate("username","username")
    .sort({createdAt:-1})
    .exec(function(err,tweets){
      if(err) throw err;
      tweets.push(user);
      res.status(200).json(tweets);
    })
  });

//Post tweets
  app.post('/tweets', ensureAuthenticated,(req,res)=>{
    var newTweet={};
    const tweet=req.body.tweet;
    const userId=req.user._id;
    newTweet={
      tweet:tweet,
      username:userId,
     
    }
    

 Tweet.create(newTweet,function(err,newTweet){
        if(err) throw err;
        console.log("Data inside create"+newTweet);
      console.log("Data received from create tweet"+newTweet._id);
    Tweet.findOne({_id:newTweet._id})
        .populate("username","username")
        .exec(function(err,tweets){

          if(err) throw err;
          io.emit('send_tweet',tweets);
          console.log("Tweets inside post "+tweets);
          res.json(tweets);
        });
      });
  });

  app.post('/likes',ensureAuthenticated,(req,res)=>{
    const id=req.body._id;
   var numberOfLikes=req.body.likes;
    numberOfLikes++;
    
    Tweet.findOneAndUpdate({_id:id},{likes:numberOfLikes},{new:true},(err,updatedTweet)=>{
        if(err) throw err;
        Tweet.findOne({_id:updatedTweet._id})
        .populate("username","username")
        .exec(function(err,tweets){

          if(err) throw err;
        io.emit('send_likes',tweets);
        
        res.json(tweets);
      });
    });
  });
