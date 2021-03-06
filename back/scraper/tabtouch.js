const cheerio = require('cheerio');
const got = require('got');

const updater = require('./savedata')

const bookmaker_key = 'tabtouch'
const bookmaker_title = 'Tabtouch'

const vgmObjs= [
    {
        sport_key:'aussierules_afl',
        sport_title:'AFL',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=145&groupcode=--&groupname=Line'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=10000&groupname=Total-Score-Over-Under'
            }
        ]
    },
    {
        sport_key:'baseball_mlb',
        sport_title:'MLB',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=110&groupcode=--&groupname=Match-Result'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=10000&groupname=Handicap-Betting'
            },
            {
                key:'totals',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=10000&groupname=Total-Runs'
            }
        ]
    },
    {
        sport_key:'rugbyleague_nrl',
        sport_title:'Aussie Rugby League',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/rugby-league/nrl/30923/1042714?tourname=Matches&tourseq=2800500&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/rugby-league/nrl/30923/1042714?tourname=Matches&tourseq=2800500&groupid=145&groupcode=--&groupname=Line'
            },
            {
                key:'totals',
                url:'https://www.tabtouch.com.au/sports/rugby-league/nrl/30923/1042714?tourname=Matches&tourseq=2800500&groupid=10000&groupname=Total-Match-Points'
            }
        ]
    },
    {
        sport_key:'basketball_nba',
        sport_title:'NBA',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/basketball/nba/30947/1042796?tourname=Matches&tourseq=2806072&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/basketball/nba/30947/1042796?tourname=Matches&tourseq=2806072&groupid=145&groupcode=--&groupname=Line'
            },
            {
                key:'totals',
                url:'https://www.tabtouch.com.au/sports/basketball/nba/30947/1042796?tourname=Matches&tourseq=2806072&groupid=240&groupcode=--&groupname=Game-Total'
            }
        ]
    },
    {
        sport_key:'americanfootball_nfl',
        sport_title:'US Football',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/american-football/nfl/30944/1042743?tourname=Matches&tourseq=2807197&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/american-football/nfl/30944/1042743?tourname=Matches&tourseq=2807197&groupid=145&groupcode=--&groupname=Line'
            },
            {
                key:'totals',
                url:'https://www.tabtouch.com.au/sports/american-football/nfl/30944/1042743?tourname=Matches&tourseq=2807197&groupid=240&groupcode=--&groupname=Game-Total'
            }
        ]
    },
    {
        sport_key:'rugbyunion_rul',
        sport_title:'Club Pro D2',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/rugby-union/club/30931/3169919?tourname=French-Pro-D2&tourseq=2806579&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spreads',
                url:'https://www.tabtouch.com.au/sports/rugby-union/club/30931/3169919?tourname=French-Pro-D2&tourseq=2806579&groupid=145&groupcode=--&groupname=Line'
            }
        ]
    }
]

const getData = async (pmind, pmlen, pmObjs, callback) => {
    if(pmind < pmlen) {
        var pmObj = pmObjs[pmind]
        markets = {}
        var mk_len = pmObj.markets.length
        for(var mk_i=0; mk_i<mk_len; mk_i++) {
            const response = await got(pmObj.markets[mk_i].url);
            const $ = cheerio.load(response.body);

            var mainDiv = $('#propResult')
            var tbody = $(mainDiv).children('table').children('tbody')
            var trs = $(tbody).children('tr')
            var tr_len = trs.length
            var tpm_i=0;
            while(tpm_i<tr_len) {
                var matchname = $(trs[tpm_i]).children('td').children('strong').text()
                var matchtime = $(trs[tpm_i]).children('td').children('time').text()
                matchtime = convertTimeFormat(matchtime)
                tpm_i ++;
                var teams = []
                var odds = []
                var outcomes = []
                while(tpm_i<tr_len && $(trs[tpm_i]).children('td').attr('colspan') == undefined) {
                    var team_name = $(trs[tpm_i]).children('td').first().next().text()
                    var odd_val = $(trs[tpm_i]).children('td').last().children('a').children('span').text()
                    teams.push(team_name)
                    odds.push(odd_val)
                    tpm_i ++
                    outcomes.push({
                        name: team_name,
                        price: odd_val
                    })
                }
                var match_formated_name = matchname
                var tmp_arr = matchname.split(' - ')
                var teams = []
                tmp_arr = tmp_arr[0]
                tmp_arr = tmp_arr.split(' v ')
                if(tmp_arr.length < 2) {
                    tmp_arr = tmp_arr[0].split(' @ ')
                }
                teams = tmp_arr
                if(tmp_arr.length == 2) {
                    match_formated_name = tmp_arr[0] + tmp_arr[1]
                }
                else {
                    match_formated_name = tmp_arr[0]
                }
                match_formated_name = match_formated_name.split(' ').join('');
                
                if (markets[match_formated_name] == null) {
                    markets[match_formated_name] = {
                        teams:teams,
                        match_time:matchtime,
                        markets:[]
                    }
                }
                markets[match_formated_name].markets.push({
                    key: pmObj.markets[mk_i].key,
                    outcomes: outcomes
                })
            }
        }
        var len = 0
        var pm_data = []
        for (x in markets) {
            // updater.savedata(pmObj.sport_key, pmObj.sport_title, bookmaker_key, bookmaker_title, markets[x].teams, markets[x].match_time, markets[x].markets)
            pm_data.push({
                teamnames: markets[x].teams,
                start_time: markets[x].match_time,
                market_json: markets[x].markets,
            })
            len ++
        }
        updater.savedata(pmObj.sport_key, pmObj.sport_title, bookmaker_key, bookmaker_title, pm_data)

        getData(pmind+1, pmlen, pmObjs, callback)
    }
    else {
        callback()
    }
}

function convertTimeFormat(pm_str) {
    var tmp_arr = pm_str.split(',')
    var dt_arr = tmp_arr[1].trim().split(' ')
    var tm_str = tmp_arr[0].trim()
    var months = {
        'Jan':'01',
        'Feb':'02',
        'Mar':'03',
        'Apr':'04',
        'May':'05',
        'Jun':'06',
        'Jul':'07',
        'Aug':'08',
        'Sep':'09',
        'Oct':'10',
        'Nov':'11',
        'Dec':'12'
    };
    return dt_arr[2] + '-' + months[dt_arr[1]] + '-' + dt_arr[0] + 'T' + tm_str + ':00Z'
}

exports.run = () => {
    getData(0, vgmObjs.length, vgmObjs, function() {
        // console.log('--- Tabtouch finish ---')
    })
    
    // var tmp_len = vgmObjs.length
    // for(var tmp_i=0; tmp_i<tmp_len; tmp_i++) {
    //     setTimeout( function (tmp_i) {
    //         getData(vgmObjs[tmp_i])
    //     }, 2000*tmp_i, tmp_i)
    // }
}
