// add scripts
$(document).on('ready', function() {
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
      console.log(payload);

   $('#to-translate').val("");


   $.post('/api/translate', payload, function(data) {
      console.log(data)

      $('#result').append('<h4>'+ data.original_text.toLowerCase() +'  is ' + data.translated_text.toLowerCase() + '</h4>')
      });
   }); //end submit for practice






});//end on-ready


