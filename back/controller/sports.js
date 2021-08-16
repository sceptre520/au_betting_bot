const models = require('./../models');
const axios = require('axios')

exports.getSports = (req, res) => {
    models.sports.find(function(err, data) {
        if(err == null && data.length>0) {
            var ret = []
            for (x in data) {
                ret.push(data[x].key)
            }
            res.json(ret)
        }
        else {
            res.json([])
        }
    })
}

exports.updateSports = (req, res) => {
    models.setting.find(function(err, data) {
        if(err == null && data.length>0) {
            models.setting.find(function(err, data) {
                if(err == null && data.length>0) {
                    var apiKey = data[0].apikey
                    if(apiKey != '') {
                        axios.get('https://api.the-odds-api.com/v4/sports', {
                            params: { apiKey }
                        })
                        .then(response => {
                            var ret = []
                            for (x in response.data) {
                                models.sports.updateMany({key:response.data[x].key}, response.data[x], {upsert: true}, function (err) {
                                    console.log(err)
                                })
                                ret.push(response.data[x].key)
                            }
                            res.json(ret)
                        })
                        .catch(error => {
                            console.log('Error status', error.response.status)
                            console.log(error.response.data)
                            res.json([])
                        })
                    }
                    else {
                        res.json([])
                    }
                }
            })
        }
        else {
            res.json([])
        }
    })
}
