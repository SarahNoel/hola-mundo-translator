// add scripts
$(document).on('ready', function() {
  console.log('sanity check!');

  $('#translate-form').on('submit', function(event){
   event.preventDefault();

   var phrase = $('#phrase').val();
   var inputLang = $('#start-lang').val();
   var outputLang = $('#end-lang').val()

   var payload = {
      phrase:phrase,
      inputLang:inputLang,
      outputLang:outputLang
      }

   $.get('/api/translate', payload, function(data) {
      console.log(data);
  });
});




});//end on-ready





