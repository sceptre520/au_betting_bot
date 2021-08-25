const models = require('./../models');
const main_obj = require('./../index')

const cron = require('node-cron');

const jimmy = require('./../scraper/jimmy')
const tabbouch = require('./../scraper/tabtouch')
const oddapi = require('./...scraper/oddapi')

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
                dateFormat: '',
                prd1: '',
                prd2: '',
                trigger: ''
            })
        }
    })
}

exports.saveSetting = (req, res) => {
    var tmp = req.body

    if(main_obj.task1 != undefined) main_obj.task1.stop()
    var prd1 = 1800
    if(tmp.prd1) prd1 = tmp.prd1
    var cron1_str = "*/"+prd1+" * * * * *"
    main_obj.task1 = cron.schedule(cron1_str, function() {
        console.log(cron1_str)
        oddapi()
    })

    if(main_obj.task2 != undefined) main_obj.task2.stop()
    var prd2 = 15
    if(tmp.prd2) prd2 = tmp.prd2
    var cron2_str = "*/"+prd2+" * * * * *"
    main_obj.task2 = cron.schedule(cron2_str, function() {
        console.log(cron2_str)
        jimmy.run()
        tabbouch.run()
    })

    models.setting.updateMany({}, tmp, {upsert: true}, function (err) {
        if(err != null) console.log(err)
    })
    res.json({ category:'1' });
}