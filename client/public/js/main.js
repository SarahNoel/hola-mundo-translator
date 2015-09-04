$(document).on('ready', function() {
  var currentUser = new User('Trial User');

  $('#words-translated').html(currentUser.wordsTranslated);
  $('#words-correct').html(currentUser.wordsTranslatedCorrectly);
  $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly);
  $('#challenges-taken').html(currentUser.challengesTaken);
  $('#challenges-passsed').html(currentUser.challengesPassed);
  $('#challenges-failed').html(currentUser.challengesFailed);

///////////////////   PRACTICE  ///////////////////

   //practice translation
  $('#translate-form').on('submit', function(event){
   event.preventDefault();

   var phrase = $('#to-translate').val().toLowerCase().trim();
   var inputLang = $('#start-lang').val()
   var outputLang = $('#end-lang').val()

   var payload = {
      phrase:phrase,
      inputLang:inputLang,
      outputLang:outputLang
      }

   $('#to-translate').val("");

   $.post('/api/translate', payload, function(data) {
      console.log(data)

      $('#result').append('<h4>'+ data.original_text.toLowerCase() +'  is ' + data.translated_text.toLowerCase() + '</h4>')
      });
   }); //end submit for practice



///////////////////   CHALLENGES  ///////////////////

var index = 0;
var useArray;
var originalWord;
var progBarWidth = 0;
var questionNum = 1;


  $('#challenge-start').on("click", function(event){
      event.preventDefault();
      //choose array to quiz from
      var useArrayTitle = $('#challenge-quizzes').val();
      for (var i = 0; i < allQuizzes.length; i++) {
        if(useArrayTitle === allQuizzes[i].title){
          useArray = allQuizzes[i].content;
        }
      };
      console.log(useArray);

      //translating English array word to user selected START language
      var phrase = useArray[index].toLowerCase();
      var inputLang = 'en';
      var outputLang = $('#challenge-start-lang').val()

      var payload = {
         phrase:phrase,
         inputLang:inputLang,
         outputLang:outputLang
         }
      //append word for user to translate
      $.post('/api/translate', payload, function(data) {
         $('#challenge-to-translate').append('<h2>'+data.translated_text+'</h2>');
         originalWord = data.translated_text;
         $('.invis').fadeIn();
      })
   }); //end start challenge button


   //user submits answer
  $('#user-submit').on('click', function(event){
      event.preventDefault();
      currentUser.wordsTranslated += 1;
      progBarWidth += 5;
      $('#prog-bar').css({width:progBarWidth+'%'})

      $('#words-translated').html(currentUser.wordsTranslated)
      var userSubmit;
      var answer;

      //finding answer by translating English array word to user selected END language
      var phrase = useArray[index];
      var inputLang = 'en';
      var outputLang = $('#challenge-end-lang').val()

      userSubmit = $('#challenge-user-word').val().trim().toLowerCase();

      var payload = {
         phrase:phrase,
         inputLang:inputLang,
         outputLang:outputLang
         }

       $.post('/api/translate', payload, function(data) {
         answer = data.translated_text.trim().toLowerCase();
         console.log(userSubmit, answer);
         if(userSubmit === answer){
            $('#answers').append('<h2 class = "green">Correct!<br>'+ originalWord + ' is ' + answer +'</h2>');
               //increment correct answers by 1
               currentUser.wordsTranslatedCorrectly += 1;
              $('#words-correct').html(currentUser.wordsTranslatedCorrectly)

         }
         else{
            $('#answers').append('<h2 class = "red">Incorrect<br>'+ originalWord + ' is ' + answer+'</h2>')
               //increment wrong answers by 1
               currentUser.wordsTranslatedIncorrectly += 1;
               $('#words-incorrect').html(currentUser.wordsTranslatedIncorrectly)
         }
         //if wrong > five, start over, failed quizzes up by 1
         $('#challenge-user-word').val('');
         $('.hide-submit').hide();
         $('.appear-later').show();
      })
   }); //end challenge-submit

   //next question button
   $('#next-question').on('click', function(event){
      event.preventDefault();
      index += 1;
      questionNum += 1;
      $('#question-number').html("Question " + questionNum + "/20");
      if(index < 21){
         $('#challenge-to-translate').html('');
         $('#answers').html('');
         $('#challenge-user-word').val('');
        //translating English array word to user selected START language
         var phrase = useArray[index];
         var inputLang = 'en';
         var outputLang = $('#challenge-start-lang').val()

        var payload = {
            phrase:phrase.toLowerCase(),
            inputLang:inputLang,
            outputLang:outputLang
            }
         //append word for user to translate
        $.post('/api/translate', payload, function(data) {
            $('#challenge-to-translate').append('<h2>'+data.translated_text+'</h2>');
            originalWord = data.translated_text;
         })
         //hide next button
        $('.appear-later').hide();
        $('.hide-submit').show();

      }else{
         //go to quiz results page
      }
   }) //end next question



///////////////////   PROGRESS  ///////////////////


});//end on-ready

//quizzes

var animalQuiz = {
  title:'animalQuiz',
  content:['cat', 'dog', 'horse', 'tiger', 'lion', 'elephant', 'snake', 'fish', 'bird', 'bear', 'giraffe', 'zebra', 'pig', 'cow', 'duck', 'chicken', 'wolf', 'dolphin', 'lizard', 'sheep']
  };

var bodyQuiz = {
  title:'bodyQuiz',
  content:['arm', 'eye', 'belly', 'leg', 'elbow', 'finger', 'foot', 'hand', 'mouth', 'nose', 'head', 'ear', 'tongue', 'toe', 'back', 'shoulder', 'tongue', 'knee', 'hip', 'waist']
  };

var commonWordsQuiz = {
  title:'commonWordsQuiz',
  content:['hello', 'goodbye', 'please', 'thank you', 'sorry', 'excuse me', 'money', 'help', 'name', 'bathroom', 'left', 'right', 'doctor', 'police', 'how much', 'speak', 'water', 'where', 'yes', 'no']
  };

var travelQuiz = {
  title:'travelQuiz',
  content:['where is this', 'how far', 'what time is it', 'airplane', 'taxi', 'bus', 'airport', 'train', 'museum', 'hotel', 'restaurant', 'food', 'lost', 'understand', 'do you have', 'street', 'bank', 'need', 'table', 'menu']
  };

var numbersQuiz = {
  title:'numbersQuiz',
  content:['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
  };

var allQuizzes = [animalQuiz, bodyQuiz, commonWordsQuiz, travelQuiz, numbersQuiz];


var User = function(name){
    this.name = name;
    this.challengesTaken = 0;
    this.challengesPassed = 0;
    this.challengesFailed = 0;
    this.wordsTranslated = 0;
    this.wordsTranslatedCorrectly = 0;
    this.wordsTranslatedIncorrectly = 0;
  }



