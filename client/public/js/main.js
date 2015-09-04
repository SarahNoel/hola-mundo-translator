$(document).on('ready', function() {
  $('#words-translated').html(currentUser.wordsTranslated);
  $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
  $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly);
  $('#challenges-taken').html(currentUser.challengesTaken);
  $('#challenges-passsed').html(currentUser.challengesPassed);
  $('#challenges-failed').html(currentUser.challengesFailed);


///////////////////   DROPDOWNS  ///////////////////
var inputLang;
var outputLang;
var quizName;
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
        inputLang = langCodes[i].id
      }
    };
    for (var i = 0; i < langCodes.length; i++) {
      if(outputLang === langCodes[i].name){
        outputLang = langCodes[i].id
      }
    };

    var phrase = $('#to-translate').val().toLowerCase().trim();
    var payload = {
      phrase:phrase,
      inputLang:inputLang,
      outputLang:outputLang
      }

      //show tranlated word
    $.post('/api/translate', payload, function(data) {
      console.log(data)
      $('#result').append(data.translated_text.toLowerCase())
      });
  }); //end translate for practice


///////////////////   CHALLENGES  ///////////////////

  var index = 0;
  var useArray;
  var originalWord;
  var progBarWidth = 0;
  var questionNum = 1;

  $('#challenge-start').on("click", function(event){
    event.preventDefault();
    currentUser.currentQuizWordsWrong = 0;
    //choose array to quiz from
    for (var i = 0; i < allQuizzes.length; i++) {
      if(quizName === allQuizzes[i].title){
        useArray = allQuizzes[i].content;
      }
    };

    //get lang codes
    for (var i = 0; i < langCodes.length; i++) {
      if(inputLang === langCodes[i].name){
        inputLang = langCodes[i].id
      }
    };
    for (var i = 0; i < langCodes.length; i++) {
      if(outputLang === langCodes[i].name){
        outputLang = langCodes[i].id
      }
    };

    //translating English array word to user selected START language
    var phrase = useArray[index].toLowerCase().trim();
    var arrayLang = 'en';
    var userStartLang = inputLang;

    var payload = {
      phrase:phrase,
      inputLang:arrayLang,
      outputLang:userStartLang
      }

    //append word for user to translate
    $.post('/api/translate', payload, function(data) {
      $('#challenge-to-translate').html(data.translated_text);
      originalWord = data.translated_text;
      //submit button appears
      $('.invis').fadeIn();
    })
   }); //end start challenge button

  //user submits answer
  $('#user-submit').on('click', function(event){
    event.preventDefault();
    var userSubmit;
    var answer;
    currentUser.wordsTranslated += 1;
    progBarWidth += 5;
    //update progress bar and stats
    $('#prog-bar').css({width:progBarWidth+'%'})
    $('#words-translated').html(currentUser.wordsTranslated)

    //find answer by translating English array word to user selected END language
    var phrase = useArray[index];
    var inputLang = 'en';

    userSubmit = $('#challenge-user-word').val().trim().toLowerCase();

    var payload = {
      phrase:phrase,
      inputLang:inputLang,
      outputLang:outputLang
      }

    $.post('/api/translate', payload, function(data) {
      answer = data.translated_text.trim().toLowerCase();
      $('.appear-later').show();
      if(userSubmit === answer){
        //increment correct answers by 1
        currentUser.wordsTranslatedCorrectly += 1;
        //show right answer and stats
        $('#check-answer').append('<h2 class = "green">Correct!<br>'+ originalWord + ' is ' + answer +'</h2>');
        $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
      }
      else {
        var mistakes = 0;
        var answerArray = answer.split("");
        for(var i = 0; i < answerArray.length; i++) { // go from first to last character index the words
          if(userSubmit.charAt(i) != answer.charAt(i)) { // if this character from word 1 does not equal the character from word 2
            mistakes += 1;
          }
        }
        if(mistakes <= 1) { // and if you have more mistakes than allowed
        currentUser.wordsTranslatedCorrectly += 1;
        //show right answer and stats
        $('#check-answer').append('<h2 class = "green">Off by one, but we\'ll count it.<br>'+ originalWord + ' is ' + answer +'</h2>');
        $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
        }
        else if(mistakes >=2){
          //increment wrong answers by 1
          currentUser.wordsTranslatedIncorrectly += 1;
          currentUser.currentQuizWordsWrong += 1;
          //show answer and stats
          $('#check-answer').append('<h2 class = "red">Incorrect<br>'+ originalWord + ' is ' + answer+'</h2>')
          $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly)
          //if wrong > five, start over, failed quizzes up by 1
          if(currentUser.currentQuizWordsWrong >= 5){
            $('.appear-later').hide();
            $('#check-answer').html('<h2>Looks like this quiz is a little tough.  You\'ve missed five questions,<br>so study up and try again later!</h2><br><button id="restart-quizzes"><a class="blank" href="/challenges">Return to Challenges</a></button>')

          }
        }
      }
      $('#challenge-user-word').val('');
      $('.hide-submit').hide();
    })
  }); //end challenge-submit

   //next question button
  $('#next-question').on('click', function(event){
    event.preventDefault();
    index += 1;
    questionNum += 1;
    $('#question-number').html("Question " + questionNum + "/20");
    $('#challenge-to-translate').html('');
    $('#answers').html('');
    $('#challenge-user-word').val('');
    $('#check-answer').html('');

    if(index < 21){
      //translating English array word to user selected START language
      var phrase = useArray[index];

      var payload = {
        phrase:phrase,
        inputLang:'en',
        outputLang:inputLang
        }
       //append word for user to translate
      $.post('/api/translate', payload, function(data) {
          $('#challenge-to-translate').html(data.translated_text);
          originalWord = data.translated_text;
      })
       //hide next button
      $('.appear-later').hide();
      $('.hide-submit').show();
    //if no more questions
    }else{
       //go to quiz results page
       //
    }
 }) //end next question



///////////////////   PROGRESS  ///////////////////


});//end on-ready

//quizzes

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
{"id":"ar", "name": "Arabic"},
{"id":"bs-Latn", "name": "Bosnian (Latin)"},
{"id":"bg", "name": "Bulgarian"},
{"id":"ca", "name": "Catalan"},
{"id":"zh-CHS", "name": "Chinese (Simplified)"},
{"id":"zh-CHT", "name": "Chinese (Traditional)"},
{"id":"hr", "name": "Croatian"},
{"id":"cs", "name": "Czech"},
{"id":"da", "name": "Danish"},
{"id":"nl", "name": "Dutch"},
{"id":"en", "name": "English"},
{"id":"et", "name": "Estonian"},
{"id":"fi", "name": "Finnish"},
{"id":"fr", "name": "French"},
{"id":"de", "name": "German"},
{"id":"el", "name": "Greek"},
{"id":"ht", "name": "Hatian Creole"},
{"id":"he", "name": "Hebrew"},
{"id":"hi", "name": "Hindi"},
{"id":"mww", "name": "Hmong Daw"},
{"id":"hu", "name": "Hungarian"},
{"id":"id", "name": "Indonesian"},
{"id":"it", "name": "Italian"},
{"id":"ja", "name": "Japanese"},
{"id":"tlh", "name": "Klingon"},
{"id":"ko", "name": "Korean"},
{"id":"lv", "name": "Latvian"},
{"id":"lt", "name": "Lithuanian"},
{"id":"ms", "name": "Malay"},
{"id":"mt", "name": "Maltese"},
{"id":"no", "name": "Norwegian"},
{"id":"fa", "name": "Persian"},
{"id":"pl", "name": "Polish"},
{"id":"pt", "name": "Portuguese"},
{"id":"otq", "name": "Querétaro Otomi"},
{"id":"ro", "name": "Romanian"},
{"id":"ru", "name": "Russian"},
{"id":"sr-Cyrl", "name": "Serbian (Cyrillic)"},
{"id":"sr-Latn", "name": "Serbain (Latin)"},
{"id":"sk", "name": "Slovak"},
{"id":"sl", "name": "Slovenian"},
{"id":"es", "name": "Spanish"},
{"id":"sv", "name": "Swedish"},
{"id":"th", "name": "Thai"},
{"id":"tr", "name": "Turkish"},
{"id":"uk", "name": "Ukrainian"},
{"id":"ur", "name": "Urdu"},
{"id":"vi", "name": "Vietnamese"},
{"id":"cy", "name": "Welsh"},
{"id":"yua", "name": "Yucatec Maya"}
]



var User = function(name){
    this.name = name;
    this.challengesTaken = 0;
    this.challengesPassed = 0;
    this.challengesFailed = 0;
    this.wordsTranslated = 0;
    this.wordsTranslatedCorrectly = 0;
    this.wordsTranslatedIncorrectly = 0;
    this.currentQuizWordsWrong = 0;
  }

var currentUser = new User('Trial User');


