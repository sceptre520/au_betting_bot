var mongoose = require('mongoose');

const EvtSchema = new mongoose.Schema(
	{
		id: { type: String, required: true },
		sport_key: { type: String, required: true },
		sport_title: { type: String, required: true },
		commence_time: { type: String, required: true },
        home_team: { type: String, required: true },
        away_team: { type: String, required: true },
        bookmakers: [{
            key : { type: String, required: true },
            title : { type: String, required: true },
            last_update : { type: String, required: true },
            markets: [{
                key: { type: String, required: true },
                outcomes: [{
                    name: { type: String, required: true },
                    price: { type: Number, required: true },
                    last_price: { type: Number },
                }]
            }]
        }]
	},
	{ collection: 'events' }
)
EvtSchema.index({ id: 1 }, { unique: true })
exports.events = mongoose.model('events', EvtSchema)


const SportSchema = new mongoose.Schema(
	{
		key: { type: String, required: true },
		group: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String },
        active: { type: Boolean },
        has_outrights: { type: Boolean }
	},
	{ collection: 'sports' }
)
EvtSchema.index({ id: 1 }, { unique: true })
exports.sports = mongoose.model('sports', SportSchema)


const SettingSchema = new mongoose.Schema(
	{
        mail: { type: String, required: true },
        password: { type: String, required: true },
		apikey: { type: String, required: true },
		sportKey: [
            { type: String, required: true }
        ],
		regions: [
            { type: String, required: true }
        ],
		markets: [
            { type: String }
        ],
        oddsFormat: { type: String, required: true },
        dateFormat: { type: String, required: true },
        prd1: { type: String },
        prd2: { type: String },
        trigger: { type: String }
	},
	{ collection: 'setting' }
)
exports.setting = mongoose.model('setting', SettingSchema)

const ApiLogSchema = new mongoose.Schema(
	{
        last_req_time: { type: String, required: true },
        rem_req: { type: String, required: true },
        used_req: { type: String, required: true }
	},
	{ collection: 'apilog' }
)
exports.apilog = mongoose.model('apilog', ApiLogSchema)