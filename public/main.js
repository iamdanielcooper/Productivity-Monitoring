console.log('listening')

const output = {}

// element is the dom reference and modifier is wether the button is plus or minus
function logWorkDone(element, modifier) {
    let docRef = document.getElementById(element)
    // get current value
    let currentValue = parseInt(docRef.textContent) 
    // update the DOM with the new value
    if (modifier == '+') {
        docRef.innerText = currentValue + 1
        output[element] = currentValue + 1
    } else if (modifier == '-') {
        // update the DOM
        docRef.innerText = currentValue - 1
        // Update to output object
        output[element] = currentValue - 1
    } else {
        // Error Handling if the modifier is missing
        console.log('error')
        return
    }
    console.log(output)
}

// Process and submit the 
function submit() {
    let docRef = document.getElementById('user')

    if (docRef.value == 'Select User') {
        console.log('err')
        alert('Please Select Name and Submit Again')
        return
    }
    console.log(docRef.value)
}