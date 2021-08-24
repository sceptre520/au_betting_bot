const cheerio = require('cheerio');
const got = require('got');

const updater = require('./savedata')

const bookmaker_key = 'jimmybet'
const bookmaker_title = 'Jimmybet'

const vgmObjs= [
                {
                    sport_key:'aussierules_afl',
                    sport_title:'AFL',
                    url:'https://www.jimmybet.com.au/Sport/Australian_Rules/AFL/Matches'
                },
                {
                    sport_key:'baseball_mlb',
                    sport_title:'MLB',
                    url:'https://www.jimmybet.com.au/Sport/Baseball/Major_League_Baseball/Matches'
                }
            ]

const getData = async (pmObj) => {
    const response = await got(pmObj.url);
    const $ = cheerio.load(response.body);

    var events = $('.framePanel')
    var len = events.length
    for (var x=0; x<len; x++) {
        var thead = $(events[x]).find('thead')
        var match_time = $(thead).find('th').children('span').text()
        var tds = $(thead).find('td')
        var markets = []
        var market_len = tds.length
        var indexes = []
        for(var y=0; y<market_len; y++) {
            var market_name = $(tds[y]).text()
            var tmp_len = markets.length
            var flag = -1
            for(var z=0; z<tmp_len; z++) {
                if(markets[z].key == convertMarketName(market_name)) {
                    indexes.push(z)
                    flag = 1
                    break
                }
            }
            if(flag == -1) {
                markets.push({
                    key: convertMarketName(market_name),
                    outcomes: []
                })
                indexes.push(markets.length-1)
            }
        }
        var tbody = $(events[x]).find('tbody')
        var outcomes = $(tbody).children('tr')
        var out_len = outcomes.length
        var team_names = []
        for(var y=0; y<out_len; y++) {
            var odds = $(outcomes[y]).children('td')
            var team_name = $(outcomes[y]).children('th').children('div').last().text()
            team_names.push(team_name)
            for(var z=0; z<market_len; z++) {
                var tmp_str = $(odds[z]).children('a').text()
                var tmp_arr = tmp_str.split('@')
                tmp_str = tmp_arr[tmp_arr.length-1]
                tmp_str = tmp_str.trim()
                
                markets[indexes[z]].outcomes.push({
                    name: team_name,
                    price: tmp_str
                })
            }
        }
        updater.savedata(pmObj.sport_key, pmObj.sport_title, bookmaker_key, bookmaker_title, team_names, convertTimeFormat(match_time), markets)
        // console.log(team_names)
        // console.log(convertTimeFormat(match_time))
        // console.log(JSON.stringify(markets))
        // console.log('------------   tbody   ---------------')
    }
}

function convertTimeFormat(pm_str) {
    var tmp_arr = pm_str.split('@')
    var dt_arr = tmp_arr[0].split(' ')
    var tm_str = tmp_arr[1].trim()
    var months = {
        'January':'01',
        'February':'02',
        'March':'03',
        'April':'04',
        'May':'05',
        'June':'06',
        'July':'07',
        'August':'08',
        'September':'09',
        'October':'10',
        'November':'11',
        'December':'12'
    };
    return dt_arr[3] + '-' + months[dt_arr[2]] + '-' + dt_arr[1] + 'T' + tm_str + ':00Z'
}

function convertMarketName(pm_name) {
    var dict = {
        'Win' : 'h2h',
        'Line' : 'spreads',
        'Draw' : 'draw',
        'O/U' : 'totals',
    }
    if (dict[pm_name])
        return dict[pm_name]
    else
        return pm_name
}

exports.run = () => {
    var tmp_len = vgmObjs.length
    for(var tmp_i=0; tmp_i<tmp_len; tmp_i++) {
        getData(vgmObjs[tmp_i])
    }
}
