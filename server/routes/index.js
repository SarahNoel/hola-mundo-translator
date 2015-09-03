var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('index', {title:"Translator"});
});

router.get('/challenges', function(req, res, next){
  res.render('challenges', {title: "Challenges!"});
});

router.get('/home', function(req, res, next){
  res.render('home');
});

router.get('/test', function(req, res, next){
  res.render('test');
});

module.exports = router;
