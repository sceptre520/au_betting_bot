const models = require('./../models');
var crypto = require('crypto');

exports.savedata = (sport_key, sport_title, bk_key, bk_title, teamnames, start_time, market_json) => {
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
                        last_update:'',
                        markets:market_json
                    }]
                })
                tmp.save()
            }
            else {
                console.log(data.bookmakers)
            }
        }
    })
}

