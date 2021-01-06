async function getData() {
  const search = {};

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

  let danData, bexData, benData, ollieData

  // Parse the data by name
  for (let i = 0; i < data.length; i++) {
    
      switch (data[i].user) {
        case "Dan":
          danData = processUserData(data[i], i)
          break;
        case "Ben":
          benData = processUserData(data[i], i)
          break;
        case "Ollie":
          ollieData = processUserData(data[i], i)
          break;
        case "Bex":
          bexData = processUserData(data[i], i)
          break;

        default:
          break;
      }
  }

  // load graph
  var ctx = document.getElementById("myChart");


  var frameworks = Object.keys(data[0]);

  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: frameworks,
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
          ],
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }
        ]}
    },
  });
}

function processUserData(data, index) {
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

setDefaultDate()