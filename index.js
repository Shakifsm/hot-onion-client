const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhonm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("hot-onion").collection("foods");
  
  app.post('/addFood', (req, res) =>{
    const newEvent = req.body;
    console.log('adding new event: ', newEvent);
    foodCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/allFood', (req, res) => {
    foodCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

    // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})