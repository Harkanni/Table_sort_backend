const fs = require("fs")
const filePath = require("path")
const os = require("os")
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

tempDirectory = filePath.join(os.tmpdir())

let storage = multer.diskStorage({
	destination: function(request, file, callback){
		callback(null, tempDirectory)
		// callback(null, "./Uploads")
	},

	filename: function(request, file, callback){
		console.log(file)
		this.file = file;
		// callback(null, file.fieldname + '-' + Date.now() + filePath.extname(file.originalname))
		callback(null, file.originalname)
	}
})

const upload = multer({storage: storage})



// console.log(CSV_TO_JSON)

app.get("/", (req, res) => {
	res.json({"greetings": "hello"})
})

app.post("/csv", upload.single("file"), (req, res) => {
	const FILEPATH = filePath.resolve(tempDirectory + "/" +upload.storage.file.originalname)
	// console.log(upload.storage.file.fieldname, FILEPATH)
	

	let FILE_EXT = filePath.extname(upload.storage.file.originalname)

	csv_file = FILEPATH
	console.log(tempDirectory, FILEPATH)


	if(!FILEPATH){
		console.log(FILE_EXT)
		return res.status(400).send({status: 'failed'})
	}
	if (FILE_EXT != ".csv") {
		return res.status(400).send({message: "The file format is invalid: Make sure the file is in csv format and try again. "})
	}

	// res.status(200).send(csv_file)
	CSV_TO_JSON().fromFile(csv_file).then(source => {
		res.json(source)
	})
})



// listening port
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});
