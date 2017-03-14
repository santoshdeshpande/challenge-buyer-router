var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var client = require('./redis-client');

var app = express();

let data = {};

app.use((req, res, next) => {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
})

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  res.status(422).send({error: "Error parsing json body"});
});

app.post('/buyers', (req, res) => {
  if(req.body && req.body.id) {
    data[req.body.id] = req.body;
    client.addBuyer(req.body);
  }
  res.status(201).send({});
});

app.get('/buyers/:buyerId', (req, res) => {
  client.getBuyer(req.params.buyerId)
        .then((data) => {
          res.status(200).send(JSON.parse(data));
        }).catch((err) => {
          res.status(500).send({})
        })

});

app.get('/route', (req, res) => {
  var date = new Date(req.query.timestamp);
  var day = date.getDay();
  var hour = date.getUTCHours();
  var state = req.query.state;
  var device = req.query.device;
  client.route(day, hour, state, device)
    .then((data) => {
      if(data.length > 0) {
        var location = data[0].location;
        res.redirect(location);
      }
    })
    .catch((err) => console.log("error" + err));
});
module.exports = () => http.createServer(app);
