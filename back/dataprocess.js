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

sendGmail = function(data) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'denysshowdev@gmail.com',
            pass: '804273821!w'
        },
    });

    var mailOptions = {
        from: 'denysshowdev@gmail.com',
        to: 'denysshowdev@gmail.com',
        subject: 'title',
        text: 'msg'
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