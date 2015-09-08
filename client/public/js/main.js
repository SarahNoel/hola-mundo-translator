// add scripts
$(document).on('ready', function() {
  console.log('sanity check!');
  //scrolls to top on page refresh - LUCY ADDED
  $(this).scrollTop(0);

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
      };
      console.log(payload);

   $('#to-translate').val("");


   $.post('/api/translate', payload, function(data) {
      console.log(data);

      $('#result').append('<h4>'+ data.original_text.toLowerCase() +'  is ' + data.translated_text.toLowerCase() + '</h4>');
      });
   }); //end submit for practice

});//end on-ready

//scrolls nicely to services div when header button clicked - LUCY ADDED
$('#find-out-more').on('click', function(e){
  e.preventDefault();
  $('html, body').animate({
  scrollTop: $('a[name=services]').offset().top
  }, 1000);
});

