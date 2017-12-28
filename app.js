var locations =[];

var marker;

function initGoogleMap() {
	console.log(locations);
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 15,
		center: {lat: locations[0].lat, lng: locations[0].lng}
	})

	for (var k = 0; k < locations.length; k++) {
		marker = new google.maps.Marker({
			position: {lat: locations[k].lat, lng: locations[k].lng},
			map: map,
			url: locations[k].url
		});
		marker.addListener('click', function() {
			window.open(this.url, "_blank");
		});                        
	}    
}; // initGoogleMap


$(document).ready(function(){

	var string = "1.6525625";
	var number = parseFloat(string);

	console.log(string);
	console.log(number);

	var events;

	var apiKey;
	var city
	var state;
	var zipCode;
	var keyword; 
	var radius; 
	var classificationName;
	var size;
	var page;

	var queryUrl;

	var numPerPage = 10;
	var totalEvents;
	var currentPage = 0;

	var searchObj = {
			keyword : "",
			category : "",
			city : "",
			state : "",
			zip : "",
			radius : 5,
			fromDate : moment(),
			toDate : moment()
		}


	console.log("numperpage" + numPerPage)


	function setSearchParameters() {
		// keyword
		searchObj.keyword = $("#keyword-input").val();

		// Category
		searchObj.category = "";
		if ($("#categories-selected")) {
			searchObj.category  = $("#categories-selected").val();
			searchObj.category = getCategory(searchObj.category);
		} 

		// city
		searchObj.city = $("#city-input").val();

		// state
		searchObj.state = $("#state-input").val();
		searchObj.state = getStateCode(searchObj.state);

		// zip
		searchObj.zip = $("#zip-input").val();

		// radius
		searchObj.radius = $("#radius-input").val();

		// from date
		searchObj.fromDate = moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";

		// to date
		searchObj.toDate = moment().add(7, 'days').format("YYYY-MM-DDTHH:mm:ss") + "Z";

		console.log(searchObj);

	} // setSearchParameters

	function getCategory(categoryValue) {
		switch(categoryValue) {
			case 100:
				return "music";
				break;
			case 200:
				return "sports"
				break;
			case 300:
				return "family";
				break;
			case 400:
				return "arts-theater"
				break;
			default:
				return "";
		}
	} // getCategory

	function getStateCode(state) {
		switch(state) {
			case "Alabama":
				return "AL";
				break;
			case "Alaska":
				return "AK";
				break;
			case "Arizona":
				return "AZ";
				break;
			case "Arkansas":
				return "AR";
				break;
			case "California":
				return "CA";
				break;
			case "Colorado":
				return "CO";
				break;
			case "Connecticut":
				return "CT";
				break;
			case "Delaware":
				return "DE";
				break;
			case "District Of Columbia":
				return "DC";
				break;
			case "Florida":
				return "FL";
				break;
			case "Georgia":
				return "GA";
				break;
			case "Hawaii":
				return "HI";
				break;
			case "Idaho":
				return "ID";
				break;
			case "Illinois":
				return "IL";
				break;
			case "Indiana":
				return "IN";
				break;
			case "Iowa":
				return "IA";
				break;
			case "Kansas":
				return "KS";
				break;
			case "Kentucky":
				return "KY";
				break;
			case "Louisiana":
				return "LA";
				break;
			case "Maine":
				return "ME";
				break;
			case "Maryland":
				return "MD";
				break;
			case "Massachusetts":
				return "MA";
				break;
			case "Michigan":
				return "MI";
				break;
			case "Minnesota":
				return "MN";
				break;
			case "Mississippi":
				return "MS";
				break;
			case "Missouri":
				return "MO";
				break;
			case "Montana":
				return "MT";
				break;
			case "Nebraska":
				return "NE";
				break;
			case "Nevada":
				return "AL";
				break;
			case "New Hampshire":
				return "NH";
				break;
			case "New Jersey":
				return "NJ";
				break;
			case "New Mexico":
				return "NM";
				break;
			case "New York":
				return "NY";
				break;
			case "North Carolina":
				return "NC";
				break;
			case "North Dakota":
				return "ND";
				break;
			case "Ohio":
				return "OH";
				break;
			case "Oklahoma":
				return "OK";
				break;
			case "Oregon":
				return "OR";
				break;
			case "Pennsylvania":
				return "PA";
				break;
			case "Rhode Island":
				return "RI";
				break;
			case "South Carolina":
				return "SC";
				break;
			case "South Dakota":
				return "SD";
				break;
			case "Tennessee":
				return "TN";
				break;
			case "Texas":
				return "TX";
				break;
			case "Utah":
				return "UT";
				break;
			case "Vermont":
				return "VT";
				break;
			case "Virginia":
				return "VA";
				break;
			case "Washington":
				return "WA";
				break;
			case "West Virginia":
				return "WV";
				break;
			case "Wisconsin":
				return "WI";
				break;
			case "Wyoming":
				return "WY";
				break;
			default:
				return "";			
		}
	}


	function clearLocations() {
		locations = [];
	}

	function clearEvents(){
		$("#event-list").empty();
	}

	function ajaxCall(){

		clearEvents();
		clearLocations();

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

								var latLong = {lat: parseFloat(venues[j].location.latitude), lng: parseFloat(venues[j].location.longitude), url: "https://www.google.com/maps/dir/?api=1&map_action=map&destination=" + venues[j].location.latitude + "%2C+" + venues[j].location.longitude};
								console.log(latLong);
								locations.push(latLong);
							}
						}
					}


					//display the information

					for (var m = 0; m < events.length; m++) {

						console.log("event name:" + events[m].name);
						console.log("date and time: " + events[m].dates.start.localDate + " " + events[m].dates.start.localTime)
						console.log("venue: " + events[m]._embedded.venues[0].name)
						console.log("Address: " + events[m]._embedded.venues[0].address.line1)
						console.log(events[m]._embedded.venues[0].city.name + ", " + 
							events[m]._embedded.venues[0].state.stateCode + " " +
							events[m]._embedded.venues[0].postalCode )
						console.log("url: " + events[m].url )

						var eventDisplay = $("<div>").addClass("event");

						var eventUrl = $("<a>").addClass("event-link");
						eventUrl.attr("href", events[m].url)
						eventUrl.attr("target", "_blank")
						
						var eventName = $("<span>").addClass("name-display");
						eventName.append(events[m].name);
						eventUrl.append(eventName);

						var par = $("<p>");

						var eventDate = $("<span>").addClass("date-display");
						var formattedDate = (moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						var time = events[m].dates.start.localTime;
						var convertedTime = moment(time, "HH:mm:ss")
						eventDate.append(formattedDate + " " + moment(convertedTime).format("h:mm A"));

						var eventVenue = $("<span>").addClass("venue-display");
						eventVenue.append("<br>"+ events[m]._embedded.venues[0].name);

						var eventAddress = $("<span>").addClass("venu-address1-display");
						eventAddress.append("<br>" + events[m]._embedded.venues[0].address.line1);
						
						var eventCity = $("<span>").addClass("venue-city-display");
						eventCity.append("<br>" + events[m]._embedded.venues[0].city.name + ", " + 
							events[m]._embedded.venues[0].state.stateCode + " " +
							events[m]._embedded.venues[0].postalCode);

						par.append(eventDate, eventVenue, eventAddress, eventCity);
						par.addClass("par-display");
						var eventPic = $("<img src=" + events[m].images[2].url + " alt=" + events[m].name + ">");
						eventPic.addClass("image-display");
						eventDisplay.append(eventUrl, par, eventPic);

						$("#event-list").append(eventDisplay);


						totalEvents = json.page.totalElements;


						// console.log(moment(events[m].dates.start.localDate).format("dddd"));
						console.log(moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						console.log(moment(time, "HH:mm:ss"))
						console.log(moment(convertedTime).format("h:mm A"))



						

					}

					// to prevent additional pagination each time
					$(".pagination").empty();

					console.log(totalEvents + " Total Events")
					if (totalEvents > numPerPage){
						var numPages;
						if (totalEvents < numPerPage*10){
							numPages = Math.ceil(totalEvents/numPerPage)
							console.log(numPages + " numPages");
						}

						else{
							numPages = 10;
							console.log(numPages + " numPages");
						}


						for (var q = 0; q < numPages; q++) {
							var pageList = $("<li class='page-item'><a class='page-link'>" + parseInt(q+1) + "</a></li>");
							pageList.attr("data-number", q);
							if (q==currentPage){
								pageList.addClass("active")
							}

							pageList.attr("id", "page-" + parseInt(q+1))
							$(".pagination").append(pageList)

						}

    			} // close if totalEvents > numPerPage (pagination)


				} // close the else --> when there are events in the response

				initGoogleMap();



				console.log("queryUrl" + queryUrl);



          }, //close success
          error: function(xhr, status, err) {
              // This time, we do not end up here!
          }
      }); // close ajax

	} //close function definition



	$("#submit").on("click", function(event) {
		event.preventDefault();

		setSearchParameters();

		clearLocations();

		//every time there is a new search, go to first page of results
		currentPage = 0;

		// clearEvents();

		apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"
		city = "&city=" + searchObj.city;
		state = "&stateCode=" + searchObj.state;
		zipCode = "&postalCode=" + searchObj.zip;
		keyword = "&keyword=" + searchObj.keyword; 
		radius = "&radius=" + searchObj.radius; 
		classificationName = "&classificationName=" + searchObj.category;


		size = "&size=" + numPerPage;
		page = "&page=" + currentPage;

		queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + city + state + radius+  keyword + classificationName + size + page;

		ajaxCall();


		console.log("locations: " + [locations])

	}); //submit click


	$("#page-buttons").on("click", "li", function() {
		currentPage = $(this).attr("data-number");

		console.log("currentPage " + currentPage)



		// // console.log(($(this).val) + "this.val()")
		page = "&page=" + currentPage

		// remove active class from all page numbers 
		//(this way we don't have to determine which page number was the last one clicked)
		$(".page-item").removeClass("active");
		//add class "active" to the page numebr clicked
		$(this).addClass("active");
		queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + city + state + radius+  keyword + classificationName + size + page;

		//ajaxCall with the new page number in queryUrl
		ajaxCall();

	}); //page-button click


	// Search  - modal popups
	$('.modal').modal({
	      dismissible: true, // Modal can be dismissed by clicking outside of the modal
	      opacity: 0, // Opacity of modal background
	      inDuration: 300, // Transition in duration
	      outDuration: 200, // Transition out duration
	      startingTop: '4%', // Starting top style attribute
	      endingTop: '15%', // Ending top style attribute
	      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
	      	console.log(modal, trigger);
	      },
	      complete: function() { 

	      } // Callback for Modal close
 	 });


	// Search - form select
	$('select').material_select();


    $('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 15, // Creates a dropdown of 15 years to control year,
	    today: 'Today',
	    clear: 'Clear',
	    close: 'Ok',
	    closeOnSelect: true // Close upon selecting a date,
  	});

  	// Search - categories
  	$(document).on("click", "#categories", function() {
  		var selected = $("#categories-selected");

  		if (selected) {
  			selected.attr("id", "categories");
  		}
  		$(this).attr("id", "categories-selected");
  	});

  	$(document).on("click", "#categories-selected", function() {
  		$(this).attr("id", "categories");
  	});


  	// auto complete for state input

  	 $(function() {
  		$('#state-input').autocomplete({
   		 data: {
			"Alabama" : null,
			"Alaska" : null,
			"Arizona" : null,
			"Arkansas" : null,
			"California" : null,
			"Colorado" : null,
			"Connecticut" : null,
			"Delaware" : null,
			"District Of Columbia" : null,
			"Florida" : null,
			"Georgia" : null,
			"Hawaii" : null,
			"Idaho" : null,
			"Illinois" : null,
			"Indiana" : null,
			"Iowa" : null,
			"Kansas" : null,
			"Kentucky" : null,
			"Louisiana" : null,
			"Maine" : null,
			"Maryland" : null,
			"Massachusetts" : null,
			"Michigan" : null,
			"Minnesota" : null,
			"Mississippi" : null,
			"Missouri" : null,
			"Montana" : null,
			"Nebraska" : null,
			"Nevada" : null,
			"New Hampshire" : null,
			"New Jersey" : null,
			"New Mexico" : null,
			"New York" : null,
			"North Carolina" : null,
			"North Dakota" : null,
			"Ohio" : null,
			"Oklahoma" : null,
			"Oregon" : null,
			"Pennsylvania" : null,
			"Rhode Island" : null,
			"South Carolina" : null,
			"South Dakota" : null,
			"Tennessee" : null,
			"Texas" : null,
			"Utah" : null,
			"Vermont" : null,
			"Virginia" : null,
			"Washington" : null,
			"West Virginia" : null,
			"Wisconsin" : null,
			"Wyoming" : null
    		}
  		});
	}); 



}); //document.ready

