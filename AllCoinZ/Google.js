const Util = require('../AllCoinZ/util')

var gapp;

function sendPortfolioUpdate(message){

gapp.ask("<speak>"+ message+" from the portfolio </speak>")


}
function sendSimpleMessage(message){

    sendPortfolioUpdate(message)

}
function formatWelcomeMessage(displayName) {
    console.log("welcome");

    // return "\n Hello *" + displayName + "*     !!!\n\n *💰All CoinZ - Get CryptoCoins' value in local currencies!!!💰*\n\n `Type in any Coin name like` *BTC* `or` *BitCoin* .\n\n *>*` Can ask interactively : `"+
    //   "\n *   -What's the value of XRP* \n *   -How much is BTC* \n *   -Get me value of ETH and so on..*\n\n *>* `Send` *help* `for help/configuration` \n\n *>*` Set default currency by sending:` \n    -*CUR[USD]* / *CURR BTC* / *CUR IND*"
    //     //+"\n aaa"
    //   +"\n \n*>*` Set Portfolio using` :\n   - `To Add send` *B 1.23 BTC* \n   - `To Remove send` *S 1.00 BTC* \n   - `To view current Portfolio send` *VP* \n   - `To view Total Porftolio Value send` *PT*"

  var welcomeMessage =""
  const textToSpeech = '<speak>' +
    'Here are <say-as interpret-as="characters">SSML</say-as> samples. ' +
    'I can pause <break time="3" />. ' +
    'I can play a sound <audio src="https://www.example.com/MY_WAVE_FILE.wav">your wave file</audio>. ' +
    'I can speak in cardinals. Your position is <say-as interpret-as="cardinal">10</say-as> in line. ' +
    'Or I can speak in ordinals. You are <say-as interpret-as="ordinal">10</say-as> in line. ' +
    'Or I can even speak in digits. Your position in line is <say-as interpret-as="digits">10</say-as>. ' +
    'I can also substitute phrases, like the <sub alias="World Wide Web Consortium">W3C</sub>. ' +
    'Finally, I can speak a paragraph with two sentences. ' +
    '<p><s>This is sentence one.</s><s>This is sentence two.</s></p>' +
    '</speak>';
  
  welcomeMessage ='<speak>'+
  '<emphasis level="moderate">All CoinZ</emphasis> Get CryptoCoins value in fiat currencies!!<break time="1s"/>Say help for options'+
  '</speak>'
 
   
    
   gapp.ask(welcomeMessage)
//   gapp.ask({
//     speech: 'Howdy! I can tell you fun facts about ' +
//     'almost any number, like 42. What do you have in mind?',
//     displayText: "\n Hello *" + displayName + "*     !!!\n\n *💰All CoinZ - Get CryptoCoins' value in local currencies!!!💰*\n\n `Type in any Coin name like` *BTC* `or` *BitCoin* .\n\n *>*` Can ask interactively : `"+
//       "\n *   -What's the value of XRP* \n *   -How much is BTC* \n *   -Get me value of ETH and so on..*\n\n *>* `Send` *help* `for help/configuration` \n\n *>*` Set default currency by sending:` \n    -*CUR[USD]* / *CURR BTC* / *CUR IND*"
//         //+"\n aaa"
//       +"\n \n*>*` Set Portfolio using` :\n   - `To Add send` *B 1.23 BTC* \n   - `To Remove send` *S 1.00 BTC* \n   - `To view current Portfolio send` *VP* \n   - `To view Total Porftolio Value send` *PT*"


//   });
}

 function setgapp(mgapp){
       gapp=mgapp
 }




 
  //   gapp.ask(gapp.buildRichResponse()
  //   // Create a basic card and add it to the rich response
  //   .addSimpleResponse('Simple Response')
  //   .addBasicCard(gapp.buildBasicCard('Basic Card')
  //     .setTitle('Basica Card Simple Title')
  //     .addButton('Button', 'https://example.google.com/mathandprimes')
  //     .setImage('https://www.cryptocompare.com/media/20646/eth.png', 'Ethereum')
  //     .setImageDisplay('CROPPED')
  //   )
  // );
function ResponseMessage(CoinInfo) {

    console.log("ResponseMessage")
    var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency]
    var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"]

    var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency)
    var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC)
  
    var coinDetail = "💰" + "*" + CoinInfo.CoinFN.toUpperCase() + "*💰\n\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + "*" + "\n " +
        "\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "* \n\n _ % in 24 Hrs : _ *" + coinInfoinCurrency.CHANGEPCT24HOUR + "* \n " + "_ High Day : _ *" + coinInfoinCurrency.HIGHDAY + "* \n " +
        "_ Low Day : _ *" + coinInfoinCurrency.LOWDAY + "* \n " + "_ Market Cap : _ *" + coinInfoinCurrency.MKTCAP + "* \n " + "_ Updated : _ *" + coinInfoinCurrency.LASTUPDATE + "* \n "
  var text;
  
  text = CoinInfo.CoinFN.toUpperCase() +" = " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL
  
  var sound = '<speak>'+CoinInfo.CoinFN.toUpperCase() +" is " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + '</speak>';
  
  // gapp.ask(gapp.buildRichResponse()
  //   // Create a basic card and add it to the rich response
  //   .addSimpleResponse('Math and prime numbers it is!')
  //   .addBasicCard(gapp.buildBasicCard('42 is an even composite number. It' +
  //     'is composed of three distinct prime numbers multiplied together. It' +
  //     'has a total of eight divisors. 42 is an abundant number, because the' +
  //     'sum of its proper divisors 54 is greater than itself. To count from' +
  //     '1 to 42 would take you about twenty-one…')
  //     .setTitle('Math & prime numbers')
  //     .addButton('Read more', 'https://example.google.com/mathandprimes')
  //     .setImage('https://example.google.com/42.png', 'Image alternate text')
  //     .setImageDisplay('CROPPED')
  //   )
  // );
  
//' <
   var  simpleResponse = '<speak> <say-as interpret-as="fraction">'+ CoinInfo.CoinCount + '</say-as> '+ CoinInfo.CoinFN + ' is <emphasis level="moderate"><say-as interpret-as="fraction">'+(CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " +coinInfoinCurrency.TOSYMBOL+'</say-as></emphasis></speak>';
   
  var content = "*"+CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * currencyPrice).toFixed(5)+ " " +coinInfoinCurrency.TOSYMBOL+"**"+" <br>*"+
      CoinInfo.CoinCount + "" + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "** <br> "+
      "*% in 24 Hrs :* **" + coinInfoinCurrency.CHANGEPCT24HOUR + "** <br>  " + 
      "*High Day :* **" + coinInfoinCurrency.HIGHDAY + "** <br>  " +
      "*Low Day :* **" + coinInfoinCurrency.LOWDAY + "**<br>" + 
      "*Market Cap :* **" + coinInfoinCurrency.MKTCAP + "**<br>" + 
      "*Updated :* **" + coinInfoinCurrency.LASTUPDATE + "**  "
  
  gapp.ask(gapp.buildRichResponse()
    // Create a basic card and add it to the rich response
    .addSimpleResponse(simpleResponse)
    .addBasicCard(gapp.buildBasicCard(content)
      .setTitle("💰" +  CoinInfo.CoinFN.toUpperCase() + "💰" )
      .addButton('View '+ CoinInfo.CoinSN, CoinInfo.CoinURL)
      .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)
      .setImageDisplay('CROPPED')
    )
  );
    
    
    
    
    
//     var responseData = {

//         "messages": [getCoinInfo(coinResult), {
//             "platform": "telegram",
//             "type": 4,
//             payload: {
//                 "telegram": {
//                     "text": "&#9889;<i> Please select next coin...</i>", //\n\n["+link +"]",,
//                     //photo:coinResult.CoinImg,
//                     parse_mode: "HTML",
//                     disable_web_page_preview: false,
//                     "title": "AllCoinZ",
//                     "reply_markup": {
//                         "keyboard": [
//                             [{
//                                 "text": "BTC"

//                             }, {
//                                 "text": "ETH"

//                             }, {
//                                 "text": "XRP"

//                             }, {
//                                 "text": "PINK"

//                             }, {
//                                 "text": "DOGE"
//                             }, {
//                                 "text": "IOTA"
//                             }],
//                             [{
//                                 "text": "ETN"
//                             }, {
//                                 "text": "XLM"
//                             }, {
//                                 "text": "XVG"
//                             }, {
//                                 "text": "ADA"
//                             }, {
//                                 "text": "BCH"
//                             }, {
//                                 "text": "TRX"
//                             }],
//                             [{
//                                     "text": "C[USD]"
//                                 }, {
//                                     "text": "C[INR]"
//                                 }, {
//                                     "text": "View Portfolio"
//                                 }, {
//                                     "text": "Portfolio Total"
//                                 },
//                                 //{
//                                 //     "text": "CUR[BTC]"
//                                 // }, {
//                                 //     "text": "CUR[EUR]"
//                                 // }
//                             ]

//                         ],
//                         resize_keyboard: true

//                     }
//                 }
//             }
//         }]

//     }

//     //console.log(responseData)
//     return responseData;
}

 

function getPayLoadMessage(message){

 return {
          speech:"telegram",
            "messages": [{
                "platform": "telegram",
                "type": 4,
                 payload: {
                    "telegram": 
                       {
                      "text": message,
                       parse_mode: "Markdown",
}}}]}
 
}

function getCoinInfo(CoinInfo) {


    var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency]
    var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"]

    var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency)
    var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC)


    var coinDetail = "💰" + "*" + CoinInfo.CoinFN.toUpperCase() + "*💰\n\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + "*" + "\n " +
        "\n` " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "` = *" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "* \n\n _ % in 24 Hrs : _ *" + coinInfoinCurrency.CHANGEPCT24HOUR + "* \n " + "_ High Day : _ *" + coinInfoinCurrency.HIGHDAY + "* \n " +
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


function formatMyPortfoliowithData(data, myCoins, currency) {

    var op = "\n"
    var priceinBTC = 0;
    var priceinCurrency = 0;
    var totalBTC = 0;
    var totalCurrency = 0;
    var displayCurrency;
    var displayBTC;
    for (const coin of Object.keys(myCoins)) {
        //console.log(coin, myCoins[coin]);

        //console.log(data.DISPLAY[coin]["BTC"].PRICE)
       // console.log(data.DISPLAY[coin][currency].PRICE)

        priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)
        //console.log("priceinINR"+ data.DISPLAY[coin][currency].PRICE)

        priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)

        // op = op + "*" + coin + "(" + (+myCoins[coin]).toFixed(2) + "):*  `" + priceinCurrency + " " + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + " " + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +
        //     "\n"
      
       op = op +"`" + (+myCoins[coin]).toFixed(2) + "` "+ "*[" + coin + "*]=`" + priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +
            "\n"

        displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
        displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

        totalBTC = +totalBTC + +priceinBTC
        totalCurrency = +totalCurrency + +priceinCurrency


    }
    op = op + "\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC + "*"
    gapp.ask("<speak>Total Value is "+'<emphasis level="moderate"><say-as interpret-as="fraction">'+ totalCurrency.toFixed(3) + " " + displayCurrency +"</say-as></emphasis></speak>")
    return op;
}

function getPortfolioData(myportfolioData, myCoins) {
  
    
    var TelegramTPV = getPayLoadMessage("*Total Portfolio Value:*\n"+formatMyPortfoliowithData(myportfolioData, myCoins, Util.m_myCurrency)) 
    return TelegramTPV
}



//format portfolio info

function getPortfolioInfo(myCoins) {
  
   
    var op="";
    for (const coin of Object.keys(myCoins)) {
       
        op = op + "`" + (+myCoins[coin]).toFixed(3) + " " + coin + "`\n"
  
    }
  
   

    var TelegramPInfo = getPayLoadMessage("*My Portfolio:*\n\n"+op)
    
    
    return TelegramPInfo

}

module.exports = {
    m_formatWelcomeMessage: formatWelcomeMessage,
    m_ResponseMessage: ResponseMessage,
    m_getPortfolioData: getPortfolioData,
    m_getPortfolioInfo: getPortfolioInfo,
  m_getPayLoadMessage:getPayLoadMessage,
  m_gapp:setgapp,
  m_sendPortfolioUpdate:sendPortfolioUpdate,
  m_sendSimpleMessage:sendSimpleMessage
}