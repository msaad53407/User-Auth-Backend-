const express = require('express');
const app = express();
const { mongodb, MongoClient, ServerApiVersion } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;
// Setting up MongoDB
const uri = process.env.MONGO_DB_URI
const dbName = 'Authentication'

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await client.connect(err => {
            if (err) { console.error(err); return false; }
            // connection to mongo is successful, listen for requests
            app.listen(port, () => {
                console.log("listening for requests");
            })
        });
        await client.db(dbName).command({ ping: 1 })
        console.log('Connected to MongoDB Successfully')

        const db = result.db(dbName)
        const userData = db.collection('userData')
        const query = { 'user.username': username }
        const user = await userData.findOne(query)
        if (!user) {
            res.status(200).json({
                loginCondition: false,
                loginData: 'No User found with username. Try SigningUp'
            })
        } else {
            res.status(200).json({
                loginCondition: true,
                loginData: user
            })
        }
    } catch (error) {
        res.status(500).send(error)
    } finally {
        console.log('client closed')
        client.close()
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await client.connect(err => {
            if (err) { console.error(err); return false; }
            // connection to mongo is successful, listen for requests
            app.listen(port, () => {
                console.log("listening for requests");
            })
        });
        await client.db(dbName).command({ ping: 1 })
        console.log('Connected to MongoDB Successfully')

        const db = result.db(dbName)
        const userData = db.collection('userData')
        const query = { 'user.username': username }
        const user = await userData.findOne(query)
        if (user) {
            res.status(200).json({
                signUpCondition: false,
                signUpData: 'Username already taken. Try something else.'
            })
        } else {
            const newDocument = {
                'user': {
                    'username': username,
                    'password': password
                }
            }
            userData.insertOne(newDocument);
            const query = { 'user.username': username }
            const user = await userData.findOne(query)
            if (user) {
                res.status(200).json({
                    signUpCondition: true,
                    signUpData: user
                })
            } else {
                res.status(200).json({
                    signUpCondition: true,
                    signUpData: newDocument
                })
            }
        }
    } catch (error) {
        res.status(500).send(error)
    } finally {
        console.log('client closed')
        client.close()
    }
})

app.get('/login', async (req, res) => {
    try {
        const id = req.query.id;
        const result = await client.connect(err => {
            if(err){ console.error(err); return false;}
            // connection to mongo is successful, listen for requests
            app.listen(port, () => {
                console.log("listening for requests");
            })
        });
        await client.db(dbName).command({ ping: 1 })
        console.log('Connected to MongoDB Successfully')
        const db = result.db(dbName)

        const userData = db.collection('userData')

        const query = { _id: new ObjectId(id) }

        const user = await userData.findOne(query)
        if (!user) {
            res.status(200).json({
                loginCondition: false,
                loginData: 'No User found with username'
            })
        } else {
            res.status(200).json({
                loginCondition: true,
                loginData: user
            })
        }
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    } finally {
        console.log('client closed')
        client.close()
    }
})

app.get('/', function (req, res) {
    res.send('Hello')
})

app.listen(port, () => {
    console.log('Server listening on localhost:' + port);
})
