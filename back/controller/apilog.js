const models = require('./../models');

module.exports = function(req, res) {
    models.apilog.find(function(err, data) {
        if(err == null) {
            if(data.length == 0) {
                var tmp_log = {
                    last_req_time: new Date(),
                    rem_req: 0,
                    used_req: 0
                }
                models.apilog.updateMany({}, tmp_log, {upsert: true}, function (err) {
                    console.log(err)
                })
                res.json(tmp_log)
            }
            else {
                res.json(data[0])
            }
        }
    })
}