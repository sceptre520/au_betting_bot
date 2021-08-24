const models = require('./../models');

exports.savedata = (bk_key, bk_title, teamnames, start_time, market_json) => {
    models.events.findOne({$and:[
        {$or:[
        {$and:[{home_team:teamnames[0]}, {away_team:teamnames[1]}]},
        {$and:[{away_team:teamnames[0]}, {home_team:teamnames[1]}]}
        ]},
        {commence_time:start_time}
    ]}, function(err, data) {
        if(err == null) {
            console.log(data)
        }
    })
}

