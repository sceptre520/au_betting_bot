const dprc = require('./../dataprocess')
const models = require('./../models');

exports.mailtest = (req, res) => {
    models.setting.find(function(err, data) {
        if(err == null && data.length>0) {
            var tmp_setting = data[0]
            var msg = []
            msg.push({
                bookmaker: 'b1',
                match: 'h1' + " vs " + 'h2',
                sports: 'mlb',
                market: 'win',
                outcome: 'ind',
                from: '1.6',
                to: '2.1'
            })
            msg.push({
                bookmaker: 'b2',
                match: 'h1' + " vs " + 'h2',
                sports: 'mlb',
                market: 'line',
                outcome: 'pak',
                from: '1.8',
                to: '1.5'
            })
            dprc.sendGmail(tmp_setting.mail, tmp_setting.password, msg)
            res.send('sended')
        }
        else {
            res.send('no setting')
        }
    })
}