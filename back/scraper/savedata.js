const models = require('./../models');

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
                var tmp = {
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
                }
                tmp.save()
            }
            else {
                console.log(data.bookmakers)
            }
        }
    })
}

