var express = require("express");
var router = express.Router();

const { readSetting, saveSetting } = require('./controller/setting')
const { getSports, updateSports } = require('./controller/sports')
const { getEvents, forceEvents } = require('./controller/event')

router.get('/setting', readSetting)
router.post('/setting', saveSetting)

router.get('/sports', getSports)
router.post('/sports', updateSports)

router.get('/events', getEvents)
router.post('/events', forceEvents)

module.exports = router;