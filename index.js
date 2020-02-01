// express
const express = require('express')
const app = express()
// middleware of express
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var denreeRoutes = require('./src/routes/denree.js')
var stockRoutes = require('./src/routes/stock.js')
app.use('/denree', denreeRoutes)
app.use('/stock', stockRoutes)

app.listen(5000, function () {
  console.log('Catalogue app listening on port 5000!')
})
