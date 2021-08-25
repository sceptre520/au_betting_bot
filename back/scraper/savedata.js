const models = require('./../models');
const dprc = require('./../dataprocess')

var crypto = require('crypto');

exports.savedata = (sport_key, sport_title, bk_key, bk_title, teamnames, start_time, market_json) => {
    models.setting.find(function(err, data) {
        if(err == null && data.length>0) {
            var tmp_setting = data[0]
            models.events.findOne({$and:[
                {$or:[
                {$and:[{home_team:teamnames[0]}, {away_team:teamnames[1]}]},
                {$and:[{away_team:teamnames[0]}, {home_team:teamnames[1]}]}
                ]},
                {commence_time:start_time}
            ]}, function(err, data) {
                if(err == null) {
                    if(data == null) {
                        var evt_key = crypto.createHash('sha256').update(sport_key+teamnames[0]+teamnames[1]+start_time).digest('hex');
                        var today = new Date();
                        var tmp = new models.events({
                            id:evt_key,
                            sport_key:sport_key,
                            sport_title:sport_title,
                            commence_time:start_time,
                            home_team:teamnames[0],
                            away_team:teamnames[1],
                            bookmakers:[{
                                key:bk_key,
                                title:bk_title,
                                last_update:today.toISOString().split('.')[0]+"Z",
                                markets:market_json
                            }]
                        })
                        tmp.save()
                    }
                    else {
                        var tmp_len = data.bookmakers.length
                        var flag = false
                        for (var tmp_i=0; tmp_i<tmp_len; tmp_i++) {
                            var ret_msg = []
                            if (data.bookmakers[tmp_i].key == bk_key) {
                                var mk_len = market_json.length
                                for (var tmp_j=0; tmp_j<mk_len; tmp_j++) {
                                    outcomes = market_json[tmp_j].outcomes
                                    mk_key = market_json[tmp_j].key
                                    var index_market = -1
                                    // if(bk_key == 'tabtouch') {
                                    //     console.log('mk_key ', mk_key)
                                    //     console.log(data.bookmakers[tmp_i].markets)
                                    // }
                                    for(j in data.bookmakers[tmp_i].markets) {
                                        // console.log(data.bookmakers[tmp_i].markets[j].key)
                                        if (data.bookmakers[tmp_i].markets[j].key == mk_key)
                                            index_market = j
                                    }
                                    if (index_market == -1) {
                                        data.bookmakers[tmp_i].markets.push(market_json[tmp_j])
                                        continue
                                    }

                                    var oc_len = outcomes.length
                                    for (var tmp_k=0; tmp_k<oc_len; tmp_k++) {
                                        for (x in data.bookmakers[tmp_i].markets[index_market].outcomes) {
                                            if (data.bookmakers[tmp_i].markets[index_market].outcomes[x].name == outcomes[tmp_k].name) {
                                                data.bookmakers[tmp_i].markets[index_market].outcomes[x].last_price = data.bookmakers[tmp_i].markets[index_market].outcomes[x].price
                                                data.bookmakers[tmp_i].markets[index_market].outcomes[x].price = outcomes[tmp_k].price
                                                if (validityPrice(data.bookmakers[tmp_i].markets[index_market].outcomes[x].last_price, outcomes[tmp_k].price)) {
                                                    ret_msg.push({
                                                        bookmaker: bk_key,
                                                        match: teamnames[0] + " vs " + teamnames[1],
                                                        sports: sport_key,
                                                        market: market_json[tmp_j].key,
                                                        outcome: outcomes[tmp_k].name,
                                                        from: data.bookmakers[tmp_i].markets[index_market].outcomes[x].last_price,
                                                        to: outcomes[tmp_k].price
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                                flag = true
                                break
                            }
                            dprc.sendGmail(tmp_setting.mail, tmp_setting.password, ret_msg)
                        }
                        if (flag == false) {
                            data.bookmakers.push({
                                key:bk_key,
                                title:bk_title,
                                last_update:today.toISOString().split('.')[0]+"Z",
                                markets:market_json
                            })
                        }
                        models.events.updateMany({id:data.id}, data, {upsert: true}, function (err) {
                            if (err != null) console.log(err)
                        })
                        // console.log(data.bookmakers)
                    }
                }
            })
        }
    })
}

validityPrice = function (a, b) {
    if (Math.abs(a - b) > 0.4) return true
    return false
}
