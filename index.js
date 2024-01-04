const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port  = process.env.PORT || 3000

app.use(cors())
dotenv.config()
app.use(express.json())



const uri = `mongodb+srv://imrandev97:${process.env.MONGODB_PASS}@cluster0.axaohwo.mongodb.net/?retryWrites=true&w=majority`;
// const uri ="mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("userDB")
    const userCollection = database.collection("users")


    // Get all users

    app.get('/users',async (req,res)=>{
        const cursor = userCollection.find()
        const result =await cursor.toArray()
        res.send(result)
         
    })

    // Single   users

    app.get('/users/:id',async (req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const user = await userCollection.findOne(query)
        res.send(user)
    })

// User Create

    app.post('/users',async (req,res)=>{
        const user = req.body
        console.log("new user",user);
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    // user update

    app.put('/users/:id',async (req,res)=>{
        const id = req.params.id
        const user = req.body
        const filter = {_id:new ObjectId(id)}
        const options = {upsert:true}
        const updateUser = {
            $set:{
                name:user.name,
                email:user.email
            }
        }
        const result= await userCollection.updateOne(filter,updateUser,options)
        res.send(result)
    })

    // user delete

    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id
        const query={_id:new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send("server is running")

})

app.listen(port,()=>{
    console.log(`port is running ${port}`);
})