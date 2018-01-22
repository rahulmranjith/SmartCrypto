const Q = require('q')
const dbAllCoinZ = require('../db/initialize');
var gUser = dbAllCoinZ.g_User;
const myCoins = require('../AllCoinZ/jsonCoin');

var platform;
let myCurrency;

var HttpResponse;

function setHttpResponse(HttpRes){
    HttpResponse=HttpRes
}
function getHttpResponse(){
   return  HttpResponse;
}

function removeCurrencySymbols(currency) {
    //console.log(currency)
    return currency.PRICE.split(',').join("").split(currency.TOSYMBOL).join("").split(currency.FROMSYMBOL).join("")
}



function deleteUser(id) {
    var deferred = Q.defer();
    dbAllCoinZ.g_deleteUser(gUser,id).then(function (item) {
        deferred.resolve(item)
    }, function (error) {
        console.log("Could not fetch" + JSON.stringify(error))
        deferred.reject("Could not fetch" + JSON.stringify(error))

    })

    return deferred.promise;
}

function getUsers() {
    var deferred = Q.defer();
    dbAllCoinZ.g_getRecords(gUser).then(function (item) {

        deferred.resolve(item)

    }, function (error) {
        console.log("Could not fetch" + JSON.stringify(error))
        deferred.reject("Could not fetch" + JSON.stringify(error))

    })

    return deferred.promise;
}


function getCurrency(uniqID) {

    var deferred = Q.defer();
    dbAllCoinZ.g_getRecord(gUser, {
        uniqID: uniqID
    }).then(function (item) {
        ////console.log("item " + item)
        if (item) {

            if (item.curr == null) {
                myCurrency = "INR"
            } else {
                myCurrency = item.curr
            }
            deferred.resolve(item.curr);
        } else {
            myCurrency = "INR"
            deferred.resolve("INR");

        }

    }, function (error) {
        console.log("Currency fetch error" + JSON.stringify(error))
    })

    return deferred.promise;
}


function getDefaultCardMessageResponse(platform, messageContents) {

    var message = {
        "messages": [{
            "buttons": [{
                "postback": "https://sites.google.com/view/allcoinz/home",
                "text": "AllCoinZ"
            }],
            //"buttons": messageContents.buttons,
            //"imageUrl": "https://sites.google.com/view/allcoinz/home",
            "platform": platform,
            "subtitle": "All CoinZ",
            "title": "All CoinZ",
            "type": 1
        }]
    }
    //console.log(messageContents.subtitle)
    return message;

}

function getSimpleMessageObject(message) {

    var message = {
        "messages": [{
            "speech": message,
            "type": 0,
            "text": "AllCryptoCoinZ",
            "parse_mode": "Markdown"
        }]
    }
    return message;
}



function getCoinObject(coinsCount) {
    var speechOutput = "";;
    var cryptoCoin;
    var speechOP = "";



    var deferred = Q.defer();

    cryptoCoin = coinsCount.CryptoCoin;
    ////console.log("hello " + JSON.stringify(result.parameters))

    console.log("myCurrency" + myCurrency)
    if (cryptoCoin == undefined || myCurrency == undefined) {
        speechOP = "Coin or Currency cannot be identified.";

        deferred.reject(null);
    } else {
        //console.log("cryptocoins" + cryptoCoin)

        //          for (const key of Object.keys(myCoins)) {
        //             //console.log(key, myCoins[key]);
        //         }

        console.log("get coin val" + cryptoCoin)
        cryptoCoin = myCoins.m_findCoin(cryptoCoin.toUpperCase());;


        var BaseLinkUrl = "https://www.cryptocompare.com";
        var link = BaseLinkUrl + cryptoCoin[0].u;
        var ilink = BaseLinkUrl + cryptoCoin[0].iu;
        //var baseUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
        //var parsedUrl = baseUrl + cryptoCoin[0].n + "&tsyms=" + currency

        var baseUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=';
        var parsedUrl = baseUrl + cryptoCoin[0].n + "&tsyms=BTC," + myCurrency + "&e=CCCAGG"
        var oCoin;

        //console.log(parsedUrl);

        var request = require('request');
        request(parsedUrl, function (error, response, body) {

            //console.log("JSON Response" + JSON.stringify(response.body))
            var JSONResponse = JSON.parse(response.body);
            ////console.log("JSON Coin Value :"+cryptoCoin[0].n+ ":"+ JSONResponse[cryptoCoin[0].n]);
            //console.log(JSONResponse);
            var coinValue = "" // JSONResponse[cryptoCoin[0].n.toUpperCase()][currency];
            var speechOP = ""
            ////console.log("CV" + coinValue);


            if (coinValue != undefined) {
                oCoin = {
                    CoinFN: cryptoCoin[0].c,
                    CoinSN: cryptoCoin[0].n,
                    CoinImg: ilink,
                    CoinURL: link,
                    CoinValue: JSONResponse,
                    CoinCurrency: myCurrency,
                    CoinCount: coinsCount.count
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




module.exports = {
    m_removeCurrencySymbols: removeCurrencySymbols,
    m_getCurrency: getCurrency,
    m_getSimpleMessageObject: getSimpleMessageObject,
    m_getDefaultCardMessageResponse: getDefaultCardMessageResponse,
    m_platform: platform,
    m_getCoinObject: getCoinObject,
    m_myCurrency: myCurrency,
    m_getUsers: getUsers,
    m_deleteUser:deleteUser,
    m_setHttpResponse:setHttpResponse,
    m_getHttpResponse:getHttpResponse,
   
}