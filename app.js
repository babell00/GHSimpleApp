var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var fss = require('fs-extra');
var path = require('path');

const PORT = 8080;
const DIR_PATH = './';
const FILE_NAME = 'test';
const EXTENTION = 'log';
const PATH = DIR_PATH + FILE_NAME + '.' + EXTENTION;
const MAX_SIZE_IN_KB = 1024; // 10424KB

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/appsflyer', (req, res) => {
  var jsonData = JSON.stringify(req.body);
  saveToFile(jsonData);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Listening on post: ' + PORT);
});

function saveToFile(jsonData){
  var isFileExists = isLogFileExists();
  if(isFileExists){
    var fileSize = getFileSize();

    if(fileSize > MAX_SIZE_IN_KB){
      console.log('biger');
      copy();
    } else {
      appendToFile(jsonData);
    }
  }
  else {
    save(jsonData)
  }
}

function save(jsonData) {
  fs.writeFile(PATH, jsonData, (error) => {
    if(error){
      console.log(error);
      return;
    }
    console.log('file has been saved.');
  });
}

function appendToFile(jsonData) {
  fs.appendFile(PATH, jsonData + '\n', (error) => {
    if(error){
      console.log(error);
      return;
    }
    console.log('file has been saved.');
  });
}

function copy(){
  var data = new Date().toISOString();
  var newPath = DIR_PATH + FILE_NAME + '-' + data + '.' + EXTENTION;
  fss.copySync(PATH, newPath);
}

function isLogFileExists(){
  if(fs.existsSync(PATH)) {
    return  true;
  }
  return false;
}

function getFileSize() {
  var stats = fs.statSync(PATH);
  var fileSizeInBytes = stats["size"];
  return fileSizeInBytes / 1024.0;
}
