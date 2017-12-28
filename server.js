'use strict';//rahulmr

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const app = express();
const Map = require('es6-map');
const myCoins = require('./Coins/jsonCoin');
const Q = require('q')
const dbAllCoinZ = require('./db/initialize');


var gUser = dbAllCoinZ.g_User;


const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

let uniqID;
let displayName;
var currency = "";

console.log("Value" + gUser)

// dbAllCoinZ.g_createRecord(gUser,{
//     displayName: "rahul",
//     uniqID: 1234,
//     curr: "INR"
// })


// dbAllCoinZ.g_UpdateInsert(gUser,{uniqID:123456},{
//     displayName: "mrrahul",
//     uniqID: 12345,
//     curr: "INR"
// })

var a = dbAllCoinZ.g_getRecords(gUser);
a.then(function (success) {
    console.log("Value" + JSON.stringify(success))
}, function (error) {
    console.log("Value" + JSON.stringify(error))
})


server.post('/getCoinValue', function (req, res) {


    // const app = new ApiAiApp({
    //     req,
    //     res
    // });

    //console.log(JSON.stringify(req.headers))
    //console.log(JSON.stringify(req.body))



    let result = req.body.result;
    let source = req.body.originalRequest.source


    console.log(result.metadata.intentName)
//    console.log(JSON.stringify((req.body).originalRequest.data.message.chat))





    if (source == "telegram") {
        displayName = (req.body).originalRequest.data.message.chat.username;
        uniqID = (req.body).originalRequest.data.message.chat.id
    }



    if (result.metadata.intentName == "getCoinValue") {


        getCurrency().then(function (mycurrency) {


            currency = mycurrency

            var oCoin = getCoinObject(result)
            oCoin.then(function (coinResult) {
                sendResult(source, true, coinResult, res)

            }).catch(function (err) {
                console.log("failed")
            });
        })

    }
    if (result.metadata.intentName == "ChangeCurrency") {
        var userCurrency = result.parameters["currency-name"];


        dbAllCoinZ.g_UpdateInsert(gUser, {
            uniqID: uniqID
        }, {
            displayName: displayName,
            uniqID: uniqID,
            curr: userCurrency
        })

        sendResult(source, false, null, res,"Currency is set to " + userCurrency)
        console.log("currency-name " + userCurrency)

    } else if (result.metadata.intentName == "Default Fallback Intent") {

        sendResult(req.body.originalRequest.source, false, null, res)

    }

});

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running... ");
});



function sendResult(type, success, coinResult, res, onlyNotification = "") {

    var text;
    var responseData
    console.log(type)
    if (type == "telegram") {

        if (success) {
            text = "\n\n`" + coinResult.CoinFN + "(" + coinResult.CoinSN + ")`" + "= " + "*" + coinResult.CoinValue + " " + coinResult.CoinCurrency + "*   "

        } else {
            //console.log(success)
            text = "*Coin cannot be identified.* \n` Message to add new coin.`"

        }
        if (onlyNotification != "") {
            text = onlyNotification
        }
        responseData = {
            "data": {
                "telegram": {
                    "text": text //\n\n["+link +"]",
                        ,
                    parse_mode: "markdown",
                    disable_web_page_preview: true,
                    "reply_markup": {
                        "keyboard": [
                            [{
                                "text": "BTC",
                                resize_keyboard: true

                            }, {
                                "text": "ETH",
                                resize_keyboard: true

                            }, {
                                "text": "XRP",
                                resize_keyboard: true

                            }, {
                                "text": "PINK",
                                resize_keyboard: true

                            }, {
                                "text": "DOGE",
                                resize_keyboard: true

                            }]

                        ],
                        resize_keyboard: true

                    }
                }
            }

        }

      

    }else if (type=="slack_testbot"){
      
      if (success) {
            text = "\n\n`" + coinResult.CoinFN + "(" + coinResult.CoinSN + ")`" + "= " + "*" + coinResult.CoinValue + " " + coinResult.CoinCurrency + "*   "

        } else {
            //console.log(success)
            text = "*Coin cannot be identified.* \n` Message to add new coin.`"

        }
     
      if (onlyNotification != "") {
            text = onlyNotification
        }
    responseData = {
            "data": {
                "slack": {
                    "text": text,
                    //image:coinResult.iu
                }
            }

        }
    
    }
  
  else if (type=="skype"){
      
      if (success) {
            text = "\n\n`" + coinResult.CoinFN + "(" + coinResult.CoinSN + ")`" + "= " + "*" + coinResult.CoinValue + " " + coinResult.CoinCurrency + "*   "

        } else {
            //console.log(success)
            text = "*Coin cannot be identified.* \n` Message to add new coin.`"

        }
     
      if (onlyNotification != "") {
            text = onlyNotification
        }
    responseData = {
            "data": {
                "skype": {
                    "text": text,
                    //image:coinResult.iu
                }
            }

        }
      console.log("skyppee")
    }
    res.send(responseData)
}





function getCurrency() {

    var deferred = Q.defer();
    dbAllCoinZ.g_getRecord(gUser, {
        uniqID: uniqID
    }).then(function (item) {
        console.log("item " + item)
        if (item) {
            console.log("Selected Currency " + item.curr)
            deferred.resolve(item.curr);
        } else {
            deferred.resolve("INR");

        }

    }, function (error) {})

    return deferred.promise;
}


function getCoinObject(result) {
    var speechOutput = "";;
    var cryptoCoin;
    var speechOP = "";

    var deferred = Q.defer();

    cryptoCoin = result.parameters.CryptoCoin;
    console.log("hello " + JSON.stringify(result.parameters))
    if (cryptoCoin == undefined || currency == undefined) {
        speechOP = "Coin or Currency cannot be identified.";

        deferred.reject(null);
    } else {
        cryptoCoin = myCoins.findCoin(cryptoCoin.toUpperCase());;


        var count = 1;
        if (result.parameters.count != "") {
            count = result.parameters.count
        }

        var BaseLinkUrl = "https://www.cryptocompare.com";
        var link = BaseLinkUrl + cryptoCoin[0].u;
        var ilink = BaseLinkUrl + cryptoCoin[0].iu;
        var baseUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
        var parsedUrl = baseUrl + cryptoCoin[0].n + "&tsyms=" + currency
        var oCoin;

        console.log(parsedUrl);

        var request = require('request');
        request(parsedUrl, function (error, response, body) {

            var JSONResponse = JSON.parse(response.body);
            //console.log("JSON Coin Value :"+cryptoCoin[0].n+ ":"+ JSONResponse[cryptoCoin[0].n]);
            var coinValue = JSONResponse[cryptoCoin[0].n.toUpperCase()][currency];
            var speechOP = ""
            //console.log("CV" + coinValue);
            if (coinValue != undefined) {
                coinValue = (count * coinValue).toFixed(5);

                oCoin = {
                    CoinFN: cryptoCoin[0].c,
                    CoinSN: cryptoCoin[0].n,
                    CoinImg: ilink,
                    CoinURL: link,
                    CoinValue: coinValue,
                    CoinCurrency: currency
                }
                deferred.resolve(oCoin);
            } else {
                oCoin = null;
                deferred.reject(null);
            }

            //console.log(speechOP);

        })
    }
    return deferred.promise;
}