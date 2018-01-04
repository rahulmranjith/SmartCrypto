const Util = require('../AllCoinZ/util')


function formatWelcomeMessage(displayName){


return  "\n Hello " + displayName + "!!!\n\n _All CoinZ - Get CryptoCoins' value in local currencies!!!_\n\n Type in any Coin name like 'BTC' or 'BitCoin' .\n\n Can ask interactively : \n_-What's the value of XRP_ \n_-How much is BTC_ \n_-Get me value of ETH and so on.._\n\n *>* Send *help* for help/configuration \n\n *>*` Set default currency by sending:` \n *CUR[USD]* / *CURR BTC* / *CUR IND*"
        
}
function ResponseMessage(coinResult){

        var responseData = {
            "messages": [getCoinInfo(coinResult)]

        }
        
        
        return responseData;
        }
  
  

function getCoinInfo(CoinInfo) {
 

    var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency]
    var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"]
    
    var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency)
    var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC)
 

    var coinDetail = "💰"+"*"+ CoinInfo.CoinFN.toUpperCase() + "*💰\n\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * currencyPrice).toFixed(5)+" "+ coinInfoinCurrency.TOSYMBOL+ "*" + "\n " +
        "\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * BTCPrice).toFixed(5) +" "+ coinInfoinBTC.TOSYMBOL + "* \n\n _ % in 24 Hrs : _ *" + coinInfoinCurrency.CHANGEPCT24HOUR + "* \n " + "_ High Day : _ *" + coinInfoinCurrency.HIGHDAY + "* \n " +
        "_ Low Day : _ *" + coinInfoinCurrency.LOWDAY + "* \n " + "_ Market Cap : _ *" + coinInfoinCurrency.MKTCAP + "* \n " + "_ Updated : _ *" + coinInfoinCurrency.LASTUPDATE + "* \n "

    var customcardMessage = {
            "buttons": [
              // {
              //   "postback": CoinInfo.CoinURL,
              //   "text": CoinInfo.CoinFN
              // }
                       ],
            //"imageUrl": CoinInfo.CoinURL,
            "platform": Util.m_platform,
            "subtitle": coinDetail,
            //"title": "AllCoinZ",
            "type": 1
        }
    
    return customcardMessage
}

module.exports={
m_formatWelcomeMessage:formatWelcomeMessage,
   m_ResponseMessage:ResponseMessage
}