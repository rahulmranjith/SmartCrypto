

const Q = require('q')
const dbAllCoinZ = require('../db/initialize');
var gUser = dbAllCoinZ.g_User;

var platform ;


function removeCurrencySymbols(currency) {
    console.log(currency)
    return currency.PRICE.split(',').join("").split(currency.TOSYMBOL).join("").split(currency.FROMSYMBOL).join("")
}

function getCurrency(uniqID) {

    var deferred = Q.defer();
    dbAllCoinZ.g_getRecord(gUser, {
        uniqID: uniqID
    }).then(function (item) {
        ////console.log("item " + item)
        if (item) {
          
            deferred.resolve(item.curr);
        } else {
            deferred.resolve("INR");

        }

    }, function (error) {})

    return deferred.promise;
}


function getDefaultCardMessageResponse(platform) {

    var message = {
        "messages": [{
            "buttons": [{
                "postback": "https://sites.google.com/view/allcoinz/home",
                "text": "AllCoinZ"
            }],
            //"imageUrl": "https://sites.google.com/view/allcoinz/home",
            "platform": platform,
            "subtitle": "Welcome to AllCoinZ",
            "title": "AllCoinZ",
            "type": 1
        }]
    }
    return message;

}

function getSimpleMessageObject(message) {

    var message = {
        "messages": [{
            "speech": message,
            "type": 0
        }]
    }
    return message;
}



module.exports = {

    m_removeCurrencySymbols: removeCurrencySymbols,
    m_getCurrency:getCurrency,
    m_getSimpleMessageObject:getSimpleMessageObject,
  m_getDefaultCardMessageResponse:getDefaultCardMessageResponse,
  m_platform:platform
}