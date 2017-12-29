

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
	};

$(document).ready(function(){

   	$('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        alert("Ready");
        console.log(modal, trigger);
      },
      complete: function() { alert('Closed'); } // Callback for Modal close
    }
  );

	var string = "1.6525625";
	var number = parseFloat(string);

	console.log(string);
	console.log(number);

	var events;

	var searchInput;
  var eventInput;

  
  var cityInput;
  
  var stateInput;
  var zipInput;
  var radiusInput;
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
  

  console.log("numperpage" + numPerPage)

 
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

						eventDisplay.attr("pop-up-id", "#pop-up" + m)

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
						var eventPic = $("<img src=" + events[m].images[2].url + " alt=" + events[m].name + ">");
						eventPic.addClass("image-display");
						eventDisplay.append(eventTitle, par, eventPic);

						$("#event-list").append(eventDisplay);


						
						//Creates a new modal for each iteration
						var popUpEvent = $("<div>");
						//Adds class="modal" to each new modal div
						popUpEvent.addClass("col-md-10 col-md-offset-1 pop-up-event");
						//Adds a modal number id corresponding to each index number of the events array.
						popUpEvent.attr("id", "pop-up" + m);
						//Creates a new content div for each modal
						var popUpContent = $("<div>");
						popUpContent.addClass("pop-up-content");
						//first row content in modal: Event name, date and time
						var firstRow = $("<div>");
						firstRow.addClass("row");
						var firstRowColOne = $("<div>");
						firstRowColOne.addClass("col-xs-12");
						var popUpHeading = $("<h3>");
						popUpHeading.text(events[m].name);
						var expandedEventDateTime = $("<p>");
						expandedEventDateTime.text(moment(events[m].dates.start.localDate).format("dddd, MMMM Do, YYYY") + " at " + moment(convertedTime).format("h:mm A"));
						firstRowColOne.append(popUpHeading, expandedEventDateTime);
						firstRow.append(firstRowColOne);
						//second row content in modal: event picture, venue name, and address
						var secondRow = $("<div>");
						secondRow.addClass("row");
						var secondRowColOne = $("<div>");
						secondRowColOne.addClass("col-xs-5");
						secondRowColOne.append(eventPic);
						var secondRowColTwo = $("<div>");
						secondRowColTwo.addClass("col-xs-7");
						secondRowColTwo.html('<h4>' + events[m]._embedded.venues[0].name + "</h4><br><h5>Address:</h5><br><h6>" + events[m]._embedded.venues[0].address.line1 + "</h6><br><h6>" + events[m]._embedded.venues[0].city.name + ", " + events[m]._embedded.venues[0].state.stateCode + " " +
						events[m]._embedded.venues[0].postalCode);
						secondRow.append(secondRowColOne, secondRowColTwo);
						//third row content in modal: purchase tickets button
						var thirdRow = $("<div>")
						thirdRow.addClass("row");
						var thirdRowColOne = $("<div>");
						thirdRowColOne.addClass("col-xs-12 row-three");
						var purchaseButton = $("<a>");
						purchaseButton.attr("href", events[m].url);
						purchaseButton.attr("target", "_blank");
						purchaseButton.addClass("waves-effect waves-green btn-flat");
						purchaseButton.text("Purchase Tickets");
						thirdRow.append(purchaseButton);
						//Modal Footer: Close Button, and Next and Previous buttons to cycle through event modals.
						var popUpFooter = $("<div>");
						popUpFooter.addClass("pop-up-footer");
						var closeButton = $("<button>");
						closeButton.addClass("waves-effect waves-green btn-flat");
						closeButton.text("X Close");
						var previousButton = $("<button>");
						previousButton.addClass("waves-effect waves-green btn-flat");
						previousButton.text("Previous Result");
						var nextButton = $("<button>");
						nextButton.addClass("waves-effect waves-green btn-flat");
						previousButton.text("Next Result");
						popUpFooter.append(closeButton, previousButton, nextButton);

						popUpContent.append(firstRow, secondRow, thirdRow, popUpFooter);

						popUpEvent.append(popUpContent);

						$("#main-content").append(popUpEvent);



						totalEvents = json.page.totalElements;


						// console.log(moment(events[m].dates.start.localDate).format("dddd"));
						console.log(moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						var time = events[m].dates.start.localTime;
						console.log(moment.parseZone(time)._i);
						console.log("time: " + time)
						console.log(moment(time, "HH:mm a"));

						console.log(modal + m);

					}


/*
						var eventUrl = $("<a>").addClass("event-link");
						eventUrl.attr("href", events[m].url)
						eventUrl.attr("target", "_blank")
						
						var eventName = $("<span>").addClass("name-display");
						eventName.append(events[m].name);
						eventUrl.append(eventName);

						var par = $("<p>");

						var eventDate = $("<span>").addClass("date-display");
						var formattedDate = (moment(events[m].dates.start.localDate).format("ddd MM/DD/YY"));
						eventDate.append(formattedDate + " " + events[m].dates.start.localTime);

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
						var time = events[m].dates.start.localTime;
						console.log(moment.parseZone(time)._i);
						console.log("time: " + time)
						console.log(moment(time, "HH:mm a"));

					}
*/
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
 	clearLocations();

 	//every time there is a new search, go to first page of results
 	currentPage = 0;
 	

 	// clearEvents();

 	event.preventDefault();
  var searchInput = $("#search-input").val();
  // value from dropdown
  var eventInput = $('#eventType-input').find(":selected").attr("value");
  console.log("eventInput" + eventInput)
  
  cityInput = $("#city-input").val();
  //&stateCode=il //&city=chicago
  stateInput = $('#state-input').find(":selected").attr("value");
  zipInput = $("#zip-input").val();
  radiusInput = $("#radius-input").val();
  apiKey = "RElm0QfyEntLwlAvZwiZBD5GExqBRGIO"
  city = "&city=" + cityInput;
  state = "&stateCode=" + stateInput;
  zipCode = "&postalCode=" + zipInput;
  keyword = "&keyword=" + searchInput; 
  radius = "&radius=" + radiusInput; 
  classificationName = "&classificationName=" + eventInput;
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



}); //document.ready
