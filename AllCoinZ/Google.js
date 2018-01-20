const Util = require('../AllCoinZ/util')
const jsCoin = require('../AllCoinZ/jsonCoin');
var gapp;

function sendPortfolioUpdate(message){

gapp.ask("<speak>"+ message+"</speak>")


}
function sendSimpleMessage(message){

    sendPortfolioUpdate(message)
}
 function setgapp(mgapp){
       gapp=mgapp
 }


function formatWelcomeMessage(displayName) {
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
  '<emphasis level="moderate">Welcome to AllCryptoCoinZ</emphasis><break time="1s"/>Say help anytime. Which coin would you want to select ? '+
  '</speak>'
 
   gapp.ask(welcomeMessage)
}



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

  var  simpleResponse = '<speak> <say-as interpret-as="fraction">'+ CoinInfo.CoinCount + '</say-as> '+ CoinInfo.CoinFN + ' is <emphasis level="moderate"><say-as interpret-as="fraction">'+(CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " +coinInfoinCurrency.TOSYMBOL+'</say-as></emphasis></speak>';
   
  var content = "*"+CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * currencyPrice).toFixed(5)+ " " +coinInfoinCurrency.TOSYMBOL+"**"+" <br>*"+
      CoinInfo.CoinCount + "" + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "** <br> "+
      "*% in 24 Hrs :* **" + coinInfoinCurrency.CHANGEPCT24HOUR + "** <br>  " + 
      "*High Day :* **" + coinInfoinCurrency.HIGHDAY + "** <br>  " +
      "*Low Day :* **" + coinInfoinCurrency.LOWDAY + "**<br>" + 
      "*Market Cap :* **" + coinInfoinCurrency.MKTCAP + "**<br>" + 
      "*Updated :* **" + coinInfoinCurrency.LASTUPDATE + "**  "
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


function formatMyPortfoliowithData(data, myCoins,) {
    var currency =Util.m_myCurrency
    var op = "\n"
    var priceinBTC = 0;
    var priceinCurrency = 0;
    var totalBTC = 0;
    var totalCurrency = 0;
    var displayCurrency;
    var displayBTC;
    for (const coin of Object.keys(myCoins)) {
       

        priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)
   
        priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)

    
      
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

function getPortfolioData(data, myCoins) {
   var currency =Util.m_myCurrency
    var op="";
  
    var priceinBTC = 0;
    var priceinCurrency = 0;
    var totalBTC = 0;
    var totalCurrency = 0;
    var displayCurrency;
    var displayBTC;
//     for (const coin of Object.keys(myCoins)) {
       

//         priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)
       
//         priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)

       
//        op = op +"`" + (+myCoins[coin]).toFixed(2) + "` "+ "*[" + coin + "*]=`" + priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +
//             "\n"

//         displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
//         displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

//         totalBTC = +totalBTC + +priceinBTC
//         totalCurrency = +totalCurrency + +priceinCurrency


//     }
  
  
  
    var mylist = gapp.buildList('My Portfolio:')
    
        var BaseLinkUrl = "https://www.cryptocompare.com";
        var  cryptoCoin ;
        var link ;
        var ilink
    for (const coin of Object.keys(myCoins)){
    
       
        cryptoCoin = jsCoin.m_findCoin(coin.toUpperCase());;
        console.log("after my "+ BaseLinkUrl + cryptoCoin[0].iu)

      link = BaseLinkUrl + cryptoCoin[0].u;
      ilink = BaseLinkUrl + cryptoCoin[0].iu;  
        op = op + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as>"
  
      
        priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)     
        priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)
      
        mylist.addItems(gapp.buildOptionItem(coin,
        ['AllCryptoCoinZ'])
        .setTitle((+myCoins[coin]).toFixed(3) +" "+coin)
              .setDescription(priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL)
             .setImage(ilink, coin)
            )  
        displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
        displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

        totalBTC = +totalBTC + +priceinBTC
        totalCurrency = +totalCurrency + +priceinCurrency
     }
  
  mylist.title ="My Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC 
  console.log(mylist.title)

  console.log("\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC )
  gapp.askWithList(gapp.buildRichResponse()
      .addSimpleResponse("<speak>"+"My Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency + " equalent to " + totalBTC.toFixed(9) + " BTC " +"</speak>")
      .addSuggestions(['BTC','XRP','ETH','ADA','XVG']),mylist)
  
}



//format portfolio info

function getPortfolioInfo(myCoins) {
  
  var op;
  
  
    var mylist = gapp.buildList('My Portfolio:')
  
    for (const coin of Object.keys(myCoins)){
    
       op = op + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as>"
  
        mylist.addItems(gapp.buildOptionItem(coin,
        ['AllCryptoCoinZ'])
        .setTitle((+myCoins[coin]).toFixed(3) +" "+coin)
              .setDescription("description")
             .setImage("https://assets.pcmag.com/media/images/436663-yahoo-aabaco.jpg", coin))
   
     }
  gapp.askWithList(gapp.buildRichResponse()
      .addSimpleResponse("<speak>My Portfolio: "+op+"</speak>")
      .addSuggestions(
        ['Total Value']),mylist)
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