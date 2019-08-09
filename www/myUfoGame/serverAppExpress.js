var express = require('express');
var app = express();
var path = require('path');

console.log("Optional args:\n--file <filePath> \n--port <portNum>");

// Also checks for --name and if we have a value
const fileNameIndex = process.argv.indexOf('--file');
let fileNameValue = __dirname;
fileNameValue += fileNameIndex > -1 ? process.argv[fileNameIndex + 1] : +'/index.html';

const portIndex = process.argv.indexOf('--port');
let portNum = portIndex > -1? process.argv[portIndex + 1]: "8080"; 



app.get('/', function(req, res) {
    res.sendFile(path.join(fileNameValue));
});

app.listen(portNum);

console.log("Listening on port: "+ portNum+ "\nfile:"+ fileNameValue);
