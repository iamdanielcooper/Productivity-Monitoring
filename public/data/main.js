async function getData() {

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

  var numOfDatasets = 0

  // Parse the data by name
  for (let i = 0; i < data.length; i++) {
    
      switch (data[i].user) {
        case "Dan":
          var danData = processUserData(data[i])
          numOfDatasets++
          break;
        case "Ben":
          var benData = processUserData(data[i])
          numOfDatasets++
          break;
        case "Ollie":
          var ollieData = processUserData(data[i])
          numOfDatasets++
          break;
        case "Bex":
          var bexData = processUserData(data[i])
          numOfDatasets++
          break;

        default:
          break;
      }
  }

  // load graph
  var ctx = document.getElementById("myChart");


  var mainLabels = Object.keys(data[0]);
  //update the labels to remove the date, user and id elements
  let finalLabels = mainLabels.splice(0, 8)

  //get averages by passing all the datasets to the funtion
  if (numOfDatasets >= 3) {
    var averages = processAverageCounts(danData, benData, bexData, ollieData)
  } else {
    var averages = []
  }
  


  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: finalLabels,
      datasets: [
        {
          label: "Dan",
          data: danData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
        }, {
          label: "Bex",
          data: bexData,
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
        },
        {
          label: "Ben",
          data: benData,
          backgroundColor: [
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
            "rgba(54, 162, 0, 0.2)",
          ],
        },
        {
          label: "Ollie",
          data: ollieData,
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
        },
        {
          label: "Average",
          data: averages,
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          type: 'line'
        },
      ],
    },
    options: {
      legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontSize: 20
          }
          
      },
      responsive: false,
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                
                min: 0,
                stepSize: 1

            }
        }
        ]}
    },
  });
}

//* Helper Functions

// Returns the data in a uniform array that the graph can read.
function processUserData(data) {
  let regexTest = /\D/g
  let output = []
  
  for (const key in data) {
    // this checks if the property is an integer by comparing it's type to the value of it parsed as an int.
    if (data[key] === parseInt(data[key])) {
      output.push(data[key])
  } 
  }
  console.log(output)

return output
}

// Gives the date selector todays date as default.
function setDefaultDate() {
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
document.getElementById('date').defaultValue = `${year}-${months}-${day}`
}

function processAverageCounts(arr1, arr2, arr3, arr4) {
  output = []
  for (let i = 0; i < arr1.length; i++) {
    output.push((arr1[i] + arr2[i] + arr3[i] + arr4[i]) / 4)
  }
  console.log(output)
  return output
}

setDefaultDate()

function refreshPage() {
  location.reload()
}

function startLoadLogging() {
  console.log('data now live')
  var myVar
  myvar = setInterval(refreshPage, 10000) 
  
  getData()// this updates the data 
}

startLoadLogging()