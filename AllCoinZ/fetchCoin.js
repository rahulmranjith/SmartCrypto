const coinURL = "https://min-api.cryptocompare.com/data/all/coinlist"
const Q = require('q')
const request = require('request');
// const userInfo = require('./db/initialize');

const jsCoin = require('../AllCoinZ/jsonCoin')
// let gUser = userInfo.m_User;

function fetchCoins() {}
var alexa = [];

function updateCoins(optype) {
    var deferred = Q.defer();
    request(coinURL, function (error, response, body) {

        var keyv
        var JSONResponse = JSON.parse(response.body);
        var p = JSONResponse.Data;

        var coinarray = [];
        var CollectionEntityJSON = []
        var csvOp;

        var alexajson;
        var notUpdate = optype != undefined && optype != "update"
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                //console.log(key + " -> " + p[key]);
                keyv = {
                    u: p[key].Url,
                    iu: p[key].ImageUrl,
                    n: p[key].Name,
                    c: p[key].CoinName
                }
                coinarray.push(keyv)
                if (notUpdate) {

                    //csvOp = csvOp + "\n" + parse(p[key].Name) + "\"" + "," + "\"" + parse(p[key].CoinName) + "\"" + "," + "\"" + parse(p[key].Name) + "\""

                    csvOp = csvOp + "\n" + "\"" + parse(p[key].Name) + "\"" + "," + "\"" + parse(p[key].CoinName) + "\"" //+ "," + "\"" + parse(p[key].Name) + "\""
                    csvOp = csvOp + "\n" + "\"" + parse(p[key].Name) + "\"" + "," + "\"" + parse(p[key].Name) + "\"" //+ "," + "\"" + parse(p[key].Name) + "\""

                    var entityJSON = {
                        "value": parse(p[key].Name),
                        "synonyms": [
                            parse(p[key].CoinName) + "," + parse(p[key].Name)
                        ]
                    }
                    CollectionEntityJSON.push(entityJSON);

                    if (!isDuplicate(parse(p[key].CoinName))) {
                        alexa.push({
                            "id": null,
                            "name": {
                                "value": parse(p[key].CoinName),
                                //"synonyms": [parse(p[key].Name) + ',' + parse(p[key].CoinName)]
                            }
                        });
                    }
                    if (!isDuplicate(parse(p[key].Name))) {
                        alexa.push({
                            "id": null,
                            "name": {
                                "value": parse(p[key].Name),
                                // "synonyms": [parse(p[key].CoinName) + ',' + parse(p[key].Name)]
                            }
                        });
                    }
                }

            }

        }



        var jsonCoin = {
            "Coins": coinarray
        };
        var BaseLinkUrl = "https://www.cryptocompare.com";
        //console.log(JSON.stringify(jsonCoin));
        var jsonv = JSON.stringify(jsonCoin)

        var type = "";
        if (optype != undefined && optype != "update") {
            if (optype.toLowerCase() == "csv") {
                csvOp = csvOp.split('undefined').join('')
                type = csvOp
            }
            if (optype.toLowerCase() == "json") {
                type = JSON.stringify(CollectionEntityJSON)
            }
            if (optype.toLowerCase() == "alexa") {
                type = alexa
            }

            return deferred.resolve(type)
        }
        jsCoin.m_setCoins(jsonv)

        var fs = require('fs');
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


    })
    return deferred.promise
}

function isDuplicate(CoinName) {

    return (alexa.find(function (coin) {
        return ((coin.name.value.toLowerCase()).trim() == (CoinName.toLowerCase()).trim())
    }) != undefined)

}

function parse(coin) {

    return coin.split('(').join('').split(')').join('').split('_').join('').split('@').join('')

}
module.exports = {
    m_fetchCoins: fetchCoins,
    m_updateCoins: updateCoins
}