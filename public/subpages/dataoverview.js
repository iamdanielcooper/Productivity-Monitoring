var chart;
var data = []; // make the data global so all functions can accsess
var arrayCheck = []

//* Main Function *//

async function loadGraph() {
  let selectedMonth = document.getElementById("months").value;
  let selectedYear = document.getElementById("years").value;

  // Process the data and find the entries that match the values sellected.
  let monthRegexString = `${selectedYear}-${selectedMonth}-\\d+`;
  var monthRegex = new RegExp(monthRegexString);
  let matchedEntries = [];
  // create an array of  entries that match the selected month
  for (let i = 0; i < data.length; i++) {
    if (monthRegex.test(data[i].date)) {
      matchedEntries.push(data[i]);
    }
  }
  if (matchedEntries == []) {
    console.log("Err: No data Found");
    return;
  }

  let finalTotals = [];
  let tempLabels = [];

  // Check every entry that matched.
  for (let i = 0; i < matchedEntries.length; i++) {
    let total = 0;
    for (const key in matchedEntries[i]) {
      // loop for through the objects to see all the keys.
      if (key == "date") {
        // push all the dates into the tempLabels array, this gets refined later.
        tempLabels.push(matchedEntries[i][key]);
      } else if (isInArray(arrayCheck, key)) {
        let temp = parseInt(matchedEntries[i][key]); // parse the entry into a number.
        total += temp; // add the number to the temp, this needs to be done if we're counting more then one thing.
      }
    }
    finalTotals.push(total);
    total = 0;
  }

  let uniqueDates = [];

  for (let i = 0; i < tempLabels.length; i++) {
    if (!isInArray(uniqueDates, tempLabels[i])) {
      //if it isn't in the array, add it.
      uniqueDates.push(tempLabels[i]);
    }
  }

  let finalData = [];

  for (let i = 0; i < tempLabels.length; i++) {
    // get the index of the corresponding date in the unique dates array
    let tempIndex = uniqueDates.indexOf(tempLabels[i]);
    // say if that value in the finalData array is undefined addd it to the index found above.
    if (finalData[tempIndex] == undefined) {
      finalData[tempIndex] = finalTotals[i];
    } else {
      finalData[tempIndex] += finalTotals[i];
    }
  }

  let graphFillColours = getFullColourArray(finalData, "RGBA(236,122,142,1)");
  let graphOutlineColours = getFullColourArray(
    finalData,
    "RGBA(255,99,132,.9)"
  );
  let graphAverageColour = getFullColourArray(
    finalData,
    "RGBA(69, 140, 255,1)"
  );

  // calculate the average

  let averageArray = [];
  let averageTotal = 0;

  // length - 1 because i don't want to include the data that's being collected in the average count.
  for (let i = 0; i < finalData.length - 1; i++) {
    averageTotal += finalData[i];
  }

  let average = averageTotal / (finalData.length - 1);

  for (let i = 0; i < finalData.length; i++) {
    averageArray.push(average);
  }

  //* Render Graph

  var ctx = document.getElementById("monthView").getContext("2d");

  if (chart != undefined) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueDates,
      datasets: [
        {
          label: "average",
          data: averageArray,
          backgroundColor: graphAverageColour,
          borderColor: graphAverageColour,
          type: "line",
          fill: false,
          borderWidth: 2,
        },
        {
          label: "Total",
          data: finalData,
          backgroundColor: graphFillColours,
          borderColor: graphOutlineColours,
          borderWidth: 2,
        },
      ],
    },
    options: {
      cutoutPercentage: 50,
      legend: {
        position: "right",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              display: true,
            },
            gridLines: {
              display: true,
              drawTicks: false,
            },
          },
        ],
      },
    },
  });
}

//* Supporting Functions *//

function isInArray(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      return true;
    }
  }
  return false;
}

// Pass the array and the colour you want. It will make an array of colours long enough for the full arrays
function getFullColourArray(arr, colour) {
  let output = [];

  for (let i = 0; i < arr.length; i++) {
    output.push(colour);
  }
  return output;
}

function turnOnButton() {
  let objectRef = document.getElementById("loadGraphButton");

  if (
    objectRef.hidden == true &&
    document.getElementById("selectMonth").value != "" &&
    document.getElementById("viewSelect").value != ""
  ) {
    objectRef.hidden = false;
  }
  return;
}

function getMonthsAndYears(data) {
  let dates = [];

  // For every object in the input array, push the dates into their own array
  data.forEach((element) => {
    dates.push(element.date);
  });

  // Split up the array
  for (let i = 0; i < dates.length; i++) {
    dates[i] = dates[i].split("-");
  }

  let months = [];
  let years = [];

  // For each date, if it's the date isnt already in the array push it into the array.
  for (let i = 0; i < dates.length; i++) {
    if (months.indexOf(dates[i][1]) == -1) {
      months.push(dates[i][1]);
    }
  }

  for (let i = 0; i < dates.length; i++) {
    if (years.indexOf(dates[i][0]) == -1) {
      years.push(dates[i][0]);
    }
  }

  // create an output obect so we can pass it back
  let output = {
    months: months,
    years: years,
  };

  return output;
}

async function loadMonthData() {

  
  // Get all the data from the database
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  };

  const response = await fetch("/reg", options);
  data = await response.json();
  
/*
  data = [
    {
      proofs: "20",
      approvals: "10",
      outputs: "12",
      user: "Dan",
      date: "2021-03-16",
    },
    {
      proofs: "10",
      approvals: "15",
      outputs: "5",
      user: "Ollie",
      date: "2020-12-17",
    },
    {
      proofs: "25",
      approvals: "15",
      outputs: "0",
      Test: '3',
      user: "Bex",
      date: "2021-03-17",
    },
    {
      proofs: "11",
      approvals: "2",
      outputs: "3",
      user: "Ben",
      date: "2021-03-18",
    },
    {
      proofs: "26",
      approvals: "9",
      outputs: "20",
      user: "Dan",
      date: "1997-02-18",
    },
  ];
*/
  const uniqueMonthsAndYears = getMonthsAndYears(data);

  const monthsForDisplay = uniqueMonthsAndYears.months.sort((a, b) => a - b);
  const yearsForDisplay = uniqueMonthsAndYears.years.sort((a, b) => a - b);

  // put the month and years into the DOM.

  createDropdowns(monthsForDisplay, "months");
  createDropdowns(yearsForDisplay, "years");
  CreateCheckboxes(data)

  document.getElementById("months").addEventListener("change", (e) => {
    loadGraph();
  });
  
  document.getElementById("years").addEventListener("change", (e) => {
    loadGraph();
  });
  
  document.querySelectorAll('input').forEach(item => {
    item.addEventListener('click', event => {
      addToViewSelect(event.target.id)
    })
  })
  
}

function addToViewSelect(item) {
  // If it's not in the list add it.
  if (arrayCheck.indexOf(item) == -1) {
      arrayCheck.push(item)
  } else {
    // if it is remove it.
    let index = arrayCheck.indexOf(item)
    arrayCheck.splice(index, 1)
  }
  console.log(arrayCheck)
  loadGraph()
}

function CreateCheckboxes(arrOfObj) {
  // First make an array of unique keys
  let uniqueKeys = [];
  for (let i = 0; i < arrOfObj.length; i++) {
    // for each object
    for (const key in arrOfObj[i]) {
      // The second part of this if checks if the entry is a number, but also catches an error that can happen when parsing the date.
      if (
        uniqueKeys.indexOf(key) == -1 &&
        arrOfObj[i][key] == parseInt(arrOfObj[i][key])
      ) {
        uniqueKeys.push(key);
      }
    }
  }
  console.log(uniqueKeys);

  //======= making the checkBoxes

  for (let i = 0; i < uniqueKeys.length; i++) {
    let tempDropdownLabel = document.createElement('label')
    let tempDropdown = document.createElement('input')
    tempDropdown.type = 'checkbox'
    tempDropdown.id = uniqueKeys[i]
    tempDropdownLabel.id = uniqueKeys[i]
    tempDropdown.value = uniqueKeys[i]
    tempDropdownLabel.innerText = uniqueKeys[i]

    document.getElementById('main').appendChild(tempDropdownLabel)
    document.getElementById('main').appendChild(tempDropdown)
  } 

}

function createDropdowns(dataArray, name) {
  const docRef = document.getElementById("main");
  let select = document.createElement("select");
  select.id = name;

  // This creates the first element in the dropdown
  let placeholder = `Select ${name}`;
  let option = document.createElement("option");
  option.value = "";
  option.innerText = placeholder;
  option.selected = true;
  option.disabled = true;
  select.appendChild(option);

  // This creates the  options for each element in the array.
  dataArray.forEach((element) => {
    console.log(element);
    let option = document.createElement("option");
    option.value = element;
    option.innerText = element;
    select.appendChild(option);
  });
  docRef.appendChild(select); // add the dropdown to the DOM
}

// First it loads in the data and makes the dropdowns
loadMonthData();




