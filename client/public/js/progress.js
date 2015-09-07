//Morris charts snippet - js

$.getScript('http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',function(){
$.getScript('http://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.0/morris.min.js',function(){

      Morris.Donut({
        element: 'donut-1',
        data: [
         {label: "Correct", value: 70, color: "#578F72"},
         {label: "Incorrect", value: 30, color: "#61CA80"}
        ]
      });

        Morris.Donut({
        element: 'donut-2',
        data: [
         {label: "Correct", value: 10, color: "#3E58E8"},
         {label: "Incorrect", value: 12, color: "#3EA4E8"}
        ]
      });



});
});
