console.log('Hello')


function test() {
    document.getElementById('dropdownBackground').style.bottom = '50px'
    console.log('test')
}


function toggleInfoDropdown(elm) {
    docRef = document.getElementById(elm)
    if (document.getElementById(elm).style.bottom == '300px') {
        document.getElementById(elm).style.bottom = '460px'
    } else {
        document.getElementById(elm).style.bottom = '300px'
    }

    console.log('tired')
}