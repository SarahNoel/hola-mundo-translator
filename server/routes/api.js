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

})


//submit translation
router.post('/translate', function(req, res, next) {
  var phrase = req.body.phrase;
  var inputLang = req.body.inputLang;
  var outputLang = req.body.outputLang;
  bt.translate(phrase, inputLang, outputLang, function(err, data){
    res.json(data);
});





//get one translation





//update one translation






//delete one translation






});


module.exports = router;
