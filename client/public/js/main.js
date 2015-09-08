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


// Progress Bar
$("#progress-stats").on("click", function(event) {
     event.preventDefault();
     $("#bar").toggle();
  });

$.getScript('http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',function(){
$.getScript('http://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.0/morris.min.js',function(){

      Morris.Donut({
        element: 'donut-1',
        data: [
         {label: "Correct", value: 70, color: "#578F72"},
         {label: "Incorrect", value: 30, color:"#61CA80"}
        ]
      });

        Morris.Donut({
        element: 'donut-2',
        data: [
         {label: "Correct", value: 10, color: "#3E58E8"},
         {label: "Incorrect", value: 12, color:"#3EA4E8"}
        ]
      });
});
});

// End Progress Bar


});//end on-ready


