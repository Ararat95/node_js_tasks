import express from "express";
import path from "path";
import fs from "fs";


const PORT = 3001;
const app = express();

let docPath = path.resolve("docs");

let files = [];
fetchFromFile();

app.use(express.urlencoded({extended: true}));

function fetchFromFile() {
    files = fs.readFileSync("files.txt", "utf8").split(' ');
    // console.log(files);
};

function updateFiles(name, content) {
    fs.writeFileSync(path.join(docPath, name), content);
    fs.appendFileSync("files.txt", " " + name);
};

function checkData(input) {
    let fileData = "";
    let found;
    let result = "";
    for (let key = 0; key < files.length; ++key) {
        fileData = "";
        fileData = fs.readFileSync(path.join(docPath, files[key]), "utf8");
        found = fileData.search(input);
        if (found !== -1) {
            result += '/' + files[key];
        }
    }   
    if (result !== "") {
        return ("found in: " + result);
    }
    return "not found";
};
function get_resource(data) {

    return checkData(data);
    
};

app.post("/files", (req, res) => {
    // console.log(req.body);
    const fileName = req.body.name;
    const fileContent = req.body.content;
    
    updateFiles(fileName, fileContent);
    fetchFromFile();

    res.send("done");
});
app.get("/search", (req, res) => {
    let data = req.query.q;
    // console.log("okkk!");
    if (data) {
        res.send(get_resource(data));
    } else {
        res.send("wrong input");
    }
});

app.listen(PORT);