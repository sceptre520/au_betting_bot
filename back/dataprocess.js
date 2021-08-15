const nodemailer = require('nodemailer')

saveLastPrice = function(old_json, new_json) {
    ret = {msg:[]}
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
                        if (validityPrice(new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].price, outcomes[z].price))
                            ret.msg.push({
                                bookmaker: bookmaker,
                                match: new_json.home_team + " vs " + new_json.away_team,
                                sports: new_json.sport_key,
                                market: markets[y].key,
                                outcome: outcomes[z].name,
                                from: outcomes[z].price,
                                to: new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].price
                            })
                        new_json.bookmakers[index_bookmaker].markets[index_market].outcomes[k].last_price = outcomes[z].price
                    }
                }
            }
        }
    }
    ret.data = new_json
    return ret
}

validityPrice = function (a, b) {
    if (Math.abs(a - b) > 0.4) return true
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
}

exports.saveLastPrice = saveLastPrice
exports.validityPrice = validityPrice
exports.sendGmail = sendGmail