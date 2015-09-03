// add scripts
$(document).on('ready', function() {
   //sets index for quiz
  var index = 0;

  console.log('sanity check!');

   //practice translation
  $('#translate-form').on('submit', function(event){
   event.preventDefault();

   var phrase = $('#to-translate').val().trim();
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




/////CHALLENGES/////////

var originalWord;

  $('#challenge-start').on("click", function(event){
      event.preventDefault();
      //translating English array word to user selected START language
      var phrase = animalQuiz[index];
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
         $('.invis').fadeIn();
      })
   }); //end start challenge button


   //user submits answer
  $('#user-submit').on('click', function(event){
      event.preventDefault();
      var userSubmit;
      var answer;

      //finding answer by translating English array word to user selected END language
      var phrase = animalQuiz[index];
      var inputLang = 'en';
      var outputLang = $('#challenge-end-lang').val()

      var payload = {
         phrase:phrase.toLowerCase(),
         inputLang:inputLang,
         outputLang:outputLang
         }
         console.log(payload);
      $.post('/api/translate', payload, function(data) {
         userSubmit = data.original_text.trim().toLowerCase();
         answer = data.translated_text.trim().toLowerCase();
         console.log(userSubmit, answer);
         if(userSubmit === answer){
            $('#answers').append('<h2>Correct!<br>'+ originalWord + ' is ' + answer +'</h2>')
            //increment correct answers by 1
         }
         else{
            $('#answers').append('<h2>Incorrect<br>'+ originalWord + ' is ' + answer+'</h2>')
            //increment wrong answers by 1

         }
         //if wrong > five, start over, failed quizzes up by 1
         $('.appear-later').show();
      })
   }); //end challenge-submit

   //next question button
   $('#next-question').on('click', function(event){
      event.preventDefault();
      //moving to next word in array
      index += 1;
      $('#challenge-to-translate').html('');
      $('#answers').html('');
      $('#challenge-user-word').val('');
     //translating English array word to user selected START language
      var phrase = animalQuiz[index];
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
   }) //end next question




});//end on-ready

var animalQuiz = ['cat', 'dog', 'horse', 'tiger', 'lion', 'elephant', 'snake', 'fish', 'bird', 'bear', 'giraffe', 'zebra', 'pig', 'cow', 'duck', 'chicken', 'wolf', 'dolphin', 'lizard', 'sheep']



