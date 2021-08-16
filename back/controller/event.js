const models = require('./../models');
const oddapi = require('./../scraper/oddapi')

exports.getEvents = (req, res) => {
    console.log(req.body)
    models.events.find({commence_time : {$gte:req.body.start, $lte:req.body.end}}, null, {sort: {commence_time: 1}}, function(err, data) {
        if(err == null && data.length>0) {
            res.json(data)
        }
        else {
            res.json([])
        }
    })
}

exports.forceEvents = (req, res) => {
    oddapi()
    models.events.find({commence_time : {$gte:req.body.start, $lte:req.body.end}}, null, {sort: {commence_time: 1}}, function(err, data) {
        if(err == null && data.length>0) {
            res.json(data)
        }
        else {
            res.json([])
        }
    })
}

