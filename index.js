const express = require('express')
const Database = require('nedb')

const app = express()

const proofDatabase = new Database('proofData.db')
proofDatabase.loadDatabase()

const port = 4000

app.use(express.json());

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.use(express.static('public'))

/*
app.get('/new', (request, response) => {
    proofDatabase.find({}, (err, data) => {
        response.send(data)
    })
})
*/
app.post('/api', (request, response) => {
    const data = request.body
    proofDatabase.insert(data)
    console.log(data)
});

app.post('/find', (request, response) => {
   let info = request.body
    proofDatabase.find(info, (err, docs) => {
        response.json(docs)

    })
})