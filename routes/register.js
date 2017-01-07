var express = require('express');
var router = express.Router();

var userModel = require("../public/models/models").User;

router.get('/', function(req, res, next){
  res.render('register', { msg: "", username: "", password: "", password2: "" });
});

router.post('/', function(req, res){
  if(req.body.user === "" || req.body.pass === "" || req.body.pass2 === "" ){
    res.render("register", { msg: "A field was left blank. Please fill out all fields below.", username: req.body.user, password: req.body.pass, password2: req.body.pass2});
  }
  else if(req.body.pass !== req.body.pass2){
    res.render("register", { msg: "Password fields do not match. Please try again.", username: req.body.user, password: "", password2: "" });
  }
  else{
    var newUser = new userModel({
      user: req.body.user,
      pass: req.body.pass,
    });

    newUser.save(function(err){
      if(err){
        var error = "Could not register account credentials. Please try again.";

        if(err.code === 11000){
          error = "The specified username is already in use. Please try another.";
        }

        res.render("register", {msg: error, username: req.body.user, password: req.body.pass, password2: req.body.pass2 });
      }
      else{
        res.redirect("users");
      }
    });
  }
});

module.exports = router;
