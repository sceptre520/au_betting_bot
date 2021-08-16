const models = require('./../models');

exports.readSetting = (req, res) => {
    models.setting.find(function(err, data) {
        if(err == null && data.length>0) {
            models.setting.find(function(err, data) {
                if(err == null && data.length>0) {
                    res.json(data[0])
                }
            })
        }
        else {
            res.json({
                mail: '',
                password: '',
                apikey: '',
                sportKey: [],
                regions: [],
                markets: [],
                oddsFormat: '',
                dateFormat: ''
            })
        }
    })
}

exports.saveSetting = (req, res) => {
    var tmp = req.body
    models.setting.updateMany({}, tmp, {upsert: true}, function (err) {
        console.log(err)
    })
    res.json({ category:'1' });
}