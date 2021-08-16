const models = require('./../models');
const oddapi = require('./../scraper/oddapi')

exports.getEvents = (req, res) => {
    models.events.find(function(err, data) {
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
    models.events.find(function(err, data) {
        if(err == null && data.length>0) {
            res.json(data)
        }
        else {
            res.json([])
        }
    })
}

