const nodemailer = require('nodemailer')

saveLastPrice = function(old_json, new_json, trigger) {
    ret = {msg:[]}
    if(old_json!=null && old_json.bookmakers!=null) {
        for (x in old_json.bookmakers) {
            bookmaker = old_json.bookmakers[x].key
            index_bookmaker = -1
            for (i in new_json.bookmakers) {
                if(new_json.bookmakers[i].key == bookmaker) index_bookmaker = i
            }
            if (index_bookmaker == -1) continue
            markets = old_json.bookmakers[x].markets
            for(y in markets) {
                index_market = -1
                for(j in new_json.bookmakers[index_bookmaker].markets) {
                    if (new_json.bookmakers[index_bookmaker].markets[j].key == markets[y].key) index_market = j
                }
                if (index_market == -1) continue

                outcomes = markets[y].outcomes
                for(z in outcomes) {
                    for (k in new_json.bookmakers[index_bookmaker].markets[index_market].outcomes) {
                        if (new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].name == outcomes[z].name) {
                            if (validityPrice(new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].price, outcomes[z].price, trigger, new_json.bookmakers[index_bookmaker].key, new_json.commence_time)) {
                                if (bookmaker=='tab' || bookmaker=='ladbrokes' || bookmaker=='sportsbet' || bookmaker=='pointsbetau' || bookmaker=='unibet') {
                                    var point = ''
                                    if(new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].point) point = new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].point
                                    ret.msg.push({
                                        bookmaker: bookmaker,
                                        matchs: new_json.home_team + " vs " + new_json.away_team,
                                        sports: new_json.sport_key,
                                        market: markets[y].key,
                                        outcome: outcomes[z].name,
                                        point: point,
                                        from: outcomes[z].price,
                                        to: new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].price
                                    })
                                }
                            }
                            new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].last_price = outcomes[z].price
                        }
                    }
                }
            }
        }
    }
    ret.data = new_json
    return ret
}

validityPrice = function (a, b, trigger=0.4, bk_mk_key='', time_str=null) {
    var match_time = new Date(time_str)
    var nw = new Date()
    switch(bk_mk_key) {
        case 'jimmybet':
            match_time.setHours(match_time.getHours() - 10)
            break
        case 'tabtouch':
            match_time.setHours(match_time.getHours() - 8)
            break
    }

    if (time_str!=null && match_time>nw && Math.abs(a - b) > trigger) {
        console.log('Match time filter debug', bk_mk_key, time_str)
        return true
    }
    return false
}

sendGmail = function(mail, pass, data) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: mail,
            pass: pass
        },
    });

    transporter.verify().then(console.log).catch(console.error);

    console.log(`mail auth ${mail}, ${pass}`)

    var msg = ""
    for (x in data) {
        var bookmaker = data[x].bookmaker
        bookmaker = bookmaker.charAt(0).toUpperCase() + bookmaker.slice(1)
        var match = data[x].matchs
        var sports = data[x].sports
        sports = sports.charAt(0).toUpperCase() + sports.slice(1)
        sports = sports.replace(/_/g, ' ')
        var market = data[x].market
        var outcome = data[x].outcome
        if(data[x].point && data[x].point != '') outcome = outcome + ' ' + data[x].point
        var from = data[x].from
        var to = data[x].to
        var tmp = `${bookmaker} ${sports} ${match}\n${market} ${outcome}'s price was change from ${from} to ${to}.\n`
        msg += tmp
    }

    var mailOptions = {
        from: mail,
        to: mail,
        subject: 'Betting Bot Notification',
        text: msg
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // console.log(msg)
}

exports.saveLastPrice = saveLastPrice
exports.validityPrice = validityPrice
exports.sendGmail = sendGmail