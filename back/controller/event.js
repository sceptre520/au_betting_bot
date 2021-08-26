const models = require('./../models');
const oddapi = require('./../scraper/oddapi')

exports.getEvents = (req, res) => {
    console.log(req.body)
    models.setting.find(function(err, data) {
        var sport_filter = null
        if(err == null && data.length>0) {
            sport_filter = data[0].sportKey
        }
        var filter = {commence_time : {$gte:req.body.start, $lte:req.body.end}}
        if (sport_filter != null) {
            filter.sport_key = {$in:sport_filter}
        }
        console.log(filter)
        models.events.find(filter, null, {sort: {commence_time: 1}}, function(err, data) {
            if(err == null && data.length>0) {
                res.json(data)
            }
            else {
                res.json([])
            }
        })
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

