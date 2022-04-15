const path = require('path');
const express = require('express');
var httpsRedirect = require('express-https-redirect');


let counter = 0;

const app = express();
const server = require('http').Server(app);

const port = process.env.PORT || 3000;

let folder = __dirname + '/src';
app.use('/', httpsRedirect(true));

app.get('/', function (req, res) {
  res.sendFile(folder+'/index.html');
  counter++
  console.log(counter, "connections made: counter")
});

app.use(express.static(folder));

server.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});

