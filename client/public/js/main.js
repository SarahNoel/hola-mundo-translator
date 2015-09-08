// add scripts
$(document).on('ready', function() {
  console.log('sanity check!');

//dropdown for TranslateFrom languages
$(".option1 a").click(function(){
      $(".btn1:first-child").text($(this).text());
      $(".btn1:first-child").val($(this).text());
   });
//dropdown for TranslateTo languages
$(".option2 li a").click(function(){
      $(".btn2:first-child").text($(this).text());
      $(".btn2:first-child").val($(this).text());
   });

//dropdown for Quiz Themes
$(".option3 li a").click(function(){
      $(".btn3:first-child").text($(this).text());
      $(".btn3:first-child").val($(this).text());
   });

   //practice translation
  $('#translate-form').on('submit', function(event){
   event.preventDefault();

   var phrase = $('#to-translate').val().trim();
   var inputLang = $('#start-lang').val();
   var outputLang = $('#end-lang').val();

   var payload = {
      phrase:phrase,
      inputLang:inputLang,
      outputLang:outputLang
      }
      console.log(payload);

   $('#to-translate').val("");


   $.post('/api/translate', payload, function(data) {
      console.log(data);

      $('#result').append('<h4>'+ data.original_text.toLowerCase() +'  is ' + data.translated_text.toLowerCase() + '</h4>')
      });
   }); //end submit for practice


$("#progress-stats").on("click", function(event) {
     event.preventDefault();
     $("#bar").toggle();
  });


});//end on-ready


