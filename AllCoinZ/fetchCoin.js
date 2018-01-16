const coinURL = "https://min-api.cryptocompare.com/data/all/coinlist"
const Q = require('q')
const request = require('request');
// const userInfo = require('./db/initialize');

const jsCoin = require('../AllCoinZ/jsonCoin')
// let gUser = userInfo.m_User;

function fetchCoins() {}

function updateCoins(optype) {
    var deferred = Q.defer();
    request(coinURL, function (error, response, body) {


        var JSONResponse = JSON.parse(response.body);
        p = JSONResponse.Data;

        var coinarray = [];
        CollectionEntityJSON = []
        var csvOp
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                //console.log(key + " -> " + p[key]);
                keyv = {
                    u: p[key].Url,
                    iu: p[key].ImageUrl,
                    n: p[key].Name,
                    c: p[key].CoinName
                }

                var entityJSON = {
                    "value": parse(p[key].Name),
                    "synonyms": [
                        parse(p[key].CoinName) + "," + parse(p[key].Name)
                    ]
                }
                csvOp = csvOp + "\n" + parse(p[key].Name) + "\"" + "," + "\"" + parse(p[key].CoinName) + "\"" + "," + "\"" + parse(p[key].Name) + "\""

                CollectionEntityJSON.push(entityJSON);
                coinarray.push(keyv)
            }

        }

        csvOp = csvOp.split('undefined').join('')

        var jsonCoin = {
            "Coins": coinarray
        };
        var BaseLinkUrl = "https://www.cryptocompare.com";
        console.log(JSON.stringify(jsonCoin));
        var jsonv = JSON.stringify(jsonCoin)

        var type = "";
        if (optype != undefined) {
            if (optype.toLowerCase() == "csv") {
                type = csvOp
            }
            if (optype.toLowerCase() == "json") {
                type = JSON.stringify(CollectionEntityJSON)
            }
            jsCoin.m_setCoins(jsonv)
            return deferred.resolve(type)
        }


/*      var fs = require('fs');
        fs.writeFile("AllCryptoCoinZ/data/coinentityCSV.txt", csvOp, function (err) {
            if (err) {
                console.log(err);
                return deferred.reject(err)
            }
            fs.writeFile("AllCryptoCoinZ/data/coinentityJSOns.txt", JSON.stringify(CollectionEntityJSON), function (err) {
                if (err) {
                    console.log(err);
                    return deferred.reject(err)
                }
                fs.writeFile("AllCryptoCoinZ/data/coin.txt", jsonv, function (err) {
                    if (err) {
                        console.log(err);
                        return deferred.reject(err)
                    }
                    var type = "";
                    if (optype != undefined) {
                        if (optype.toLowerCase() == "csv") {
                            type = csvOp
                        }
                        if (optype.toLowerCase() == "json") {
                            type = JSON.stringify(CollectionEntityJSON)
                        }
                        jsCoin.m_setCoins(jsonv)
                    }

                    return deferred.resolve("Succesfully completed the operations\n" + type)
                    console.log("The file was saved!");
                });
                console.log("The file was saved!");
            });
            console.log("The file was saved!");
        });
*/

    })
    return deferred.promise
}

function parse(coin) {

    return coin.split('(').join('').split(')').join('').split('_').join('').split('@').join('')

}
module.exports = {
    m_fetchCoins: fetchCoins,
    m_updateCoins: updateCoins
}