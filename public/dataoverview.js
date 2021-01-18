// Declare the Graph Variables outside the function. This is so they can be checked  and the data cleared if needed.
let userOneChart, userTwoChart, userThreeChart, userFourChart;

async function loadData() {
  const search = {};

  search.date = document.getElementById("date").value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(search),
  };

  const response = await fetch("/find", options);
  const data = await response.json();

  // puts the parsed data into arrays the graph can read
  let userZeroData = parseData(data[0]);
  let userOneData = parseData(data[1]);
  let userTwoData = parseData(data[2]);
  let userThreeData = parseData(data[3]);

  let labels = parseLabels(data[0]);

  //  pass each to the load graph function.
  loadGraph("userOneChart", userZeroData, labels, userOneChart);
  loadGraph("userTwoChart", userOneData, labels, userTwoChart);
  loadGraph("userThreeChart", userTwoData, labels, userThreeChart);
  loadGraph("userFourChart", userThreeData, labels, userFourChart);
}

function setDate() {
  let now = new Date();
  let months = now.getMonth() + 1;
  let day = now.getDate();
  let year = now.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (months < 10) {
    months = "0" + months;
  }

  // final string formatting. this formatting matches how the HTML date input date displays.

  document.getElementById("date").value = `${year}-${months}-${day}`;
  return;
}

function parseData(obj) {
  let output = [];
  output.push(obj.user);
  output.push(obj.proofs);
  output.push(obj.reproofs);
  output.push(obj.multipage);
  output.push(obj.multipageReproof);
  output.push(obj.visuals);
  output.push(obj.visualReproof);
  output.push(obj.preapproved);
  output.push(obj.approvals);
  output.push(obj.outputs);
  output.push(obj.other);
  return output;
}

function parseLabels() {
  let output = [];
  output.push("user");
  output.push("proofs");
  output.push("reproofs");
  output.push("multipage");
  output.push("multipageReproof");
  output.push("visuals");
  output.push("visualReproof");
  output.push("preapproved");
  output.push("approvals");
  output.push("outputs");
  output.push("other");
  return output;
}

function loadGraph(element, data, labels, chart) {
  var ctx = document.getElementById(element).getContext("2d");

  let mainLabels = [];
  mainLabels.push(data[0]);

  let graphData = [];
  let graphLabels = [];

  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
      continue;
    } else {
      graphData.push(data[i]);
      graphLabels.push(labels[i]);
    }
  }

  let graphFillColours = getFullColourArray(data, "RGBA(236,122,142,1)");
  let graphOutlineColours = getFullColourArray(data, "RGBA(255,99,132,.9)");

  if (chart != undefined) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: graphLabels,
      datasets: [
        {
          label: mainLabels,
          data: graphData,
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

  let finalTotals = [];
  let finalLabels = [];

  for (let i = 0; i < matchedEntries.length; i++) {
    let total = 0;
    for (const key in matchedEntries[i]) {
      if (key == "date") {
        finalLabels.push(matchedEntries[i][key]);
      } else if (
        key == "proofs" ||
        key == "reproofs" ||
        key == "visuals" ||
        key == "visualReproof" ||
        key == "multipage" ||
        key == "multipageReproof"
      ) {
        let temp = parseInt(matchedEntries[i][key]);
        total += temp;
      }
    }
    finalTotals.push(total);
    total = 0;
  }



  let uniqueDates = [];

  for (let i = 0; i < finalLabels.length; i++) {
    if (!isInArray(uniqueDates, finalLabels[i])) {
      //if it isn't in the array, add it.
      uniqueDates.push(finalLabels[i]);
    }
  }

  let finalData = [];

  for (let i = 0; i < finalLabels.length; i++) {
    // get the index of the corresponding date in the unique dates array
    let tempIndex = uniqueDates.indexOf(finalLabels[i]);
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

  // Render Graph

  var ctx = document.getElementById("monthView").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueDates,
      datasets: [
        {
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

setDate();
