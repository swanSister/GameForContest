var express = require('express');
var server = express();
var bodyParser = require('body-parser')
server.use(bodyParser.json());
var cors = require('cors');

server.use(cors())


server.use('/', express.static(__dirname + '/'))



server.listen(3004,function(){
  console.log("3004 cors ")
})