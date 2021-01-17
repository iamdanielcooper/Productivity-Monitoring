// Declare the Graph Variables outside the function. This is so they can be checked  and the data cleared if needed.
let userOneChart, userTwoChart, userThreeChart, userFourChart

async function loadData() {
    const search = {};

    // IF a user has been specified it adds them to the search queery. If not it just adds the date.
    /*if (document.getElementById("users").value != "") {
      search.user = document.getElementById("users").value;
    } */
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
  
    
    let userZeroData = parseData(data[0])
    let userOneData = parseData(data[1])
    let userTwoData = parseData(data[2])
    let userThreeData = parseData(data[3])

    let labels = parseLabels(data[0])
    console.log(labels)

    console.log(userZeroData, userOneData, userTwoData, userThreeData)

    loadGraph("userOneChart", userZeroData, labels, userOneChart)
    loadGraph("userTwoChart", userOneData, labels, userTwoChart)
    loadGraph("userThreeChart", userTwoData, labels, userThreeChart)
    loadGraph("userFourChart", userThreeData, labels, userFourChart)

   

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
    let output = []
    output.push(obj.user)
    output.push(obj.proofs)
    output.push(obj.reproofs)
    output.push(obj.multipage)
    output.push(obj.multipageReproof)
    output.push(obj.visuals)
    output.push(obj.visualReproof)
    output.push(obj.preapproved)
    output.push(obj.approvals)
    output.push(obj.outputs)
    output.push(obj.other)
    return output
}

function parseLabels() {
    let output = []
    output.push('user')
    output.push('proofs')
    output.push('reproofs')
    output.push('multipage')
    output.push('multipageReproof')
    output.push('visuals')
    output.push('visualReproof')
    output.push('preapproved')
    output.push('approvals')
    output.push('outputs')
    output.push('other')
    return output
}

function loadGraph(element, data, labels, chart) {
    var ctx = document.getElementById(element).getContext("2d");

    let mainLabels = []
    mainLabels.push(data[0])

    let graphData = []
    let graphLabels = []

    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            continue
        } else {
            graphData.push(data[i])
            graphLabels.push(labels[i])
        }
    }

    if (chart != undefined) {
      chart.destroy()
    }
  
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: graphLabels,
        datasets: [
          {
            label: mainLabels,
            data: graphData,
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
          position: "right",
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

// This Takes four Arguments, Red Green Blue and opacity (0-100) and returns an  RGBA string for the graph colours
function RGBAConvert(red, green, blue, opacity) {
    return `RGBA(${red},${green},${blue},${opacity / 100})`;
  }



setDate()