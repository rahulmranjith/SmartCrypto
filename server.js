'use strict'; //rahulmr

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const app = express();
const Map = require('es6-map');
const myCoins = require('./AllCoinZ/jsonCoin');
const Q = require('q')
const dbAllCoinZ = require('./db/initialize');

const telegramAPI = require('./AllCoinZ/telegram')
const Util = require('./AllCoinZ/util')

const GenProc = require('./AllCoinZ/GenericProcess')

var gUser = dbAllCoinZ.g_User;


const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

let uniqID;
let displayName;
var currency = "";
var exchange = "CCCAGG"
var platform;


server.post('/getCoinValue', function (req, res) {






    let result = req.body.result;
    let source = req.body.originalRequest.source


    ////console.log(result.metadata.intentName)
    //console.log(JSON.stringify(req.body))


    switch (source) {
        case "telegram":
            platform = "telegram"
            displayName = (req.body).originalRequest.data.message.chat.username;
            uniqID = (req.body).originalRequest.data.message.chat.id
            break;
        case "slack_testbot":
            platform = "slack"
            break;
        case "skype":
            platform = "skype"
            break;
        default:
            platform = "telegram"
    }
   Util.m_platform=platform
  
  
  
    if (result.metadata.intentName == "Default Welcome Intent") {
        var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform,displayName)
        sendDialogflowResponse(res, welcomeMessageResponse)
    }

    else if (result.metadata.intentName == "getCoinValue") {

        Util.m_getCurrency(uniqID).then(function (mycurrency) {
            currency = mycurrency
            var oCoin = getCoinObject(result)
            oCoin.then(function (coinResult) {
                sendResult(true, coinResult, res)
            }).catch(function (err) {
                console.log("m_getCurrency method failed")
            });
        })

    }
    else if (result.metadata.intentName == "ChangeCurrency") {
        var userCurrency = result.parameters["currency-name"];
        if (userCurrency == "" && result.parameters["CryptoCoin"] !== "") {
            userCurrency = result.parameters["CryptoCoin"]
        }
        if (userCurrency == "") {
            return sendDialogflowResponse(res, Util.m_getSimpleMessageObject("Currency could not be identified.No changes are made :("))
        }

        dbAllCoinZ.g_UpdateInsert(gUser, {
            uniqID: uniqID
        }, {
            displayName: displayName,
            uniqID: uniqID,
            curr: userCurrency
        }).then(function () {
            sendDialogflowResponse(res, Util.m_getSimpleMessageObject("Default currency has been set to " + userCurrency))
        })

    } else if (result.metadata.intentName == "Default Fallback Intent") {
        sendResult(false, null, res)
    }

});

server.listen((process.env.PORT || 8000), function () {
    //console.log("Server is up and running... ");
});

function sendDialogflowResponse(res, result) {

    res.send(result)

}

function sendResult(success, coinResult, res) {

    var text;
    var responseData
       
    var responseData = GenProc.m_getResponseMessage(platform,coinResult)
    
    sendDialogflowResponse(res, responseData)
}




 
function getCoinObject(result) {
    var speechOutput = "";;
    var cryptoCoin;
    var speechOP = "";


    var deferred = Q.defer();

    cryptoCoin = result.parameters.CryptoCoin;
    ////console.log("hello " + JSON.stringify(result.parameters))
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
        //var baseUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
        //var parsedUrl = baseUrl + cryptoCoin[0].n + "&tsyms=" + currency

        var baseUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=';
        var parsedUrl = baseUrl + cryptoCoin[0].n + "&tsyms=BTC,INR," + currency + "&e=CCCAGG"
        var oCoin;

        //console.log(parsedUrl);

        var request = require('request');
        request(parsedUrl, function (error, response, body) {

            var JSONResponse = JSON.parse(response.body);
            ////console.log("JSON Coin Value :"+cryptoCoin[0].n+ ":"+ JSONResponse[cryptoCoin[0].n]);
            //console.log(JSONResponse);
            var coinValue = "" // JSONResponse[cryptoCoin[0].n.toUpperCase()][currency];
            var speechOP = ""
            ////console.log("CV" + coinValue);
            if (coinValue != undefined) {
                coinValue = (count * coinValue).toFixed(5);

                oCoin = {
                    CoinFN: cryptoCoin[0].c,
                    CoinSN: cryptoCoin[0].n,
                    CoinImg: ilink,
                    CoinURL: link,
                    CoinValue: JSONResponse,
                    CoinCurrency: currency,
                    CoinCount: count
                }
                deferred.resolve(oCoin);
            } else {
                oCoin = null;
                deferred.reject(null);
            }

            ////console.log(speechOP);

        })
    }
    return deferred.promise;
}

