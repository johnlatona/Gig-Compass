$(document).ready(function(){

 $("#submit").on("click", function(event) {

 	event.preventDefault();

	var searchInput = $("#search-input").val();

	// value from dropdown

	var eventInput = $('#eventType-input').find(":selected").text();
	console.log("eventInput" + eventInput)
	
	var cityInput = $("#city-input").val();
	var stateInput = $("#state-input").val();
	var zipInput = $("#zip-input").val();
	var radiusInput = $("#radius-input").val();


	var apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"

	var zipCode = "&postalCode=" + zipInput;

	var keyword = "&keyword=" + searchInput; 

	var radius = "&radius=" + radiusInput; 

	var classificationName = "&classificationName=" + eventInput;

	var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + keyword + classificationName;



	var apikey  = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO";



		$.ajax({
			type:"GET",
			url:queryUrl,
			async:true,
			dataType: "json",
			success: function(json) {
				console.log(json);
              // Parse the response.
              // Do other things.
          },
          error: function(xhr, status, err) {
              // This time, we do not end up here!
          }
      });

	});

});

