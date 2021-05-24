require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");

const port = process.env.port || 4000;
const app = express();

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const dburl = process.env.DB_URL || "mongodb://localhost:27017";

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let client = await mongoClient.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("mydatabase");
    let data = await db.collection("users").find().toArray();
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "no data found" });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/create", async (req, res) => {
  try {
    let client = await mongoClient.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("mydatabase");
    await db.collection("users").insertOne(req.body);
    res.status(200).json({ message: "User created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("mydatabase");
    await db
      .collection("users")
      .findOneAndUpdate({ _id: objectId(req.params.id) }, { $set: req.body });
    res.status(200).json({ message: "User updated" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("mydatabase");
    await db.collection("users").deleteOne({ _id: objectId(req.params.id) });
    res.status(200).json({ message: "User deleted" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`App runs in port : ${port}`));
