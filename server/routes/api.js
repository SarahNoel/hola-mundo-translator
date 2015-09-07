var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

var express = require('express');
var router = express.Router();
var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
    client_id: '2035a599-6bf3-4b52-b1a7-f31d851f0647',
    client_secret: '123456789101112131415'
  });

//get all translations
router.get('/translate', function(req, res, next){

});

//submit translation
router.post('/translate', function(req, res, next) {
  var phrase = req.body.phrase;
  var inputLang = req.body.inputLang;
  var outputLang = req.body.outputLang;
  bt.translate(phrase, inputLang, outputLang, function(err, data){
    res.json(data);
  });
});


//get ALL users
router.get('/users', function(req, res) {
  User.find(function(err, users){
    console.log(users);
    res.json(users);
  });
});

// post ALL users
router.post('/users', function(req, res) {
  new User({
    name:req.body.name,
    challengesTaken:0,
    challengesPassed:0,
    challengesFailed:0,
    wordsTranslated:0,
    wordsTranslatedCorrectly:0,
    wordsTranslatedIncorrectly:0,
    currentQuizWordsWrong:0,
    currentQuizWordsCorrect: 0
  })
  .save(function(err, user) {
    res.json({user:user, message: 'User added!'});
  });
});

// get SINGLE user
router.get('/user/:id', function(req, res) {
  var query = {"_id": req.params.id};
  User.findOne(query, function(err, user){
    console.log(user);
    res.json(user);
  });
});

// update SINGLE user
router.put('/user/:id', function(req, res) {
  var query = {"_id": req.params.id};
  var update = req.body;
  console.log(update);
  var options = {new: true};
  User.findOneAndUpdate(query, update, options, function(err, user){
    console.log(user);
    res.json(user);
  });
});

// delete SINGLE user
router.delete('/user/:id', function(req, res) {
  var query = {"_id": req.params.id};
  User.findOneAndRemove(query, function(err, user){
    console.log(user);
    res.json(user);
  });
});


module.exports = router;
