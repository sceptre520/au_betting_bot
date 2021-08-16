const axios = require('axios')
const models = require('./../models');
const dprc = require('./../dataprocess')

module.exports = function() {
    models.setting.find(function(err, data) {
        if(err == null && data.length>0) {
            models.setting.find(function(err, data) {
                if(err == null && data.length>0) {
                    var tmp_setting = data[0]
                    if(tmp_setting.sportKey != null) {
                        var apiKey = tmp_setting.apikey
                        var regions = ''
                        var markets = ''
                        var oddsFormat = tmp_setting.oddsFormat
                        var dateFormat = tmp_setting.dateFormat
                        for(x in tmp_setting.regions) {
                            if (regions!='') regions += ','
                            regions += tmp_setting.regions[x]
                        }
                        for(x in tmp_setting.markets) {
                            if (markets!='') markets += ','
                            markets += tmp_setting.markets[x]
                        }
                        for(x in tmp_setting.sportKey) {
                            var sportKey = tmp_setting.sportKey[x]
                            axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
                                params: {
                                    apiKey,
                                    regions,
                                    markets,
                                    oddsFormat,
                                    dateFormat,
                                }
                            })
                            .then(response => {
                                updateOneData(0, response.data.length, response.data, function() {
                                    console.log('---  success  ---')
                                })

                                var tmp_log = {
                                    last_req_time: new Date(),
                                    rem_req: response.headers['x-requests-remaining'],
                                    used_req: response.headers['x-requests-used']
                                }
                                models.apilog.updateMany({}, tmp_log, {upsert: true}, function (err) {
                                    console.log(err)
                                })
                            })
                            .catch(error => {
                                console.log('Error status', error.response.status)
                                console.log(error.response.data)
                            })
                        }
                    }
                }
            })
        }
    })
}

function updateOneData(ind, len, org_data, callback) {
    if(ind < len) {
        var tmp = org_data[ind]
        models.events.findOne({id:tmp.id}, {"bookmakers.key":1, "bookmakers.markets.key":1, "bookmakers.markets.outcomes":1}, function(err, data) {
            if(err == null) {
                ret = dprc.saveLastPrice(data, tmp)
                var tmp_evt = ret.data
                if (ret.msg.length > 0 && tmp_setting.mail!='') {
                    dprc.sendGmail(tmp_setting.mail, tmp_setting.password, ret.msg)
                }
                models.events.updateMany({id:tmp_evt.id}, tmp_evt, {upsert: true}, function (err) {
                    console.log(err)
                })
                updateOneData(ind+1, len, org_data, callback)
            }
        })
    }
    else {
        callback()
    }
}