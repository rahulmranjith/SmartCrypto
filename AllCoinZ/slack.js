const Util = require('../AllCoinZ/util')


function formatWelcomeMessage(displayName) {

    var message = getPayLoadMessage("\n Hello *" + displayName + "*     !!!\n\n *💰All CoinZ - Get CryptoCoins' value in local currencies!!!💰*\n\n `Type in any Coin name like` *BTC* `or` *BitCoin* .\n\n *>*` Can ask interactively : `" +
        "\n *   -What's the value of XRP* \n *   -How much is BTC* \n *   -Get me value of ETH and so on..*\n\n *>* `Send` *help* `for help/configuration` \n\n *>*` Set default currency by sending:` \n    -*CUR[USD]* / *CURR BTC* / *CUR IND*"
        //+"\n aaa"
        + "\n \n*>*` Set Portfolio using` :\n   - `To Add send` *B 1.23 BTC* \n   - `To Remove send` *S 1.00 BTC* \n   - `To view current Portfolio send` *VP* \n   - `To view Total Porftolio Value send` *PT*"

    )
    sendDialogHTTPResponse(message)
}
function sendSimpleMessage(message){

    sendDialogHTTPResponse(message)

}


function sendDialogHTTPResponse(result) {
    var HttpResponse = Util.m_getHttpResponse();
    HttpResponse.send(result)
}


function ResponseMessage(coinResult) {

    var responseData = {
        speech: "slack",
        "messages": [{
            "platform": "slack",
            "type": 4,
            payload: {
                "slack":
                    {
                        "text": getCoinInfo(coinResult),
                        //     "attachments": [
                        //         {
                        //             "text": "",
                        //             "fallback": "You are unable to choose a game",
                        //             "callback_id": "wopr_game",
                        //             "color": "#3AA3E3",
                        //             "attachment_type": "default",
                        //             "actions": [
                        //                 {
                        //                     "name": "BTC",
                        //                     "text": "BTC",
                        //                     "type": "button",
                        //                     "value": "BTC"
                        //                 },
                        //                 {
                        //                     "name": "ETH",
                        //                     "text": "ETH",
                        //                     "type": "button",
                        //                     "value": "ETH"
                        //                 },
                        //                 {
                        //                     "name": "XRP",
                        //                     "text": "XRP",
                        //                     "type": "button",
                        //                     "value": "XRP"
                        //                 },{
                        //                     "name": "ADA",
                        //                     "text": "ADA",
                        //                     "type": "button",
                        //                     "value": "ADA"
                        //                 },
                        //                 {
                        //                     "name": "XVG",
                        //                     "text": "XVG",
                        //                     "type": "button",
                        //                     "value": "XVG"
                        //                 }

                        //             ]
                        //         }
                        //     ]
                    }
            }
        }]

    }






    sendDialogHTTPResponse(responseData)
}



function getPayLoadMessage(message) {

    return {
        speech: "slack",
        "messages": [{
            "platform": "slack",
            "type": 4,
            payload: {
                "slack":
                    {
                        "text": message
                    }
            }
        }]
    }

}

function getCoinInfo(CoinInfo) {


    var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency]
    var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"]

    var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency)
    var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC)


    var coinDetail = "💰" + "*" + CoinInfo.CoinFN.toUpperCase() + "*💰\n\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + "*" + "\n " +
        "\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "* \n\n _ % in 24 Hrs : _ *" + coinInfoinCurrency.CHANGEPCT24HOUR + "* \n " + "_ High Day : _ *" + coinInfoinCurrency.HIGHDAY + "* \n " +
        "_ Low Day : _ *" + coinInfoinCurrency.LOWDAY + "* \n " + "_ Market Cap : _ *" + coinInfoinCurrency.MKTCAP + "* \n " + "_ Updated : _ *" + coinInfoinCurrency.LASTUPDATE + "* \n "




    return coinDetail
}

function formatMyPortfoliowithData(data, myCoins, currency) {

    var op = "\n"
    var priceinBTC = 0;
    var priceinCurrency = 0;
    var totalBTC = 0;
    var totalCurrency = 0;
    var displayCurrency;
    var displayBTC;

    //console.log("myPrtfolio"+JSON.stringify(myCoins))
    for (const coin of Object.keys(myCoins)) {
        console.log(coin, myCoins[coin]);

        //console.log(data.DISPLAY[coin]["BTC"].PRICE)
        if (data.DISPLAY[coin] == undefined) {
            op = op + "`" + (+myCoins[coin]).toFixed(2) + "` " + "*" + coin + "* " + "`Can't fetch value`" + "\n"
        } else {
            priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)

            console.log("priceinINR" + data.DISPLAY[coin][currency].PRICE)

            priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)

            //op = op + "*" + coin + "(`" + (+myCoins[coin]).toFixed(2) + "`):* `" + priceinCurrency + " " + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + " " + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +"\n"


            op = op + "`" + (+myCoins[coin]).toFixed(2) + "` " + "*" + coin + "*=`" + priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +
                "\n"


            displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
            displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

            totalBTC = +totalBTC + +priceinBTC
            totalCurrency = +totalCurrency + +priceinCurrency

        }
    }
    op = op + "\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC + "*"

    return op;
}

function getPortfolioInfo(myCoins) {


    var op = "";
    for (const coin of Object.keys(myCoins)) {

        // op = op + "`" + myCoins[coin].toFixed(2) + " " + coin + "`\n"
        op = op + "`" + (+myCoins[coin]).toFixed(3) + " " + coin + "`\n"


    }



    var slackPInfo = getPayLoadMessage("My Portfolio:\n" + op)


    sendDialogHTTPResponse(slackPInfo)

}
function getPortfolioData(myportfolioData, myCoins) {
    var slackTPV = getPayLoadMessage("*Total Portfolio Value:*\n" + formatMyPortfoliowithData(myportfolioData, myCoins, Util.m_myCurrency))
    sendDialogHTTPResponse(slackTPV) 
}
module.exports = {
    m_formatWelcomeMessage: formatWelcomeMessage,
    m_ResponseMessage: ResponseMessage,
    m_getPortfolioData: getPortfolioData, m_getPortfolioInfo: getPortfolioInfo,
    m_getPayLoadMessage: getPayLoadMessage,
    m_sendSimpleMessage:sendSimpleMessage
}