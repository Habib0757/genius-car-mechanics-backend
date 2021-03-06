const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectID } = require("mongodb");
require("dotenv").config();



const port = process.env.PORT ||5000

const app = express();
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vay9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray()
      res.send(result);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const newObjectId = new ObjectID(id);
      const query = { _id: newObjectId};
      const result = await servicesCollection.deleteOne(query);
      res.send(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, ()=>{console.log('listening on port:',port)})