import express from "express";
import mongoose from "mongoose";
import { stringify } from "querystring";
import { boolean } from "webidl-conversions";

const url = "mongodb://127.0.0.1:27017/library";
const app = express();
const port = process.env.PORT || 3006;

app.use(express.urlencoded({extended: true}));

mongoose.set({strictQuery: false});
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully");
});

const bookSchema = mongoose.Schema({
    name : {
        type: String,
    },
    available: {
        type: Boolean,
    },
});
const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
});
const book = mongoose.model("books", bookSchema);
const user = mongoose.model("users", userSchema);

let currentUser = new user;

function counter() {
    let bookCount = Array.from(book.find({available: true})).length;
};

app.post("/register", (req, res) => {
    const struct = new user;
    struct.name = req.body.name;
    struct.surname = req.body.surname;
    struct.save((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.json(struct);
});

app.post("/login", async (req, res) => {
    const struct = new user;
    struct.name = req.body.name;
    struct.surname = req.body.surname;
    user.findOne({name: struct.name, surname: struct.surname}, (err,user) => {
        if (user) {
            currentUser = user;
            res.send(`welcome dear ${user.name}`);
        }
        else if (err){
            console.error(err);
        }
        else {
            res.send("no user found");
        }
    });
})
app.post("/book_register", (req, res) => {
    const struct = new book;
    struct.name = req.body.name;
    struct.available = true;
    struct.save((err) => {
        if (err) {
            console.error(err);
        }
    });
    res.json(struct);
});

app.get("/books", async(req, res) => {
    const data = Array.from(await book.find()
    .then(console.log("done!"))
    .catch(err => console.error(err)));
    res.json(data);
});

app.get('/books/:id', (req, res) => {
    const objectId = req.params.id;
    book.findById(objectId, (err, object) => {
      if (err) console.error(err);
      res.json(object);
    });
  });


app.patch('/books/:id', (req, res) => {
    const objectId = req.params.id;
    const updateData = req.body.name;
    book.findByIdAndUpdate(objectId, updateData, { new: true }, (err, object) => {
        if (err) console.error(err);
        res.send(object);
      });
});

app.delete("/books/:id", (req, res) => {
    const objectId = req.params.id;
    book.findByIdAndDelete(objectId, (err) => {
      if (err) console.error(err);
      res.json("deleted successfully");
    });
});

app.post("/take_book/:id", (req, res) => {
    const objectId = req.params.id;
    book.findByIdAndUpdate(objectId, false, (err, object) => {
        if (err) console.error(err);
        if (object.available === false) {
            res.send("not available!!");
        }
        
        res.send("Taken!");
      });
});

app.post("/return/:id", (req, res) => {
    const objectId = rq.params.id;
    book.findByIdAndUpdate(objectId, true, (err, object) => {
        if (err) console.error(err);
        res.send("returned!!");
      });
});

app.get("/count", (req,res) => {
    const count = counter();
    res.send(`available books are ${count}`);
});
app.listen(port);