const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z0a0ula.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const BookingCollection = client
      .db("BookingCollege")
      .collection("BookingCard");

    const admissionCollection = client
      .db("BookingCollege")
      .collection("Booking");

    const CollegeCartCollection = client
      .db("BookingCollege")
      .collection("CollegeCard");

    app.get("/Booking/:email", async (req, res) => {
      // console.log(req.params.email);
      const result = await admissionCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    /// Get Data
    app.get("/BookingCard", async (req, res) => {
      const result = await BookingCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/CollegeCard", async (req, res) => {
      const result = await CollegeCartCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/Booking", async (req, res) => {
      const Newadmission = req.body;
      const result = await admissionCollection.insertOne(Newadmission);
      console.log(result);
      res.send(result);
    });

    app.get("");

    ///PUT

    app.put("/Booking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProfile = req.body;

      const admission = {
        $set: {
          name: updatedProfile.name,
          email: updatedProfile.email,
          details: updatedProfile.details,
        },
      };

      const result = await admissionCollection.updateOne(
        filter,
        admission,
        options
      );
      res.send(result);
    });

    app.put("/CollegeCard/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedrating = req.body;

      const admission = {
        $set: {
          rating: updatedrating.rating,
        },
      };

      const result = await CollegeCartCollection.updateOne(
        filter,
        admission,
        options
      );
      res.send(result);
    });

    // Search Bar

    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Booking College!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
