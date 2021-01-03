console.log("listening");

const output = {};

// fill this Object with all the holidays for the next year and it will also take those into account when processing the despatch date.

const holidays = {
    xmascutoff: '22/12',
    boxingDay: '24/12',
    christmas: '25/12',
    christmasBreak: '28/12',
    christmasBreak2: '29/12',
    christmasBreak3: '30/12',
    christmasBreak5: '31/12',
    newYearsDay: '1/1',
    
}

// these update the dispatch dates. put the number of days as the argument
document.getElementById('fiveDays').innerHTML = getCurrentDateDDMM(5)
document.getElementById('sevenDays').innerHTML = getCurrentDateDDMM(7)
document.getElementById('tenDays').innerHTML = getCurrentDateDDMM(10)


// element is the dom reference and modifier is wether the button is plus or minus
function logWorkDone(element, modifier) {
  let docRef = document.getElementById(element);
  // get current value
  let currentValue = parseInt(docRef.textContent);
  // update the DOM with the new value
  if (modifier == "+") {
    docRef.innerText = currentValue + 1;
    output[element] = currentValue + 1;
  } else if (modifier == "-") {
    // Error check for negative Numbers
    if (currentValue <= 0) {
      console.log("error: Negative Number Entered");
      return;
    }
    // update the DOM
    docRef.innerText = currentValue - 1;
    // Update to output object
    output[element] = currentValue - 1;
  } else {
    // Error Handling if the modifier is missing
    console.log("error");
    return;
  }
  console.log(output);
}

// Process and submit the
function submit() {
  let docRef = document.getElementById("user");

  if (docRef.value == "Select User") {
    console.log("error: No Name Selected");
    alert("Please Select Name and Submit Again");
    return;
  }

  // TODO ADD A POST TO THE DATABASE.
}

// This function abstracts away processing the current dispatch date. It takes one argument, a number of working days for dispatch. No need to account for weekends or holidays, this function takes those into account and returns the correct dispatch date.
function getCurrentDateDDMM(days) {
  let outputDate = new Date();
  let outputString = "";
  let day, month;

  for (let i = 0; i < days; i++) {
    outputDate.setDate(outputDate.getDate() + 1);
    // This calls the getDay() method to check if it's the weekend. if it is it reduces  the counter so it accounts for the extra days. this helps abstract away the  input days.
    if (outputDate.getDay() == 0 || outputDate.getDay() == 6) {
      i--;
    }

    day = outputDate.getDate();
    month = outputDate.getMonth() + 1;

    outputString = day + "/" + month;

    // this compares the day to the days shown in the holidays Object if a holiday is found it pushes the date forward one day.
    for (const holidayDates in holidays) {
      if (holidays[holidayDates] == outputString) {
        console.log("holidayMatch");
        i--;
      }
    }
  }

  day = outputDate.getDate();
  month = outputDate.getMonth() + 1;

  return day + "/" + month;
}
