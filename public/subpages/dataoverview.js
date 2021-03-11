var chart

//* Main Function *//

async function loadMonthData() {
 
  let selectedMonth = document.getElementById("selectMonth").value;

  search = {};

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(search),
  };

  const response = await fetch("/reg", options);
  const data = await response.json();

  let monthRegexString = `\\d+-${selectedMonth}-\\d+`;

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

  //* Get the value of the selected and switch the the correct array
  let viewSelected = document.getElementById('viewSelect').value

  let arrayCheck

  switch (viewSelected) {
    case "totalProofsAndReproofs":
      arrayCheck = ['proofs', 'reproofs', 'multipage', 'multipageReproof', 'visuals', 'visualReproof']
      break;
    case "proofsV1":
      arrayCheck = ['proofs','multipage']
      break;
    case "visualsV1":
      arrayCheck = ['visuals']
      break;
    case "reproofs":
      arrayCheck = ['reproofs', 'multipageReproof', 'visualReproof']
      break;
      case "preApproved":
        arrayCheck = ['preapproved']
      break;
      case "outputs":
        arrayCheck = ['outputs']
      break;
  
    default:
        console.log('Err: Not View Select not defined.')
      break;
  }


  let finalTotals = [];
  let tempLabels = [];

  // Check every entry that matched.
  for (let i = 0; i < matchedEntries.length; i++) {
    let total = 0;
    for (const key in matchedEntries[i]) { // loop for through the objects to see all the keys.
      if (key == "date") { // push all the dates into the tempLabels array, this gets refined later.
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
  let graphAverageColour = getFullColourArray(finalData, "RGBA(69, 140, 255,1)")


  // calculate the average 

  let averageArray = []
  let averageTotal = 0

  // length - 1 because i don't want to include the data that's being collected in the average count.
  for (let i = 0; i < finalData.length - 1; i++) {
    averageTotal += finalData[i]
  }

  let average = averageTotal / (finalData.length - 1)

  for (let i = 0; i < finalData.length; i++) {
    averageArray.push(average)
  }

  //* Render Graph

  var ctx = document.getElementById("monthView").getContext("2d");

  if (chart != undefined) {
    chart.destroy()
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
          type: 'line',
          fill: false,
          borderWidth: 2,
       
        }, {
          label: "Proofs",
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
  let objectRef = document.getElementById('loadGraphButton')

  if (objectRef.hidden == true && document.getElementById('selectMonth').value != "" && document.getElementById('viewSelect').value != "") {
    objectRef.hidden = false
  }
  return
}

// Event Listeners to load the graph load button once both elements are selected.
document.getElementById('selectMonth').addEventListener('change', turnOnButton)
document.getElementById('viewSelect').addEventListener('change', turnOnButton)