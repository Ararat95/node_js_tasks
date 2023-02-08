import express from "express";
import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/Apps";
const app = express();
const port = process.env.PORT || 3002;

app.use(express.urlencoded({extended: true}));

// app.use(function(req, res, next) {
//     res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
// });

mongoose.set({strictQuery: false});
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully");
});

const appSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    rating: {
        type: String,
        required: false
    },
});

const appsData = mongoose.model("apps_info", appSchema);

app.get("/apps", async(req, res) => {
    const data = Array.from(await appsData.find()
    .then(console.log("done!"))
    .catch(err => console.error(err)));
    res.json(data);
});

app.get('/apps/:id', (req, res) => {
    const objectId = req.params.id;
    appsData.findById(objectId, (err, object) => {
      if (err) return handleError(err);
      res.json(object);
    });
  });


app.post("/apps", (req, res) => {
    const struct = new appsData;
    struct.name = req.body.name;
    struct.description = req.body.description;
    struct.rating = req.body.rating;
    struct.save((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.json(struct);
});

app.patch('/apps/:id', (req, res) => {
    const objectId = req.params.id;
    const updateData = req.body;
    appsData.findByIdAndUpdate(objectId, updateData, { new: true }, (err, object) => {
        if (err) return handleError(err);
        res.send(object);
      });
});

app.delete("/apps/:id", (req, res) => {
    const objectId = req.params.id;
    appsData.findByIdAndDelete(objectId, (err) => {
      if (err) return handleError(err);
      res.json("deleted successfully");
    });
});
app.listen(port);