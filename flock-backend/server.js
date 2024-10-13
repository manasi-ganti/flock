const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (replace with your actual connection string)
const uri =  "mongodb+srv://manasiganti:cvWLetD6oSm4jeFH@flockcluster.8zf9e.mongodb.net/flockbase?retryWrites=true&w=majority&appName=FlockCluster";
// after done testing: "mongodb+srv://manasiganti:cvWLetD6oSm4jeFH@flockcluster.8zf9e.mongodb.net/flockbase?retryWrites=true&w=majority&appName=FlockCluster";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  // token: String
});
const User = mongoose.model('User', userSchema);

// Pidgeon (Message) Schema
const pidgeonSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  receiverIds: [mongoose.Schema.Types.ObjectId],
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Pidgeon = mongoose.model('Pidgeon', pidgeonSchema);

// API Routes

// Root path handler
app.get('/', (req, res) => {
  res.send('Welcome to the Flock API!');
});

// Create a new user
app.post('/register', async (req, res) => {
  try {
    const { name, phone, latitude, longitude} = req.body;
    const user = new User({ name, phone, location: { latitude, longitude }});
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get a user's id
app.get('/user', async (req, res) => {
  try {
    const phonein = req.query.phone;
    const user = await User.findOne({phone:phonein})
    console.log("user id " + user._id);
    res.status(201).json(user._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user id' });
  }
});


// Get all messages for a user (sent or received)
app.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("param " + userId);
    const messages = await Pidgeon.find({
      receiverIds: userId //[{ senderId: userId }, { receiverIds: userId }],
    });
    console.log("messages : " + messages);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message to users within a certain distance
app.post('/sendPidge', async (req, res) => {
  try {
    const { senderId, message, distance } = req.body;

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const usersNearby = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [sender.location.longitude, sender.location.latitude],
          },
          $maxDistance: distance, 
        },
      },
    });

    const receiverIds = usersNearby.map(user => user._id);
    const newPidgeon = new Pidgeon({ senderId, receiverIds, message });
    await newPidgeon.save();

    res.status(201).json(newPidgeon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://manasiganti:cvWLetD6oSm4jeFH@flockcluster.8zf9e.mongodb.net/?retryWrites=true&w=majority&appName=FlockCluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);








// const express = require('express');
// const MongoClient = require('mongodb').MongoClient;

// const app = express();
// const port = 3000;
// const url = 'mongodb+srv://manasiganti:cvWLetD6oSm4jeFH@flockcluster.8zf9e.mongodb.net/?retryWrites=true&w=majority&appName=FlockCluster'; // Replace with your MongoDB connection string
// const dbName = 'mydatabase'; // Replace with your database name

// app.use(express.json());

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     const db = client.db(dbName);
//     const collection = db.collection('users'); // Replace 'users' with your collection name

//     // Get all users
//     app.get('/users', (req, res) => {
//       collection.find({}).toArray()
//         .then(users => res.json(users))
//         .catch(err => res.status(500).send(err));
//     });

//     // Create a new user
//     app.post('/users', (req, res) => {
//       collection.insertOne(req.body)
//         .then(result => res.json(result.ops[0]))
//         .catch(err => res.status(500).send(err));
//     });

//     app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
//   })
//   .catch(err => console.error('Failed to connect to MongoDB:', err));