

var apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"

// zip code for NY, needs to be changed to the user input
var zipCode = "&postalCode=" + "10002"

var keyword = "&keyword=" + "" //user keyword from dropdown

var radius = "&radius=" + "15" //user radius input

var classificationName = "&classificationName=music"

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

