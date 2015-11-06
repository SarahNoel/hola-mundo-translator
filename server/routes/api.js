var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Player = mongoose.model('players');

var bt = require('../../node_modules/bing-translate/lib/bing-translate.js').init({
    client_id: '2035a599-6bf3-4b52-b1a7-f31d851f0647',
    client_secret: '123456789101112131415'
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


//get ALL players
router.get('/players', function(req, res) {
  Player.find(function(err, players){
    console.log(players);
    res.json(players);
  });
});

// post- make new user
router.post('/players', function(req, res) {
  var newUser = new Player({
    name:req.body.name,
    challengesTaken: 0,
    challengesPassed: 0,
    challengesFailed: 0,
    wordsTranslated: 0,
    wordsTranslatedCorrectly: 0,
    wordsTranslatedIncorrectly: 0,
    currentQuizWordsWrong: 0,
    currentQuizWordsCorrect:0
  });
  newUser.save(function(err, user) {
  console.log('ppooopp');
   if(err){
    console.log('error! ' , err);
    res.json(err);
    }
    console.log('user ', user);
    res.json({user:user, message: 'User added!'});
  });
});

// get SINGLE user
router.get('/player/:id', function(req, res) {
  var query = {"_id": req.params.id};
  Player.findOne(query, function(err, user){
    console.log(user);
    res.json(user);
  });
});

// update SINGLE user
router.put('/player/:id', function(req, res) {
  var query = {"_id": req.params.id};
  var update = req.body;
  console.log(update);
  var options = {new: true};
  Player.findOneAndUpdate(query, update, options, function(err, user){
    console.log(user);
    res.json(user);
  });
});

// delete SINGLE user
router.delete('/user/:id', function(req, res) {
  var query = {"_id": req.params.id};
  Player.findOneAndRemove(query, function(err, user){
    console.log(user);
    res.json(user);
  });
});


module.exports = router;
