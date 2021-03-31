const objectItems = [
  'proofs',
  'reproofs',
  'multipage',
  'multipageReproof',
  'visuals',
  'visualReproof',
  'approvals',
  'preapproved',
  'outputs',
  'other', 
  'breakdownIssues',
  'multipagePages'
]

const holidays = {
  goodFriday: "2/4",
  easterMonday: "5/4",
  mayBankHoliday: "3/5",
  springBankHoliday: "31/5",
  summerBankHoliday: "30/8",
  christmasDay: "25/12",
  boxingDay: "28/12"
};

var output = {}; // initalise an empty object

function main() {
  for (let i = 0; i < objectItems.length; i++) {
    output[objectItems[i]] = 0 // add the element to the object and set the value to zero
    createHTMLObject(objectItems[i]) // make and add the element to the DOM
  }
}

function createHTMLObject(objectItemName) {

  // Create container Object
  let htmlElement = document.createElement('div')
  htmlElement.id = objectItemName
  htmlElement.className = 'buttons'

  let minusButton = document.createElement('div')
  minusButton.className = 'button minus'
  htmlElement.appendChild(minusButton)

  let plusButton = document.createElement('div')
  plusButton.className = 'button plus'
  htmlElement.appendChild(plusButton)

  let itemCount = document.createElement('h3')
  itemCount.className = 'itemCount'
  itemCount.innerText = 0
  htmlElement.appendChild(itemCount)

  let timeStamp = document.createElement('p')
  timeStamp.className = 'timeStamp'
  timeStamp.innerText = '00:00'
  htmlElement.appendChild(timeStamp)

  let label = document.createElement('h2')
  label.className = 'buttonLabels'
  label.innerText = displayName(objectItemName)
  htmlElement.appendChild(label)

  document.getElementById('main').appendChild(htmlElement)

}

function displayName(name) {

  let nameArray = name.split('')

  for (let i = 0; i < nameArray.length; i++) {

    if (i == 0) {
      nameArray[i] = nameArray[i].toUpperCase() // make the first letter capital
    } else if (nameArray[i] == nameArray[i].toUpperCase()) {
      // If it finds a capital splice in a space
      nameArray.splice(i, 1, ` ${nameArray[i].toUpperCase()}`)
    }
  }

  // Put the string back together
  let displayName = nameArray.join()
  displayName = displayName.replace(/,/g, '')
  return displayName
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
    output.date = getDate()
  }

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

  document.getElementById('submitTimestamp').innerText = `Last Submit: ${addTimestamp()}` 
  
}

function getCurrentDateDDMM(days) {

  // This function abstracts away processing the current dispatch date. It takes one argument, a number of working days for dispatch. No need to account for weekends or holidays, this function takes those into account and returns the correct dispatch date.

  let outputDate = new Date();
  let outputString = "";
  let day, month;

  for (let i = 0; i < days; i++) {
    outputDate.setDate(outputDate.getDate() + 1);
    // This calls the getDay() method to check if it's the weekend. if it is it reduces the counter so it accounts for the extra days. this helps abstract away the  input days.
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

  for (const key in parsedData) {
   
    if (document.getElementById(key) == null) {
      // If the element doesn't exist on the page, like date or ID
      continue
    } else if (document.getElementById(key).querySelector('.itemCount') != null) {
      // If the key has a item count, update it
      document.getElementById(key).querySelector('.itemCount').innerText = parsedData[key]
    }
    
  }
 
  //update the output object to match the passed Dada, without this any unchanged values revert to zero when submitted.
  output = parsedData
 
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

  //  turns 1-1-2021 to 01-01-2021 -  this is formats it properly for the database
  day = (day < 10) ? `0${day}` : day
  months = (months < 10) ? `0${months}` : months

  // final string formatting. this formatting matches how the HTML date input date displays.
  return `${year}-${months}-${day}`
}

function hideDataPullOnceUsed() {
  document.getElementById('dataPullSelect').disabled = true
  console.log('hidden')
}

function startLoadLogging() {
  console.log('data now live')
  var myVar
  myvar = setInterval(submit, minutesToMilliseconds(45)) // this updates the data at certain time intervals
}

function minutesToMilliseconds(input) {
  return input * 6000
}

function addTimestamp() {
  let time = new Date()

  // Get the hours & minutes
  let hours = time.getHours()
  let minutes = time.getMinutes()

  // This turns 9:9 to 09:09
  minutes = (minutes < 10) ? `0${minutes}` : minutes
  hours = (hours < 10) ? `0${hours}` : hours

  return `${hours}:${minutes}`
}



main()

document.querySelectorAll('.button').forEach(item => {
  item.addEventListener('click', event => {
    
    let IDofCaller = event.target.parentNode.id // The ID of the parent is the name of what needs to be updated in the output object
    let docRef = document.getElementById(IDofCaller)

    output[IDofCaller] = (event.target.className == 'button plus') ? output[IDofCaller] + 1 : output[IDofCaller] - 1



    if ((IDofCaller == 'multipage' || IDofCaller == 'multipageReproof') && event.target.className == 'button plus') {
      let pageCount = prompt('How many pages was your proof?') // Get value from user.
      if (pageCount == null) {
        return
      }
      pageCount = (pageCount == '') ? 1 : pageCount // If they don't enter anything leave it as one.
      output.multipagePages += parseInt(pageCount) // Update the Output object
      document.getElementById('multipagePages').querySelector('.itemCount').innerText = output.multipagePages // Update the DOM

    } else if ((IDofCaller == 'multipage' || IDofCaller == 'multipageReproof') && event.target.className == 'button minus') {
      let pageCount = prompt('How many pages would you like to remove?')
      if (pageCount == null) {
        return
      }
      pageCount = (pageCount == '') ? 1 : pageCount
      output.multipagePages -= parseInt(pageCount)
      document.getElementById('multipagePages').querySelector('.itemCount').innerText = output.multipagePages
    }




    if (output[IDofCaller] < 0) {
      console.log('Err: Negative number entered')
      return
    }

    docRef.querySelector('.itemCount').innerText = output[IDofCaller]
    docRef.querySelector('.timeStamp').innerText = addTimestamp()
  })
})

// these update the dispatch dates. put the number of days as the argument
document.getElementById("fiveDays").innerHTML = `5 Days: ${getCurrentDateDDMM(5)}`;
document.getElementById("sevenDays").innerHTML = `7 Days: ${getCurrentDateDDMM(7)}`;
document.getElementById("tenDays").innerHTML = `10 Days: ${getCurrentDateDDMM(10)}`;

// Open and close side menu
document.getElementById('menuOpenClose').addEventListener('click', (e) => {
  let docRef = document.getElementById('menu')

  if (docRef.style.left == '0px') {
    docRef.style.left = '-250px'
    document.getElementById('menuOpenClose').querySelector('p').innerText = '>'
  } else {
    docRef.style.left = '0px'
    document.getElementById('menuOpenClose').querySelector('p').innerText = '<'
  }
})

document.getElementById('dataPullSelect').addEventListener('change', (e) => {
  getLoggedData()
  document.getElementById('dataPullSelect').hidden = true
})

document.getElementById('loadPreviousData').addEventListener('click', (e) => {
  if (document.getElementById('dataPullSelect').hidden == true) {
    console.log('hidden')
    document.getElementById('dataPullSelect').removeAttribute('hidden')
  }
})

// Add notes to the notes Panel
document.getElementById('addNote').addEventListener('click', (e) => {
  if (output.notes == undefined) {
    output.notes = prompt('Add Note:')
  } else {
    output.notes += ' ' + prompt('Add Node:')
  }
  document.getElementById('userNotes').innerText = output.notes
})