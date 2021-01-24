let timestampLog = []

// function to take this as the argument from the HTML, it then processes it and updates everything accordingly.
function processIncrementor(elm) {
    // locate the first H2 tag and get the value of the number in it.
    let location = elm.parentNode.querySelectorAll("h2")[0]
    let number = parseInt(location.innerText) 
    
    // find the class of the obect that was clicked.
    // if it was the right trigger add. else subtract
    if (elm.className == 'clickRightforeground') {
        location.innerText = number + 1
    } else {
        if (number <= 0) { // guard clause catches negative numbers
            console.log('Err: negative number')
            return
        }
        location.innerText = number - 1
    }
    // Update the timestamp
    getTime(elm)
}

function toggleInfoDropdown(elm) {
    docRef = document.getElementById(elm)
    if (document.getElementById(elm).style.bottom == '300px') {
        document.getElementById(elm).style.bottom = '460px'
    } else {
        document.getElementById(elm).style.bottom = '300px'
    }
    rotateArrow()
}

function rotateArrow() {
    if (document.getElementById('arrowImage').style.transform == "rotate(180deg)") {
        document.getElementById('arrowImage').style.transform = "rotate(360deg)"
    } else {
        document.getElementById('arrowImage').style.transform = "rotate(180deg)"
    }
    
}

function getTime(elm) {

    let time = new Date;
    let hour = time.getHours();
    let mins = time.getMinutes();
 
    // Update times with Zeros to keep them uniform.
    if (mins < 10) {
        mins = `0${mins}`
    }
    if (hour < 10) {
        hour = `0${hour}`
    }

    let timestamp = `${hour}:${mins}`;

    let location = elm.parentNode.querySelectorAll("p")[0];

    location.innerText = timestamp;

    addToTimestampLog(timestamp)
}

function addToTimestampLog(time) {
    timestampLog.pop(time)
    document.getElementById('dropdownContent').innerText = timestampLog
}

console.log('hello')