var express = require('express');
var router = express.Router();

var userModel = require("../public/models/models").User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { msg: "", username: "", password: "" });
});

router.post('/', function(req,res){
  if(req.body.user ==="" || req.body.pass ===""){
    res.render('users', { msg: "A field was left blank. Please fill out all fields below.", username: req.body.user, password: req.body.pass});
  }
  else{
    userModel.findOne({ user: req.body.user }, function(err, user){
      if(!user){
        res.render('users', {msg: "Incorrect email/password", username: "", password: "", password2: ""});
      }
      else{
        if(req.body.pass === user.pass){
          req.session.user = user.user;
          res.redirect('calendar');
        }
        else{
          res.render('users', {msg: "Incorrect password.", username: req.body.user, password: "", password2: ""});
        }
      }
    });
  }
});

module.exports = router;
