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
const oddapi = require('./scraper/oddapi')


mongoDB.once('open', function() {
  console.log('--  MogoDB Connected  --')
  models.setting.find(function(err, data) {
    if(err == null && data.length>0) {

      var prd1 = 1800
      if(data[0].prd1) prd1 = data[0].prd1
      var cron1_str = "*/"+prd1+" * * * * *"
      exports.task1 = cron.schedule(cron1_str, function() {
          console.log(cron1_str)
          oddapi()
      })

      var prd2 = 15
      if(data[0].prd2) prd2 = data[0].prd2
      var cron2_str = "*/"+prd2+" * * * * *"
      exports.task2 = cron.schedule(cron2_str, function() {
          console.log(cron2_str)
          jimmy.run()
          tabbouch.run()
      })

    }
  })
})

console.log('--  Server Started  --')


app.use(bodyParser.json());
app.use("/api", router)


//PORT
const port = process.env.port || 4100;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});