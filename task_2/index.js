import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 3011;
const uri = 'mongodb://localhost:27017';

const myClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

myClient.connect();

const db = myClient.db('mydb');
const docs = db.collection('docs');
app.use(express.urlencoded({ extended: true }));

app.post("/input", (req, res) => {
    const bodyName = req.body.name;
    const bodyContent = req.body.content;
    docs.updateOne({ name: bodyName }, { $set: { content: bodyContent } }, { upsert: true })
        .then(() => res.json("Document added/updated successfully"))
        .catch(err => res.json(err));
});

app.get("/search", async (req, res) => {
    const data = req.query.q;
    let results = [];
    const result = await docs.find({ content: { $regex: data, $options: "i"} }).toArray();
    for (let key in result) {
        const finded = (result[key].content).search(data);
        results.push(result[key].name);

    }
    if (result.length) {
        res.json(results);
    }
    else {
        res.json("sorry No results!!!");
    }
});

app.listen(port);