require("dotenv").config();
const cron = require('node-cron');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/'+process.env.db_name, {useNewUrlParser: true, useUnifiedTopology: true})
var mongoDB = mongoose.connection;
const models = require('./models');
const dprc = require('./dataprocess')

mongoDB.once('open', function() {
    console.log('--  MogoDB Connected  --')

    var tmp = {
        "id":"fd12106d75abbe09c6777273e2e5debd",
        "sport_key":"cricket_test_match",
        "sport_title":"Test Matches",
        "commence_time":"2021-08-13T15:00:00Z",
        "home_team":"West Indies",
        "away_team":"Pakistan",
        "bookmakers":[
            {
                "key":"unibet",
                "title":"Unibet",
                "last_update":"2021-08-13T22:06:10Z",
                "markets":[
                    {
                        "key":"h2h",
                        "outcomes":[
                            {"name":"Pakistan","price":14.65},
                            {"name":"West Indies","price":22.06},
                            {"name":"Draw","price":4.9}
                        ]
                    },
                    {
                        "key":"spread",
                        "outcomes":[
                            {"name":"Pakistan","price":1.65},
                            {"name":"West Indies","price":0.06},
                            {"name":"Draw","price":3.1}
                        ]
                    }
                ]
            },
            {
                "key":"betfair",
                "title":"Betfair",
                "last_update":"2021-08-13T22:05:37Z",
                "markets":[
                    {
                        "key":"h2h",
                        "outcomes":[
                            {"name":"Pakistan","price":2.7},
                            {"name":"West Indies","price":2.26},
                            {"name":"Draw","price":2.2}
                        ]
                    },
                    {
                        "key":"h2h_lay",
                        "outcomes":[
                            {"name":"Pakistan","price":2.74},
                            {"name":"West Indies","price":2.28},
                            {"name":"Draw","price":4.4}
                        ]
                    }
                ]
            }
        ]
    }
    
    models.events.findOne({id:tmp.id}, {"bookmakers.key":1, "bookmakers.markets.key":1, "bookmakers.markets.outcomes":1}, function(err, data) {
        if(err == null) {
            ret = dprc.saveLastPrice(data, tmp)
            tmp = ret.data
            if (ret.msg.length > 0) {
                models.setting.find(function(err, data) {
                    if(err == null && data.length>0) {
                        dprc.sendGmail(data[0].mail, data[0].password, ret.msg)
                    }
                })
            }
            models.events.updateMany({id:tmp.id}, tmp, {upsert: true}, function (err) {
                console.log(err)
            })
        }
    })
})

console.log('--  Server Started  --')


// cron.schedule('0 */30 * * * *', function() {
//   console.log(' ---  running a task every 30 minutes --- ');
cron.schedule('*/5 * * * * *', function() {
    console.log('--  running a task every 5 seconds --');
})

