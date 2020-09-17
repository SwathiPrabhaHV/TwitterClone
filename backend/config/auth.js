module.exports = {
  ensureAuthenticated: function(req, res, next) {
    console.log("Inside authenticate");
    if (req.isAuthenticated()) {
      console.log("authenticated");
      return next();
    }
    else{
      console.log("Not autheticated");
      return res.send('Please login to view the tweets!').status(400);
    }

  }
};
