const Util = require('../AllCoinZ/util')
const telegram = require('../AllCoinZ/telegram')
const Google = require('../AllCoinZ/Google')
const slack = require('../AllCoinZ/slack')
const Q = require('q')
const dbAllCoinZ = require('../db/initialize');
var gUser = dbAllCoinZ.g_User;
<<<<<<< HEAD

=======
const myCoins = require('../AllCoinZ/jsonCoin');
 
>>>>>>> origin/glitch
function getWelcomeMessage(platform, displayName) {
    console.log(Util.m_platform)
    switch (Util.m_platform) {
        case "telegram":
            telegram.m_formatWelcomeMessage(displayName);
            break;
        case "slack":
            slack.m_formatWelcomeMessage(displayName);           
            break;
        case "google":
            Google.m_formatWelcomeMessage(displayName);        
            break;
        default:
            "Hello Welcome to AllCryptoCoinZ"
    } 
}

function sendSimpleMessage(message){
    
    console.log(Util.m_platform)
    switch (Util.m_platform) {
        case "telegram":
            telegram.m_sendSimpleMessage(callPayLoadFormatMessage(message));
            break;
        case "slack":
            slack.m_sendSimpleMessage(callPayLoadFormatMessage(message));        
            break;
        case "google":
            Google.m_sendSimpleMessage(message);     
            break;
        default:
            "Hello Welcome to AllCryptoCoinZ"
    } 
<<<<<<< HEAD


=======


>>>>>>> origin/glitch
}

function sendCoinResponse(coinResult) {

    var responseMessage
    console.log(Util.m_platform)
    switch (Util.m_platform) {
        case "telegram":
            telegram.m_ResponseMessage(coinResult);
            break;
        case "slack":
             slack.m_ResponseMessage(coinResult);
            break;
        case "skype":
            telegram.m_ResponseMessage(coinResult);
            break;
        case "google":
            Google.m_ResponseMessage(coinResult);
            break;
        default:
            "Please try again !!!"


    }
    return responseMessage
}

function SyncPortfolio(userInfo, gapp) {


    var deferred = Q.defer();

    var portfolio;
    var cryptoCoin = gapp.getArgument("CryptoCoin");
    var newQuantity = gapp.getArgument("number");
     
    var BuySell = (gapp.getArgument("BuySell").toUpperCase() == "B" )
    var userInfoData;

    dbAllCoinZ.g_getRecord(gUser, {
        uniqID: userInfo.uniqID
    }).then(function (item) {

        var coinQuantity;
        var updatedQuantity
         var updatetext="added";

        //console.log("items" + item);
        if (item == null) {
            userInfoData = {
                displayName: userInfo.displayName,
                uniqID: userInfo.uniqID,
                curr: "INR",
                portfolio: JSON.stringify({
                    [cryptoCoin]: newQuantity
                })

            }
            //console.log(JSON.stringify(item))

        } else {
            var currentPortfolio = JSON.parse(item.portfolio)
           
            if (currentPortfolio != null) {

                if (currentPortfolio[cryptoCoin] == undefined) {
                    currentPortfolio[cryptoCoin] = newQuantity;
                } else {
                    var updatedQuantity = 1;
                    coinQuantity = currentPortfolio[cryptoCoin]

                    if (BuySell) {
                      updatetext="added"
                        updatedQuantity = +newQuantity + +coinQuantity;
                    } else {
                        updatetext="removed"
                        updatedQuantity = +coinQuantity - newQuantity;
                    }
                    currentPortfolio[cryptoCoin] = updatedQuantity
                }
                userInfoData = {
                    displayName: item.displayName,
                    uniqID: item.uniqID,
                    curr: item.curr,
                    portfolio: JSON.stringify(currentPortfolio)
                }
            } else {
                userInfoData = {
                    displayName: userInfo.displayName,
                    uniqID: userInfo.uniqID,
                    curr: "INR",
                    portfolio: JSON.stringify({
                        [cryptoCoin]: newQuantity
                    })
                }
            }
        }

        dbAllCoinZ.g_UpdateInsert(gUser, {
            uniqID: userInfo.uniqID
        }, userInfoData).then(function () {
      

            
          
    switch (Util.m_platform) {
        case "telegram":
        case "slack":
             sendSimpleMessage("Portfolio Details\n`"+ newQuantity + " " + cryptoCoin + " has been " +updatetext+" successfully !!!`")
            break;
        case "google":
             sendSimpleMessage(newQuantity + " " + cryptoCoin + " has been " +updatetext+" successfully !!!");            
            break;
        default:
            "Hello Welcome to AllCoinZ"
            }
          
           //deferred.resolve(callPayLoadFormatMessage("Portfolio Details\n`"+ newQuantity + " " + cryptoCoin + " has been " +updatetext+" successfully !!!`"))
  
          //         deferred.resolve(Util.m_getDefaultCardMessageResponse(Util.m_platform, {
    //     subtitle:"`"+ newQuantity + " " + cryptoCoin + " has been " +updatetext+" successfully !!!`",
    //     title: "Portfolio Details",
    //     buttons: []
    // }))
            //console.log("updated the portfolio");
        }, function (error) {
            deferred.reject(error)
        })
    })

    return deferred.promise;
}


function callPayLoadFormatMessage(message){
var responseMessage
    switch (Util.m_platform) {
        case "telegram":
            responseMessage = telegram.m_getPayLoadMessage(message);
            break;
        case "slack":
            responseMessage = slack.m_getPayLoadMessage(message);
            break;
        case "skype":
            responseMessage = telegram.m_getPayLoadMessage(message);
            break;
        default:
            "Please try again !!!"
  }

return responseMessage;

}


function getPortfolio(userInfo) {
    var deferred = Q.defer();
    dbAllCoinZ.g_getRecord(gUser, {
        uniqID: userInfo.uniqID
    }).then(function (result) {

        if (result == null) {
            switch (Util.m_platform) {
                case "telegram","slack", "skype":
                     return deferred.reject("`Please create a new portfolio. Check help !!`")
                    break;
                case "google":
                    Google.sendPortfolioUpdate("Please create a new portfolio. Check help !!!");
                    break;
                default:
                    "Please try again !!!"
        
        
            }    
           
        }
        let myPortfolio = result.portfolio;
        Util.m_myCurrency = result.curr;
        if (myPortfolio == null) {} else {
            //console.log(JSON.parse(myPortfolio));

            deferred.resolve(JSON.parse(myPortfolio), result.curr);


        }


    }, function (error) {})

    return deferred.promise;
}

function getTotalPortfolioValue(userInfo, fetchValue) {
    var deferred = Q.defer();

    getPortfolio(userInfo).then(function (myPortfolio) {

        if (fetchValue || Util.m_platform=="google") {
            console.log('total1')
            var oPortFolioLatestData = getPortFolioCoinData(myPortfolio, Util.m_myCurrency)

            oPortFolioLatestData.then(function (myportFolioData) {

<<<<<<< HEAD
            
=======
              console.log('total')
>>>>>>> origin/glitch
                switch (Util.m_platform) {
                    case "telegram":
                    telegram.m_getPortfolioData(myportFolioData, myPortfolio);
                        break;
                    case "slack":
                      slack.m_getPortfolioData(myportFolioData, myPortfolio);
                        break;
                    case "skype":
                      telegram.m_getPortfolioData(myportFolioData, myPortfolio);
                        break;
                    case "google":
                        Google.m_getPortfolioData(myportFolioData, myPortfolio);
                        break;
                    default:
                        "Please try again !!!"
                }

                // console.log(resultPortFolioWithData)  

                deferred.resolve(true);
            }).catch(function (err) {
             
                return deferred.reject(false);
            })


        } else {
        
            switch (Util.m_platform) {
                case "telegram":
                    telegram.m_getPortfolioInfo(myPortfolio);
                    break;
                case "slack":
                   slack.m_getPortfolioInfo(myPortfolio);
                    break;
                case "skype":
                    telegram.m_getPortfolioInfo(myPortfolio);
                    break;
                case "google":
                    Google.m_getPortfolioInfo(myPortfolio);
                    break;
                default:
                    "Please try again !!!"
            }

            deferred.resolve(true);
        }


    }, function (error) {
        console.log(error);
      
      return deferred.reject(false);
    })
    return deferred.promise;



}

function getPortFolioCoinData(input, myCurrency) {

    var deferred = Q.defer();
    var request = require('request');

    var cryptoCoinstoFetch = "BTC";



    for (const coin of Object.keys(input)) {
        var foundCoin = myCoins.m_findCoin(coin.toUpperCase())
          //console.log(foundCoin);
        if (foundCoin !== null && foundCoin != "") {
            cryptoCoinstoFetch = cryptoCoinstoFetch + "," + foundCoin[0].n
        }
    }
    var baseUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=';
    var parsedUrl = baseUrl + cryptoCoinstoFetch + "&tsyms=BTC," + myCurrency + "&e=CCCAGG"

    //console.log(parsedUrl);
    request(parsedUrl, function (error, response, body) {

        
        var JSONResponse = JSON.parse(response.body);

         //console.log("CV" + JSON.stringify(JSONResponse));
        if (JSONResponse != null || JSONResponse !== undefined) {
            //console.log("JSON Response" + JSON.stringify(response.body))
            deferred.resolve(JSONResponse);
        } else {

            deferred.reject(null);
        }

    })
    return deferred.promise;
}


module.exports = {

    m_getWelcomeMessage: getWelcomeMessage,
    m_sendSimpleMessage:sendSimpleMessage,
    m_sendCoinResponse: sendCoinResponse,
    m_SyncPortfolio: SyncPortfolio,
    m_getTotalPortfolioValue: getTotalPortfolioValue,
    m_callPayLoadFormatMessage:callPayLoadFormatMessage,
}