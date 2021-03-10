  // Declare the chart  before it's used so It can be destroyed if it already has data in it. This stops the glitch where phantom graphs appear on hover.
var myChart

async function main() {
  // this object is declared and passed to the server to search the database
  const search = {};

  // IF a user has been specified it adds them to the search queery. If not it just adds the date.
  if (document.getElementById("users").value != "") {
    search.user = document.getElementById("users").value;
  }
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

  var totals = {
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

  // this parses the data from all entries into one object.
  for (let i = 0; i < data.length; i++) {
    for (const key in data[i]) {
      if (key == "user" || key == "date" || key == "_id") {
        continue;
      } else {
        totals[key] += data[i][key];
      }
    }
  }

  //* This parses the label names.
  totalsArr = [];
  totalsArrLab = [];

  for (const key in totals) {
    totalsArr.push(totals[key]);
    totalsArrLab.push(key);
  }

  for (let i = 0; i < totalsArrLab.length; i++) {
    totalsArrLab[i] = totalsArrLab[i].toUpperCase();
  }

  //*  Loads graph into the GUI

  var ctx = document.getElementById("myChart").getContext("2d");

  if (myChart != undefined) {
    myChart.destroy()
  }

  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: totalsArrLab,
      datasets: [
        {
          label: "# of Votes",
          data: totalsArr,
          backgroundColor: [
            RGBAConvert(236, 122, 142, 100),
            RGBAConvert(240, 149, 165, 100),
            RGBAConvert(244, 175, 187, 100),
            RGBAConvert(247, 202, 210, 100),
            RGBAConvert(153, 121, 245, 100),
            RGBAConvert(173, 148, 247, 100),
            RGBAConvert(246, 209, 119, 100),
            RGBAConvert(120, 193, 194, 100),
            RGBAConvert(127, 180, 126, 100),
            RGBAConvert(240, 169, 98, 100),
          ],
          borderColor: [
            RGBAConvert(255, 99, 132, 90),
            RGBAConvert(255, 99, 132, 90),
            RGBAConvert(255, 99, 132, 90),
            RGBAConvert(255, 99, 132, 90),
            RGBAConvert(111, 65, 241, 90),
            RGBAConvert(111, 65, 241, 90),
            RGBAConvert(241, 182, 40, 90),
            RGBAConvert(63, 139, 141, 90),
            RGBAConvert(76, 129, 75, 90),
            RGBAConvert(214, 117, 20, 90),
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      cutoutPercentage: 50,
      legend: {
        position: "bottom",
      },
      scales: {
        
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawTicks: false
            },
          },
        ],
      },
    },
  });
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

// This Takes four Arguments, Red Green Blue and opacity (0-100) and returns an  RGBA string for the graph colours
function RGBAConvert(red, green, blue, opacity) {
  return `RGBA(${red},${green},${blue},${opacity / 100})`;
}

setDate();
