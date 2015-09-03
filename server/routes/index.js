var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('index', {title:"Translator"})
});

router.get('/challenges', function(req, res, next){
  res.render('challenges', {title: "Challenges!"})
})



module.exports = router;
