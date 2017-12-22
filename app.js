	var locations =[];

	var marker;

 	function initGoogleMap() {
 		console.log(locations);
		var map = new google.maps.Map(document.getElementById("map"), {
			zoom: 15,
			center: locations[0]
		})

		for (var k = 0; k < locations.length; k++) {
				marker = new google.maps.Marker({
				position: locations[k],
				map: map
			});						
		}			
	};

$(document).ready(function(){

	var string = "1.6525625";
	var number = parseFloat(string);

	console.log(string);
	console.log(number);

	var events;

	function clearLocations() {
		locations = [];
	}

 $("#submit").on("click", function(event) {
 	clearLocations();

 	event.preventDefault();
    var searchInput = $("#search-input").val();
    // value from dropdown
    var eventInput = $('#eventType-input').find(":selected").text();
    console.log("eventInput" + eventInput)
    
    var cityInput = $("#city-input").val();
    //&stateCode=il //&city=chicago
    var stateInput = $('#state-input').find(":selected").attr("value");
    var zipInput = $("#zip-input").val();
    var radiusInput = $("#radius-input").val();
    var apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"
    var city = "&city=" + cityInput;
    var state = "&stateCode=" + stateInput;
    var zipCode = "&postalCode=" + zipInput;
    var keyword = "&keyword=" + searchInput; 
    var radius = "&radius=" + radiusInput; 
    var classificationName = "&classificationName=" + eventInput;
    var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + city + state + radius+  keyword + classificationName;


		$.ajax({
			type:"GET",
			url:queryUrl,
			async:true,
			dataType: "json",
			success: function(json) {
				console.log(json);

				if(json.page.totalElements === 0) {
					alert("Sorry! There are no events in your area!");
					console.log("events " + events);
				}

				else{
					events = json._embedded.events;
					for (var i = 0; i < events.length; i++) {
						var venues = events[i]._embedded.venues;
						for(var j = 0; j < venues.length; j++) {
							if(!venues[j].location) {
								console.log("location undefined at " + i)
								continue;
							}
							else {

								var latLong = {lat: parseFloat(venues[j].location.latitude), lng: parseFloat(venues[j].location.longitude)};
								console.log(latLong);
								locations.push(latLong);
							}
						}
					}
				}
				initGoogleMap();

              // Parse the response.
              // Do other things.
          },
          error: function(xhr, status, err) {
              // This time, we do not end up here!
          }
      });
		 console.log("locations: " + [locations])
	});
});


