const express = require('express')
const Database = require('nedb')

const app = express()

const proofDatabase = new Database('proofData.db')
proofDatabase.loadDatabase()

const port = 4000

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.use(express.static('public'))