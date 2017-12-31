var locations =[];

var marker;

function initGoogleMap() {
	console.log(locations);
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 12,
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

	$(".background-opacity").hide();

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

	var popUpIdArr = [];


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
		searchObj.state = $("#state-input option:selected").val();

		// zip
		searchObj.zip = $("#zip-input").val();

		// radius
		searchObj.radius = $("#radius-input").val();

		// from date
		searchObj.fromDate = moment();

		// to date
		searchObj.toDate = moment().add(7, 'days');

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

						eventDisplay.attr("data-pop-up-id", "#pop-up" + m)

						var eventRow = $("<div>");
						eventRow.addClass("row");

						eventColOne = $("<div>").addClass("col-xs-4");

						var eventPic = $("<img src=" + events[m].images[2].url + " alt=" + events[m].name + ">");
						eventPic.addClass("image-display");

						eventColOne.append(eventPic);

						var eventColTwo = $("<div>").addClass("col-xs-8");

						var eventTitle = $("<h5>");
						eventTitle.addClass("name-display");
						eventTitle.append(events[m].name);

						var par = $("<p>");

						var eventDate = $("<span>").addClass("date-display");
						var formattedDate = (moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						var time = events[m].dates.start.localTime;
						var convertedTime = moment(time, "HH:mm:ss")
						eventDate.append(formattedDate + " " + moment(convertedTime).format("h:mm A"));

						var eventVenue = $("<span>").addClass("venue-display");
						eventVenue.append("<br>"+ events[m]._embedded.venues[0].name);

						par.append(eventDate, eventVenue);
						par.addClass("par-display");

						eventColTwo.append(eventTitle, par);
						eventRow.append(eventColOne, eventColTwo);
						eventDisplay.append(eventRow);
						$("#event-list").append(eventDisplay);


						// console.log(moment(events[m].dates.start.localDate).format("dddd"));
						console.log(moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						var time = events[m].dates.start.localTime;
						console.log(moment.parseZone(time)._i);
						console.log("time: " + time)
						console.log(moment(time, "HH:mm a"));

						var popUpEvent = $("<div>");
						//Adds class="pop-up-event" to each new pop up div
						popUpEvent.addClass("col-md-10 col-md-offset-1 pop-up-event");
						//Adds a pop up number id corresponding to each index number of the events array.
						popUpEvent.attr("id", "pop-up" + m);
						//Creates a new content div for each pop up
						var popUpContent = $("<div>");
						popUpContent.addClass("pop-up-content container-fluid");
						//first row content in pop up: Event name, date and time, and a button to close the pop up
						var firstRow = $("<div>");
						firstRow.addClass("row");
						firstRow.attr("id", "pop-up-header");
						var firstRowColOne = $("<div>");
						firstRowColOne.addClass("col-xs-11");
						var popUpHeading = $("<h3>");
						popUpHeading.text(events[m].name);
						var expandedEventDateTime = $("<p>");
						expandedEventDateTime.text(moment(events[m].dates.start.localDate).format("dddd, MMMM Do, YYYY") + " at " + moment(convertedTime).format("h:mm A"));
						firstRowColOne.append(popUpHeading, expandedEventDateTime);
						var firstRowColTwo = $("<div>");
						firstRowColTwo.addClass("col-xs-1");
						var closeButton = $("<button>");
						closeButton.addClass("waves-effect waves-green btn-flat close-button col-xs-1");
						closeButton.text("X");
						firstRowColTwo.append(closeButton);
						firstRow.append(firstRowColOne, firstRowColTwo);
						//second row content in pop up: event picture, venue name, and address
						var secondRow = $("<div>");
						secondRow.addClass("row");
						var secondRowColOne = $("<div>");
						secondRowColOne.addClass("col-xs-5");
						var popUpImg = $('<img src="' + events[m].images[2].url + '" alt="' + events[m].name + '" class="pop-up-img">');
						secondRowColOne.append(popUpImg);
						var secondRowColTwo = $("<div>");
						secondRowColTwo.addClass("col-xs-7");
						secondRowColTwo.html('<h4>' + events[m]._embedded.venues[0].name + "</h4><br><h6>Address:</h6><br><p>" + events[m]._embedded.venues[0].address.line1 + "</p><p>" + events[m]._embedded.venues[0].city.name + ", " + events[m]._embedded.venues[0].state.stateCode + " " +
						events[m]._embedded.venues[0].postalCode + "</p>");
						secondRow.append(secondRowColOne, secondRowColTwo);
						//third row content pop up: purchase tickets button
						var thirdRow = $("<div>")
						thirdRow.addClass("row");
						var thirdRowColOne = $("<div>");
						thirdRowColOne.addClass("col-xs-12");
						var purchaseButton = $("<button>");
						purchaseButton.addClass("purchase-button");
						purchaseButton.attr("data-url", events[m].url);
						purchaseButton.text("Purchase Tickets");
						thirdRow.append(purchaseButton);
						//Pop up Footer: Next and Previous buttons to cycle through event pop ups.
						var popUpFooter = $("<div>");
						popUpFooter.addClass("pop-up-footer");
						var previousButton = $("<button>");
						previousButton.addClass("waves-effect waves-green btn-flat previous-button");
						previousButton.attr("data-pop-up-id", "#pop-up" +m);
						previousButton.text("<< Previous Result");
						var nextButton = $("<button>");
						nextButton.addClass("waves-effect waves-green btn-flat next-button");
						nextButton.attr("data-pop-up-id", "#pop-up" +m);
						nextButton.text("Next Result >>");
						popUpFooter.append(previousButton, nextButton);

						popUpContent.append(firstRow, secondRow, thirdRow, popUpFooter);

						popUpEvent.append(popUpContent);

						var id = previousButton.attr("data-pop-up-id");
						popUpIdArr.push(id);


						$("#main-content").append(popUpEvent);

						$("#pop-up" + m).hide();



						totalEvents = json.page.totalElements;


						// console.log(moment(events[m].dates.start.localDate).format("dddd"));
						console.log(moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						var time = events[m].dates.start.localTime;
						console.log(moment.parseZone(time)._i);
						console.log("time: " + time)
						console.log(moment(time, "HH:mm a"));
						console.log("IDs: " +popUpIdArr);

					}

					//Opens ticket purchase page in a new window
					$(document).on("click", ".purchase-button", function() {
						var purchaseUrl = $(this).attr("data-url");
						window.open(purchaseUrl, "_blank");
					})
					//Opens pop-up by clicking on the search result
					$(document).on("click", ".event", function() {
						var popUpId = $(this).attr("data-pop-up-id");
						$(".background-opacity").fadeIn("fast");
						$(popUpId).fadeIn("fast");
						console.log("POP UP WORKING");
					})
					//Closes the pop-up
					$(document).on("click", ".close-button", function() {
						$(".background-opacity").fadeOut("fast");
						$(".pop-up-event").fadeOut("fast");

					})

					$(document).on("click", ".previous-button", function() {
						var prevButtonId = $(this).attr("data-pop-up-id");
						console.log(prevButtonId);
						if(prevButtonId == popUpIdArr[0]) {
							return;
						}
						else {
							for(var index = 0; index < popUpIdArr.length; index++) {
								if(prevButtonId == popUpIdArr[index]) {
									$(prevButtonId).hide();
									$(popUpIdArr[index - 1]).show();
								}
							}
						}
					})

					$(document).on("click", ".next-button", function() {
						var nextButtonId = $(this).attr("data-pop-up-id");
						console.log(nextButtonId);
						if(nextButtonId == popUpIdArr[popUpIdArr.length - 1]) {
							console.log("I can't go any farther");
							return;
						}
						else {
							console.log("starting for loop");
							console.log(popUpIdArr);
							for(var index = 0; index < popUpIdArr.length; index++) {
								if(nextButtonId == popUpIdArr[index]) {
									console.log("on to the next pop up");
									$(nextButtonId).hide();
									$(popUpIdArr[index + 1]).show();					
								}
							}
						}
					})


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

		$(".pop-up-event").remove();

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

		$(".pop-up-event").remove();



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


   //  $('.datepicker').pickadate({
	  //   selectMonths: true, // Creates a dropdown to control month
	  //   selectYears: 15, // Creates a dropdown of 15 years to control year,
	  //   today: 'Today',
	  //   clear: 'Clear',
	  //   close: 'Ok',
	  //   closeOnSelect: false // Close upon selecting a date,
  	// });

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





}); //document.ready