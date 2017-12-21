$(document).ready(function(){

 $("#submit").on("click", function(event) {

 	event.preventDefault();

	var searchInput = $("#search-input").val().trim();

	// value from dropdown
	var eventInput
	var cityInput = $("#city-input").val().trim();
	var stateInput = $("#state-input").val().trim();
	var zipInput = $("#zip-input").val().trim();
	var radiusInput = $("#radius-input").val().trim();


	var apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"

	// zip code for NY, needs to be changed to the user input
	var zipCode = "&postalCode=10002";

	var keyword = "&keyword=" + searchInput; //user keyword from dropdown

	var radius = "&radius=" + radiusInput; //user radius input

	var classificationName = "&classificationName=" + "";

	var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + keyword + classificationName;

	var apikey  = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO";

		$.ajax({
			type:"GET",
			url:queryUrl,
			async:true,
			dataType: "json",
			success: function(json) {
				console.log(json);

				var events = json.embedded.events;
				var locations = [];

				for (var i = 0; i < events.length; i++) {
					var venues = events[i].embedded.venues;
					for(var j = 0; j < venues.length; j++) {
						locations.push(venues[j].location);
					}
				}

				console.log(location)

				function initGoogleMap() {
					var map = new google.maps.Map(document.getElementById("map"), {
						zoom: 15,
						center: locations[0]
					})

					for (var k = 0; k < locations.length; k++) {
						var marker = new google.maps.Marker({
							position: locations[k],
							map: map
						});						
					}			
				}
              // Parse the response.
              // Do other things.
          },
          error: function(xhr, status, err) {
              // This time, we do not end up here!
          }
      });

	});

});

