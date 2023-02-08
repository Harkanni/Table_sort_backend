const fs = require("fs")
const filePath = require("path")
const express = require("express")
const app = express()
const CSV_TO_JSON = require("csvtojson")
const JSON_TO_CSV = require("json2csv")
var bodyParser = require("body-parser")


// INITIALIZING MULTER
const multer = require("multer")


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);
	next()
});

app.use(express.json())

app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' *");
    next();
});

var storage = multer.diskStorage({
	destination: function(request, file, callback){
		callback(null, "./Uploads")
	},

	filename: function(request, file, callback){
		console.log(file)
		this.file = file;
		// callback(null, file.fieldname + '-' + Date.now() + filePath.extname(file.originalname))
		callback(null, file.originalname)
	}
})

const upload = multer({storage: storage})


console.log(CSV_TO_JSON)

app.get("/", (req, res) => {
	res.json({"greetings": "hello"})
})

app.post("/csv", upload.single("file"), (req, res) => {
	const FILEPATH = filePath.resolve("./Uploads/" + upload.storage.file.originalname)
	console.log(upload.storage.file.fieldname, FILEPATH)
	
	csv_file = FILEPATH

	if(!FILEPATH){
		return res.status(400).send({status: 'failed'})
	}

	// res.status(200).send(csv_file)
	CSV_TO_JSON().fromFile(csv_file).then(source => {
		res.send(source)
	})
})



// listening port
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});