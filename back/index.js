require("dotenv").config();
const cron = require('node-cron');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/'+process.env.db_name, {useNewUrlParser: true, useUnifiedTopology: true})
var mongoDB = mongoose.connection;
const models = require('./models');
const dprc = require('./dataprocess')

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./router")

const jimmy = require('./scraper/jimmy')
const tabbouch = require('./scraper/tabtouch')

mongoDB.once('open', function() {
  console.log('--  MogoDB Connected  --')
})

console.log('--  Server Started  --')


cron.schedule('0 */30 * * * *', function() {
  console.log(' ---  running a task every 30 minutes --- ');
})

cron.schedule('*/30 * * * * *', function() {
  console.log('--  running a task every 30 seconds --');
  jimmy.run()
  tabbouch.run()
})


app.use(bodyParser.json());
app.use("/api", router)


//PORT
const port = process.env.port || 4100;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});