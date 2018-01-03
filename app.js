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

	$(".error-pop-up-row").hide();

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
	var startDateTime;
	var EndDateTime;
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
			fromDate : "",
			toDate : ""
		}

	var popUpIdArr = [];

	var selectedCategory = "";

	var mouseDownCordinates = [];

	setSearchParametersFromLocalStorage();

	console.log("numperpage" + numPerPage)

	

	// Functions

	function errorCall(errorMessage) {
		$(".error-pop-up-row").fadeIn("fast");
		$(".error-content").html(errorMessage);
		$("#map").hide();
	}


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
		searchObj.stateLongName = $("#state-input").val();
		searchObj.state = getStateCode(searchObj.stateLongName);

		// zip
		searchObj.zip = $("#zip-input").val();

		// radius
		searchObj.radius = $("#radius-input").val();

		// from date
		searchObj.fromDate = $("#from-date-input").val();
		if (!searchObj.fromDate == "") {
			searchObj.fromDateDisplay = searchObj.fromDate;
			searchObj.fromDate = moment(searchObj.fromDate).format("YYYY-MM-DD") + moment(searchObj.fromDate).format("THH:mm:ss") + "Z";
		} else {
			searchObj.fromDateDisplay = "";
		}

		// to date
		searchObj.toDate = $("#to-date-input").val();
		if (!searchObj.toDate == "") {
			searchObj.toDateDisplay = searchObj.toDate;
			searchObj.toDate =  moment(searchObj.toDate).format("YYYY-MM-DD") +  moment(searchObj.toDate).format("THH:mm:ss") + "Z";
		} else {
			searchObj.toDateDisplay = "";
		}

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

	function setLocalStorageFromSearchParameter() {
	 // Clear absolutely everything stored in localStorage using localStorage.clear()
      localStorage.clear();

      // Store the username into localStorage using "localStorage.setItem"
      localStorage.setItem("searchObj", JSON.stringify(searchObj));
	}


	function setSearchParametersFromLocalStorage() {
		var tempSearchObj = JSON.parse(localStorage.getItem("searchObj"));
		if (tempSearchObj) {	// check if local storage has data
			searchObj = tempSearchObj;
		}

		// Category
		if (searchObj.category) {
			var categoryElement = "#" + searchObj.category;
			$(categoryElement).attr("id", "categories-selected");
		}
		selectedCategory = searchObj.category;

		// city
		$("#city-input").val(searchObj.city);

		// state
		$("#state-input").val(searchObj.stateLongName);

		// zip
		$("#zip-input").val(searchObj.zip);

		// radius
		 $("#radius-input").val(searchObj.radius);

		// from date
		$("#from-date-input").val(searchObj.fromDateDisplay);

		// to date
		$("#to-date-input").val(searchObj.toDateDisplay);

	} //setSearchParametersFromLocalStorage

	function clearLocations() {
		locations = [];
	}

	function clearEvents(){
		$("#event-list").empty();
	}

	function ajaxCall(){

		clearEvents();
		clearLocations();
		$("#map").show();

		$.ajax({
			type:"GET",
			url:queryUrl,
			async:true,
			dataType: "json",
			success: function(json) {
				console.log(json);

				if(json.page.totalElements === 0) {
					var msg = "<h5>Sorry!...We couldn't find any events that match what you're looking for.</h5><br><h5>Please try another search.</h5>";

					errorCall(msg);
					
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


	 function delayClick() {  // open menu modal if x,y coordinates are on icon
  	 	console.log("30 seconds");
  	 	click(mouseDownCordinates[0], mouseDownCordinates[1])
  	 }


  	 function click(x,y){  // simulate  click
		var ev = document.createEvent("MouseEvent");
		var el = document.elementFromPoint(x,y);
		ev.initMouseEvent(
			"click",
			true /* bubble */, true /* cancelable */,
			window, null,
			x, y, x, y, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		el.dispatchEvent(ev);
	}

	function isDateRangeValid() {
		if (searchObj.toDateDisplay < searchObj.fromDateDisplay) {
			console.log("Please enter valid date range");
			return false;
		}
		return true;
	}


	// Events

	$("#submit").on("click", function(event) {
		event.preventDefault();

		setSearchParameters();

		if (!isDateRangeValid()) {
			errorCall("<h5>Please enter a valid date range</h5>");
			return false;
		}

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
		startDateTime = "&startDateTime=" + searchObj.fromDate;
		endDateTime = "&endDateTime=" + searchObj.toDate;
		classificationName = "&classificationName=" + searchObj.category;


		size = "&size=" + numPerPage;
		page = "&page=" + currentPage;

		queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + zipCode + city + state + radius+  keyword + startDateTime + endDateTime + classificationName + size + page;


		ajaxCall();


		console.log("locations: " + [locations])

		setLocalStorageFromSearchParameter();

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

	$(document).on("click", ".close-error", function() {
		$(".error-pop-up-row").fadeOut("fast");
	});


	// Search  - modal popups
	$('.modal').modal({
	      dismissible: true, // Modal can be dismissed by clicking outside of the modal
	      opacity: 0, // Opacity of modal background
	      inDuration: 300, // Transition in duration
	      outDuration: 200, // Transition out duration
	      startingTop: '4%', // Starting top style attribute
	      endingTop: '15%', // Ending top style attribute
	      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
	      },
	      complete: function() { 
	      	setTimeout(delayClick, 200); // add click to invoke icon click if mouse on icon position
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


  	// Select and deselect search categories
  	$(document).on("click", ".categories", function() {
  		var deselect = false;
  		var newSelect = getCategory($(this).val());

  		// remove previously selected category
  		if (selectedCategory) {
  			if (selectedCategory === newSelect) {
  				deselect = true;
  			}
  			var selected = $("#categories-selected");
  			selected.attr("id", selectedCategory);
  			selectedCategory = "";
  		}

  		// check for deselect
  		if (deselect) {
  			$(this).attr("id", newSelect);
  			selectedCategory = "";
  		}else {	// select new category
  			$(this).attr("id", "categories-selected");
  			selectedCategory = newSelect;
  		}
  		
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


  	$('body').mousedown(function(e) {  // keepp track of mouse down coordinates to open menu modal
		mouseDownCordinates[0] = e.clientX;
		mouseDownCordinates[1] = e.clientY;
	});

		// force focus when modal is open and click on input field
	$("#keyword-input").on("click", function() {
		$(this).focus(); 
	});



}); //document.ready