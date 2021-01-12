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
  var myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: totalsArrLab,
      datasets: [
        {
          label: "# of Votes",
          data: totalsArr,
          backgroundColor: [
            "rgba(255, 99, 132, .9)",
            "rgba(54, 162, 235, .9)",
            "rgba(255, 206, 86, .9)",
            "rgba(75, 192, 192, .9)",
            "rgba(153, 102, 255, .9)",
            "rgba(255, 159, 64, .9)",
            "rgba(30, 120, 50, .9)",
            "rgba(25, 200, 64, .9)",
          ],
          borderColor: [
            "rgba(255, 99, 132, .9)",
            "rgba(54, 162, 235, .9)",
            "rgba(255, 206, 86, .9)",
            "rgba(75, 192, 192, .9)",
            "rgba(153, 102, 255, .9)",
            "rgba(255, 159, 64, .9)",
            "rgba(30, 120, 50, .9)",
            "rgba(25, 200, 64, .9)",
          ],
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
        gridLines: {
          display: false,
        },
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
