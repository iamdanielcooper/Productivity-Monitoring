var output = {
  proofs: 0,
  reproofs: 0,
  multipage: 0,
  multipageReproof: 0,
  visuals: 0,
  visualReproof: 0,
  approvals: 0,
  preapproved: 0,
  outputs: 0,
  other: 0,
};



// fill this Object with all the holidays for the next year and it will also take those into account when processing the despatch date.

const holidays = {
  xmascutoff: "22/12",
  boxingDay: "24/12",
  christmas: "25/12",
  christmasBreak: "28/12",
  christmasBreak2: "29/12",
  christmasBreak3: "30/12",
  christmasBreak5: "31/12",
  newYearsDay: "1/1",
};

// these update the dispatch dates. put the number of days as the argument
document.getElementById("fiveDays").innerHTML = getCurrentDateDDMM(5);
document.getElementById("sevenDays").innerHTML = getCurrentDateDDMM(7);
document.getElementById("tenDays").innerHTML = getCurrentDateDDMM(10);

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
  } else {
    //  Add user to the output object
    output.user = docRef.value
  }
  // add date to the object
let now = new Date()
let months = now.getMonth() + 1
let day = now.getDate()
let year = now.getFullYear()

if (day < 10) {
  day = '0' + day
}
if (months < 10) {
  months = '0' + months
}

// final string formatting. this formatting matches how the HTML date input date displays.
output.date = `${year}-${months}-${day}`

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:  JSON.stringify(output)
  };

  // 
  console.log(JSON.stringify(output))
  fetch("/api", options);
  console.log("Success");

  addTimestamp('submitTimestamp')
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

async function getLoggedData() {
  // this object is declared and passed to the server to search the database
  const search = {};

  if (document.getElementById("dataPullSelect").value == '') {
    console.log('Error, No Data Requested')
    return
  }

  // the date used for this is always the current date.
  search.user = document.getElementById("dataPullSelect").value;
  search.date = getDate();

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(search),
  };

  //get the data from the server based on the search criteria.
  const response = await fetch("/find", options);
  const data = await response.json();
  const parsedData = data[0]

  if (parsedData == undefined) {
    console.log('Err: No Data Found')
    return
  }

  //update the DOM with the data from the database
  document.getElementById('proofs').innerText = parsedData.proofs
  document.getElementById('reproofs').innerText = parsedData.reproofs
  document.getElementById('multipage').innerText = parsedData.multipage
  document.getElementById('multipageReproof').innerText = parsedData.multipageReproof
  document.getElementById('visuals').innerText = parsedData.visuals
  document.getElementById('visualReproof').innerText = parsedData.visualReproof
  document.getElementById('outputs').innerText = parsedData.outputs
  document.getElementById('other').innerText = parsedData.other
  document.getElementById('approvals').innerText = parsedData.approvals
  document.getElementById('preapproved').innerText = parsedData.preapproved

  
  
  //update the output object to match the pased Dada, without this any unchanged values revert to zero when submitted.
  output = parsedData
  console.log(parsedData)

  // Update the User Select to the user chosen to pull the data from.
  document.getElementById('user').value = parsedData.user
  user
  //Start pushing the data to the server
  startLoadLogging()
}

function getDate() {
  let now = new Date()
  let months = now.getMonth() + 1
  let day = now.getDate()
  let year = now.getFullYear()

  if (day < 10) {
    day = '0' + day
  }
  if (months < 10) {
    months = '0' + months
  }

  // final string formatting. this formatting matches how the HTML date input date displays.
  return `${year}-${months}-${day}`
}

function hideDataPullOnceUSed() {
  document.getElementById('dataPullSelect').disabled = true
  console.log('hidden')
}


function startLoadLogging() {
  console.log('data now live')
  var myVar
  myvar = setInterval(submit, 900000) // this updates the data 
}

function addTimestamp(element) {
  let time = new Date()
  let hour = time.getHours()
  let  mins = time.getMinutes()
  if (mins < 10) {
    mins = `0${mins}`
  }
  if (hour < 10) {
    hour = `0${hour}`
  }

  document.getElementById(element).innerHTML = `last submit ${hour}:${mins}`
}
