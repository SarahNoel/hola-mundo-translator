var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var User = new Schema(
  {
    name: String,
    challengesTaken: Number,
    challengesPassed: Number,
    challengesFailed: Number,
    wordsTranslated: Number,
    wordsTranslatedCorrectly: Number,
    wordsTranslatedIncorrectly: Number,
    currentQuizWordsWrong: Number,
    currentQuizWordsCorrect:Number
  }
);

mongoose.model('users', User);
