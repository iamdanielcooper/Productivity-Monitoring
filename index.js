const { request, json } = require('express');
const express = require('express')
// const Database = require('nedb') // The first version of this used nedb. but i'm moving it to a mongoDB database.
const {MongoClient} = require('mongodb');
const mongojs = require('mongojs')

require('dotenv').config()



const app = express()

// const proofDatabase = new Database('proofData.db')

app.use(express.json());


app.listen(process.env.PORT || 3000, () => {
    console.log(`listening`)
})

app.use(express.static('public'))


app.post('/find', async (req, res) => {
    const db = mongojs(process.env.KEY, ['artwork-data'])

    
    db.workload.find(req.body, function (err, docs) {
        res.json(docs)
        console.log(docs)
})


  })

  


// this listens for the submit from the frontend and then adds the result to a database.
app.post('/api', (request, response) => {
    const input = request.body 
    const search = {}

    search.user = input.user
    search.date = input.date

   // pass the new data to the insert function which will process it.
    insertToDB(input, search)
    });


async function findInDB(input) {
    const uri = process.env.KEY;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect()
    const database = client.db("artwork-data");
    const collection = database.collection('workload')

    

    try {
    result = await collection.findOne(input);
    if (result == null) {
        await client.close
        return false
    } else {
        await client.close
        return true
    }
    } finally {
        await client.close
    }
}


async function insertToDB(input, search) {

    // Generic DB access protocol
    const uri = process.env.KEY;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect()
    const database = client.db("artwork-data");
    const collection = database.collection('workload')

    try {


    //TODO Find ask the server if the search pulls anything up
    
    let searchResult = await findInDB(search)
        
    if(searchResult == false) { //if the search returns false add the entry to the database..
        console.log(`Not found in Database.`)
        result = await collection.insertOne(input);
        console.log('Inserted into database')
    } else {
        console.log('We would need to delete the old one before we can add this one.')
        await removeFromDB(search)
        result = await collection.insertOne(input);
        console.log('Inserted into database')
        }

    } finally {
        await client.close
    }
}


async function removeFromDB(search) {
    const uri = process.env.KEY;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect()
    const database = client.db("artwork-data");
    const collection = database.collection('workload')

    try {
    result = await collection.deleteOne(search);
    console.log('Previous entry deleted')
    } finally {
        await client.close
    }
}

async function findInDBForGraph(input) {
    const uri = process.env.KEY;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect()
    const database = client.db("artwork-data");
    const collection = database.collection('workload')

    try {
    let output =  await collection.find(input);
    console.log(output)
    await client.close
    return output
    } finally {
        await client.close
    }
}

// find regex
app.post('/reg', async (req, res) => {
    const db = mongojs(process.env.KEY, ['artwork-data'])

    let search = req.body
    
    
    db.workload.find(search, function (err, docs) {
        res.json(docs)
        console.log(docs)
    })
})
