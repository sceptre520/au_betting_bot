var express = require("express");
var router = express.Router();

const { readSetting, saveSetting } = require('./controller/setting')
const { getSports, updateSports } = require('./controller/sports')
const { getEvents, forceEvents } = require('./controller/event')
const apilog = require('./controller/apilog')

const { mailtest } = require('./controller/test')

router.get('/setting', readSetting)
router.post('/setting', saveSetting)

router.get('/sports', getSports)
router.post('/sports', updateSports)

router.post('/events', getEvents)
router.post('/forceevents', forceEvents)

router.get('/apilog', apilog)

router.get('/test/mail', mailtest)

module.exports = router;