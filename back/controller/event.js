const models = require('./../models');
const axios = require('axios')

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