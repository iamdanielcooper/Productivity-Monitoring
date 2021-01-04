console.log('linked')

//const Chart = require('chart.js')



async function getData() {
    const response = await fetch('/new')
    const data = await response.json()
    console.log(data)

    console.log(data[0])

    let keys = []
    let values = []

    for (const key in data[0]) {
        if (Number.isInteger(data[0][key])) {
            console.log(data[0][key])
            keys.push(key)
            values.push(data[0][key])
        } 
        
    }
    
    
// load graph
var ctx = document.getElementById('myChart');

var stars = values;
var frameworks = keys;

var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: frameworks,
            datasets: [{
                label: 'Github Stars',
                data: stars,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
            }]
        }, options: {
            responsive: false
        }
        
});
}


