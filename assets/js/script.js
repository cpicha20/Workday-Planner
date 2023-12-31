// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  makePlanner();
  colorchange();
  currentDate();

  //Save button that saves the textArea 
  $(".saveBtn").on("click", function () {
    let blockIndex = $(this).parent().attr("id");
    let message = $(this).prev().val();

    // create new object
    let entry = {};

    entry.index = blockIndex;
    entry.note = message;
//Load an array from localStorage  
    let saveArray = JSON.parse(localStorage.getItem("save"));
    if (saveArray === null) {
      saveArray = [];
    }
    //loop through localStorage array and remove entries with the same ID
    for (let i = 0; i < saveArray.length; i++) {
      if (blockIndex === saveArray[i].index) {
        saveArray.splice(i, 1);
      }
    }

    //add new message
    saveArray.push(entry);
    var jsonString = JSON.stringify(saveArray);
    localStorage.setItem("save", jsonString);
  });
});

let currentTime = dayjs().hour();

//uses DayJS to find and render current date onscreen
function currentDate() {
  currentday = $("#currentDay");
  currentday.text(dayjs().format(`dddd, MMMM D`));


  //Update date/colors every minute
  setInterval(function () {
    colorchange();
    currentTime = dayjs().hour();
    currentday.text(dayjs().format(`dddd, MMMM D`));
  }, 60000);
}

//Spawn time block elements 
function makePlanner() {
  //loop through and spawn timeblocks
  for (let i = 9; i <= 17; i++) {
    timeBlock = $(`<div id="hour-${i}" class="row time-block past"> </div>`);
    timeBlock.append($(`<div class="col-2 col-md-1 hour text-center py-3"> ${Am2PM(i)} </div>`));
    timeBlock.append($(`<textarea class="col-8 col-md-10 description" rows="3"></textarea>`));
    buttonBlock = $(`<button class="btn saveBtn col-2 col-md-1" aria-label="save"></button>`);
    buttonBlock.append($(`<i class="fas fa-save" aria-hidden="true"></i>`));
    timeBlock.append(buttonBlock);
    $(".planner").append(timeBlock);
 
  }
  //Fills out text area with localStorage  
loadSave();
}

//Prints out AM or PM times based on for loop i value
function Am2PM(time) {
  if (time < 12) {
    return `${time}AM`;
  } else if (time === 12) {
    return `${time}PM`;
  } else {
    return `${(time -= 12)}PM`;
  }
}

//Changes colors based on the time 
function colorchange() {
  for (let i = 9; i <= 17; i++) {
    $(`#hour-${i}`).removeClass("past");
    $(`#hour-${i}`).removeClass("present");
    $(`#hour-${i}`).removeClass("future");

    if (i < currentTime) {
      $(`#hour-${i}`).addClass("past");
    } else if (i == currentTime) {
      $(`#hour-${i}`).addClass("present");
    } else {
      $(`#hour-${i}`).addClass("future");
    }
  }
}


//loading localStorage  
function loadSave() {
  var storedData = localStorage.getItem("save");
  var retrievedArray = JSON.parse(storedData);
  if (retrievedArray != null) {
    //loop thorugh and fill out text area with the note property of the array retrieved from local storage
    for (let i = 0; i < retrievedArray.length; i++) {
      $(`#${retrievedArray[i].index}`).children("textarea").text(retrievedArray[i].note);
    }
  }
}
