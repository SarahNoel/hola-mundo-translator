var currentUser;
var currentUserNum;
var inputLang;
var outputLang;
var quizName;

$(document).on('ready', function() {
  makeNewUser();
});//end on-ready


///////////////////   NAVIGATION  ///////////////////

$('#home-nav').on('click', function(event){
  event.preventDefault();
  $('#challenges-page').hide();
  $('#progress-page').hide();
  $('#practice-page').hide();
  $('#quiz-results-page').hide();
  $('#home-page').fadeIn();
});

$('#practice-nav').on('click', function(event){
  event.preventDefault();
  $('#home-page').hide();
  $('#challenges-page').hide();
  $('#progress-page').hide();
  $('#quiz-results-page').hide();
  $('#practice-page').fadeIn();
});

$('#challenge-nav').on('click', function(event){
  event.preventDefault();
  $('#home-page').hide();
  $('#progress-page').hide();
  $('#practice-page').hide();
  $('#quiz-results-page').hide();
  $('.invis').hide();
  $('.hide-submit').hide();
  $('#challenges-page').fadeIn();
});

$('#progress-nav').on('click', function(event){
  event.preventDefault();
  $('#home-page').hide();
  $('#quiz-results-page').hide();
  $('#challenges-page').hide();
  $('#practice-page').hide();
  $('#progress-page').fadeIn();
});


///////////////////   DROPDOWNS  ///////////////////

//dropdown for TranslateFrom languages
$(".option1 a").click(function(){
  $(".btn1:first-child").text($(this).text());
  inputLang = $(this).html();
   });

//dropdown for TranslateTo languages
$(".option2 li a").click(function(){
   $(".btn2:first-child").text($(this).text());
   outputLang = $(this).html();
   });

//dropdown for Quiz Themes
$(".option3 li a").click(function(){
  $(".btn3:first-child").text($(this).text());
  quizName = $(this).html();
   });


///////////////////   PRACTICE  ///////////////////

//practice translation
$('#translateBtn').on('click', function(event){
  event.preventDefault();
  //find language codes
  $('#result').html('');
  for (var i = 0; i < langCodes.length; i++) {
    if(inputLang === langCodes[i].name){
      inputLang = langCodes[i].id;
    }
  }
  for (var j = 0; j < langCodes.length; j++) {
    if(outputLang === langCodes[j].name){
      outputLang = langCodes[j].id;
    }
  }

  var phrase = $('#to-translate').val().toLowerCase().trim();
  payload = {
    phrase:phrase,
    inputLang:inputLang,
    outputLang:outputLang
    };

   //show tranlated word
  $.post('/api/translate', payload, function(data) {
    $('#result').append(data.translated_text.toLowerCase());
  });
}); //end translate for practice


///////////////////   CHALLENGES  ///////////////////

var index = 0;
var useArray;
var originalWord;
var progBarWidth = 0;
var questionNum = 1;

$(document).on("click", '#challenge-start', function(event){
  event.preventDefault();

  //reset progress bar, update questions,
  progBarWidth = 0;
  $('.invis').hide();
  $('#check-answer').html('');
  $('#question-number').html("Question 1/20");
  $('#prog-bar').css({width:progBarWidth+'%'});

  //get user
  currentUser = getSingleUser(currentUserNum);
  currentUser.challengesTaken += 1;
  currentUser.currentQuizWordsWrong = 0;
  currentUser.currentQuizWordsCorrect = 0;
  updateSingleUser(currentUser, currentUserNum);

  //choose array to quiz from
  for (var i = 0; i < allQuizzes.length; i++) {
    if(quizName === allQuizzes[i].title){
      useArray = allQuizzes[i].content;
    }
  }

  //get lang codes
  for (var k = 0; k < langCodes.length; k++) {
    if(inputLang === langCodes[k].name){
      inputLang = langCodes[k].id;
    }
  }
  for (var l = 0; l < langCodes.length; l++) {
    if(outputLang === langCodes[l].name){
      outputLang = langCodes[l].id;
    }
  }

  //translating English array word to user selected START language
  var phrase = useArray[index].toLowerCase().trim();
  payload = {
    phrase:phrase,
    inputLang:'en',
    outputLang:inputLang
    };

  //append word for user to translate
  $.post('/api/translate', payload, function(data) {
    $('#challenge-to-translate').html(data.translated_text);
    originalWord = data.translated_text;
    //submit button appears
    $('.invis').fadeIn();
    $('.hide-submit').fadeIn();
  });
}); //end start challenge button

//user submits answer
$('#user-submit').on('click', function(event){
  event.preventDefault();
  currentUser = getSingleUser(currentUserNum);

  var answer;
  progBarWidth += 5;
  //update progress bar and stats
  $('#prog-bar').css({width:progBarWidth+'%'});

  //find answer by translating English array word to user selected END language
  var phrase = useArray[index];
  var userSubmit = $('#challenge-user-word').val().trim().toLowerCase();

  payload = {
    phrase:phrase,
    inputLang:'en',
    outputLang:outputLang
    };

  $.post('/api/translate', payload, function(data) {
    answer = data.translated_text.trim().toLowerCase();
    $('.appear-later').show();
    if(userSubmit === answer){
      //increment correct answers by 1
      currentUser.wordsTranslatedCorrectly += 1;
      currentUser.wordsTranslated += 1;
      currentUser.currentQuizWordsCorrect += 1;

      updateSingleUser(currentUser, currentUserNum);

      //show right answer and stats
      $('#check-answer').append('<h2 class = "green">Correct!<br>'+ originalWord + ' is ' + answer +'</h2>');
    }
    else {
      var mistakes = 0;
      var answerArray = answer.split("");
      for(var i = 0; i < answerArray.length; i++) { // go from first to last character index the words
        if(userSubmit.charAt(i) != answer.charAt(i)) { // if this character from word 1 does not equal the character from word 2
          mistakes += 1;
        }
      }
      if(mistakes <= 1) {
        currentUser.wordsTranslatedCorrectly += 1;
        currentUser.wordsTranslated += 1;
        currentUser.currentQuizWordsCorrect += 1;

        //updating user info
        updateSingleUser(currentUser, currentUserNum);
        //show right answer and stats
        $('#check-answer').append('<h2 class = "green">Off by one, but we\'ll count it.<br>'+ originalWord + ' is ' + answer +'</h2>');
        $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
      }
      else if(mistakes >=2){
        //increment wrong answers by 1
        currentUser.wordsTranslatedIncorrectly += 1;
        currentUser.currentQuizWordsWrong += 1;
        currentUser.wordsTranslated += 1;
        //updating user info- PUT request
        updateSingleUser(currentUser, currentUserNum);

        //show answer and stats
        $('#check-answer').append('<h2 class = "red">Incorrect<br>'+ originalWord + ' is ' + answer+'</h2>');

        //if wrong > five, start over, failed quizzes up by 1
        if(currentUser.currentQuizWordsWrong >= 5){
          currentUser.challengesFailed += 1;
          //updating user info-PUT request
          updateSingleUser(currentUser, currentUserNum);

          $('.appear-later').hide();
          $('#check-answer').append('<h2>Looks like this quiz is a little tough.  You\'ve missed five questions,<br>so study up and try again later!</h2>');
          }
        }
      }
      $('#challenge-user-word').val('');
      $('.hide-submit').hide();
    });
  }); //end challenge-submit

//next question button
$('#next-question').on('click', function(event){
  event.preventDefault();
  //get user
  currentUser = getSingleUser(currentUserNum);
  //update stats and DOM
  index += 1;
  questionNum += 1;
  $('#question-number').html("Question " + questionNum + "/20");
  $('#challenge-to-translate').html('');
  $('#answers').html('');
  $('#challenge-user-word').val('');
  $('#check-answer').html('');

  if(index < 20){
    //translating English array word to user selected START language
    var phrase = useArray[index];
    payload = {
      phrase:phrase,
      inputLang:'en',
      outputLang:inputLang
      };
     //append word for user to translate
    $.post('/api/translate', payload, function(data) {
      $('#challenge-to-translate').html(data.translated_text);
      originalWord = data.translated_text;
    });
     //hide next button
    $('.appear-later').hide();
    $('.hide-submit').show();
  //if no more questions
  }else{
    currentUser.challengesPassed += 1;
    //updating user info
    updateSingleUser(currentUser, currentUserNum);
    //show quiz results
    $('#challenges-page').hide();
    $('#quiz-results-page').fadeIn();

  }
}); //end next question


///////////////////   PROGRESS  ///////////////////

$(document).on('click', '#progress-nav', function(event){
  event.preventDefault();
  currentUser = getSingleUser(currentUserNum);
}); //end progress click


///////////////////   HELPER FUNCTIONS  ///////////////////

//POST-make new user
function makeNewUser(){
  var payload = {name:"Guest"};
  $.post('/api/users', payload, function(data){
    currentUser = data.user;
  $('#words-translated').html(currentUser.wordsTranslated);
  $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
  $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly);
  $('#challenges-taken').html(currentUser.challengesTaken);
  $('#challenges-passsed').html(currentUser.challengesPassed);
  $('#challenges-failed').html(currentUser.challengesFailed);
  currentUserNum = currentUser._id;
  });
}

//PUT- update single user info
function updateSingleUser(currentUser, currentUserNum){
  payload ={
    wordsTranslated: currentUser.wordsTranslated,
    wordsTranslatedCorrectly:currentUser.wordsTranslatedCorrectly,
    wordsTranslatedIncorrectly: currentUser.wordsTranslatedIncorrectly,
    challengesTaken :currentUser.challengesTaken,
    challengesPassed: currentUser.challengesPassed,
    challengesFailed: currentUser.challengesFailed,
    currentQuizWordsWrong: currentUser.currentQuizWordsWrong,
    currentQuizWordsCorrect: currentUser.currentQuizWordsCorrect

  };
  $.ajax({
    method: "PUT",
    url: '/api/user/'+ currentUserNum,
    data: payload
  }).done(function(data) {
    currentUser = data;
    $('#words-translated').html(currentUser.wordsTranslated);
    $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
    $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly);
    $('#challenges-taken').html(currentUser.challengesTaken);
    $('#challenges-passsed').html(currentUser.challengesPassed);
    $('#challenges-failed').html(currentUser.challengesFailed);
    $('#quiz-words-correct').html(currentUser.currentQuizWordsCorrect);
    $('#quiz-words-incorrect').html(currentUser.currentQuizWordsWrong);
  });
}

//GET single user
function getSingleUser(currentUserNum){
  $.get("/api/user/" + currentUserNum, function(data){
    currentUser = data;
    $('#words-translated').html(currentUser.wordsTranslated);
    $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
    $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly);
    $('#challenges-taken').html(currentUser.challengesTaken);
    $('#challenges-passsed').html(currentUser.challengesPassed);
    $('#challenges-failed').html(currentUser.challengesFailed);
  });
  return currentUser;
}

///////////////////   QUIZZES  ///////////////////

var animalQuiz = {
  title:'Animal',
  content:['cat', 'dog', 'horse', 'tiger', 'lion', 'elephant', 'snake', 'fish', 'bird', 'bear', 'giraffe', 'zebra', 'pig', 'cow', 'duck', 'chicken', 'wolf', 'dolphin', 'lizard', 'sheep']
  };

var bodyQuiz = {
  title:'Body',
  content:['arm', 'eye', 'belly', 'leg', 'elbow', 'finger', 'foot', 'hand', 'mouth', 'nose', 'head', 'ear', 'tongue', 'toe', 'back', 'shoulder', 'tongue', 'knee', 'hip', 'waist']
  };

var commonWordsQuiz = {
  title:'Common Words',
  content:['hello', 'goodbye', 'please', 'thank you', 'sorry', 'excuse me', 'money', 'help', 'name', 'bathroom', 'left', 'right', 'doctor', 'police', 'how much', 'speak', 'water', 'where', 'yes', 'no']
  };

var travelQuiz = {
  title:'Travel',
  content:['where is this', 'how far', 'what time is it', 'airplane', 'taxi', 'bus', 'airport', 'train', 'museum', 'hotel', 'restaurant', 'food', 'lost', 'understand', 'do you have', 'street', 'bank', 'need', 'table', 'menu']
  };

var numbersQuiz = {
  title:'Numbers',
  content:['fourteen', 'eleven', 'nineteen', 'one', 'three', 'five', 'two', 'eight', 'fifteen', 'seven', 'seventeen', 'ten', 'thirteen', 'four',   'sixteen', 'eighteen', 'nine', 'twenty', 'six', 'twelve']
  };

var allQuizzes = [animalQuiz, bodyQuiz, commonWordsQuiz, travelQuiz, numbersQuiz];

var langCodes = [
{id:"ar", name: "Arabic"},
{id:"bs-Latn", name: "Bosnian (Latin)"},
{id:"bg", name: "Bulgarian"},
{id:"ca", name: "Catalan"},
{id:"zh-CHS", name: "Chinese (Simplified)"},
{id:"zh-CHT", name: "Chinese (Traditional)"},
{id:"hr", name: "Croatian"},
{id:"cs", name: "Czech"},
{id:"da", name: "Danish"},
{id:"nl", name: "Dutch"},
{id:"en", name: "English"},
{id:"et", name: "Estonian"},
{id:"fi", name: "Finnish"},
{id:"fr", name: "French"},
{id:"de", name: "German"},
{id:"el", name: "Greek"},
{id:"ht", name: "Hatian Creole"},
{id:"he", name: "Hebrew"},
{id:"hi", name: "Hindi"},
{id:"mww", name: "Hmong Daw"},
{id:"hu", name: "Hungarian"},
{id:"id", name: "Indonesian"},
{id:"it", name: "Italian"},
{id:"ja", name: "Japanese"},
{id:"tlh", name: "Klingon"},
{id:"ko", name: "Korean"},
{id:"lv", name: "Latvian"},
{id:"lt", name: "Lithuanian"},
{id:"ms", name: "Malay"},
{id:"mt", name: "Maltese"},
{id:"no", name: "Norwegian"},
{id:"fa", name: "Persian"},
{id:"pl", name: "Polish"},
{id:"pt", name: "Portuguese"},
{id:"otq", name: "Querétaro Otomi"},
{id:"ro", name: "Romanian"},
{id:"ru", name: "Russian"},
{id:"sr-Cyrl", name: "Serbian (Cyrillic)"},
{id:"sr-Latn", name: "Serbain (Latin)"},
{id:"sk", name: "Slovak"},
{id:"sl", name: "Slovenian"},
{id:"es", name: "Spanish"},
{id:"sv", name: "Swedish"},
{id:"th", name: "Thai"},
{id:"tr", name: "Turkish"},
{id:"uk", name: "Ukrainian"},
{id:"ur", name: "Urdu"},
{id:"vi", name: "Vietnamese"},
{id:"cy", name: "Welsh"},
{id:"yua", name: "Yucatec Maya"}
];
