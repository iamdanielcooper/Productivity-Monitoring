console.log("linked");

//const Chart = require('chart.js')

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

  console.log(data);
  console.log(Object.values(data[0]))

  let recived = Object.values(data[0])
  let graphData = []

  for (let i = 0; i < recived.length; i++) {
    if(recived[i] != NaN || recived[i] != undefined) {
      graphData.push(recived[i])
    }    
  }

  // load graph
  var ctx = document.getElementById("myChart");

  var stars = graphData
  var frameworks = Object.keys(data[0]);

  var myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: frameworks,
      datasets: [
        {
          label: "Github Stars",
          data: stars,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
}


function parseProofData(inputArr) {
  for (let i = 0; i < inputArr.length; i++) {
    inputArr[i]
  }
}