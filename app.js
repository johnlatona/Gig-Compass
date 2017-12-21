
	var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=RElm0QfyEntLwlAvZwiZBD5GExqBRGIO&postalCode=10002";

		var url1 = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=RElm0QfyEntLwlAvZwiZBD5GExqBRGIO";

		var apikey  = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO";

		$.ajax({
			type:"GET",
			url:url,
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

