var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('index', {title:'Home'})
});

router.get('/translate', function(req, res, next){
  res.render('translate', {title:"Translator"})
});

router.get('/challenges', function(req, res, next){
  res.render('challenges', {title: "Challenges!"})
})

router.get('/progress', function(req, res, next){
  res.render('progress', {title:"Progress"})
})


module.exports = router;
