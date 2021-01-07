const express = require('express')
const Database = require('nedb')

const app = express()

const proofDatabase = new Database('proofData.db')
proofDatabase.loadDatabase()



app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`listening`)
})

app.use(express.static('public'))

/*
app.get('/new', (request, response) => {
    proofDatabase.find({}, (err, data) => {
        response.send(data)
    })
})
*/
app.post('api', (request, response) => {
    const search = {}
    const data = request.body

    search.date = data.date
    search.user = data.user

    console.log(search)

    proofDatabase.find(search, (err, docs) => {
        console.log(docs)
        if (docs.length != 0) { // if exists already
            console.log('this data needs to be replaced')
            proofDatabase.remove(search, {}, (err, numRemoved) => { // remove the old one
                console.log(`${numRemoved} items removed`)
            })
            proofDatabase.insert(data) // add the new one
            console.log(data)
            
        } else { 
            proofDatabase.insert(data)
            console.log(data)
        }
        
    })
    
    
    
});

app.post('find', (request, response) => {
   let info = request.body
    proofDatabase.find(info, (err, docs) => {
        response.json(docs)

    })
})