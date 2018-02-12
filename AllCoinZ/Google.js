const Util = require('../AllCoinZ/util')
const jsCoin = require('../AllCoinZ/jsonCoin');
var gapp;

function sendSimpleMessage(message, displayText, title, image) {

    if (title == undefined) { title = "AllCryptoCoinZ" }
    if (displayText == undefined) { displayText = "" }
    var basicards = gapp.buildBasicCard(message).setTitle(title)
    if (image == null) {
        basicards.setImage("https://i.imgur.com/5hFARdc.jpg", "AllCryptoCoinZ")
            .setImageDisplay("DEFAULT")

    }
    gapp.ask(gapp.buildRichResponse()
        .addSimpleResponse({
            speech: message.split("*").join(""),
            displayText: displayText
        })
        .addSuggestions(Util.m_getDefaultSuggestions)
        .addBasicCard(basicards
        )

    )
}

function sendPortfolioUpdate(message) {
    sendSimpleMessage(message)
}

function setgapp(mgapp) {
    gapp = mgapp
}

function getHelp(displayName) {
    // gapp.ask(gapp.buildRichResponse()
    //     // Create a basic card and add it to the rich response
    //     .addSimpleResponse('<speak><break time="1s"/>addSimpleResponse</speak>')

    //     .addBasicCard(gapp.buildBasicCard('<speak><emphasis level="moderate">Welcome to AllCryptoCoinZ</emphasis></speak>')
    //         .setTitle('Math & prime numbers')
    //         .addButton('Read more', 'https://example.google.com/mathandprimes')
    //         .setImage('https://example.google.com/42.png', 'Image alternate text')
    //         .setImageDisplay('CROPPED')
    //     )
    // );

    var  hasScreen = gapp.hasSurfaceCapability(gapp.SurfaceCapabilities.SCREEN_OUTPUT)

    var  richresponse = gapp.buildRichResponse()
    // Create a basic card and add it to the rich response 
    if (hasScreen) {
        richresponse = richresponse.addSimpleResponse('<speak><break time="1s"/>AllCryptoCoinZ Help</speak>')
            .addBasicCard(gapp.buildBasicCard(
                '  \n  \n*To change the default currency say* **Set currency to USD or cur INR**' +
                '  \n  \n*To add a coin to portfolio say* **Add 1.23 XRP**' +
                '  \n  \n*To reduce a coin count from portfolio say* **Deduct 0.23 BCH**' +
                '  \n  \n*To delete a coin from portfolio say* **Delete XRP**' +
                '  \n  \n*To get the portfolio ask* **What\'s my portfolio?**')
                .setTitle('AllCryptoCoinZ Help')
            // .addButton('Read more', 'https://example.google.com/mathandprimes')
            // .setImage('https://example.google.com/42.png', 'Image alternate text')
            // .setImageDisplay('CROPPED')
            )
    } else {
        richresponse = richresponse.addSimpleResponse('<speak><break time="1s"/>AllCryptoCoinZ Help' +
            '<break time="1s"/>To change the default currency say <break time="1s"/><prosody rate="slow" pitch="-2st">Set currency to USD</prosody>'

            +
            '<break time="1s"/>To add a coin to portfolio say <break time="1s"/><prosody rate="slow" pitch="-2st"><emphasis level="strong">Add 1.23 XRP</emphasis></prosody>'

            +
            '<break time="1s"/>To reduce a coin count from portfolio say <break time="1s"/><prosody rate="slow" pitch="-2st"><emphasis level="strong">Deduct 0.23 BCH</emphasis></prosody>'

            +
            '<break time="1s"/>To delete a coin from portfolio say <break time="1s"/><prosody rate="slow" pitch="-2st"><emphasis level="strong">Delete 123 XRP</emphasis></prosody>'

            +
            '<break time="1s"/>To get the portfolio ask <break time="1s"/><prosody rate="slow" pitch="-2st"><emphasis level="strong">What\'s my portfolio?</emphasis></prosody></speak>')
    }

    gapp.ask(richresponse)

    gapp.ask(gapp.buildRichResponse()
        .addSimpleResponse('addSimpleResponse')
        .addBasicCard(gapp.buildBasicCard('<speak><emphasis level="moderate">Welcome to AllCryptoCoinZ</emphasis>' +
            '<break time="1s"/>To change the default currency say **Set currency to USD or cur INR**' +
            '<break time="1s"/>To add a coin to portfolio say **Add 1.23 XRP**' +
            '<break time="1s"/>To reduce a coin count from portfolio say **Deduct 0.23 BCH**' +
            '<break time="1s"/>To delete a coin from portfolio say **Delete 1.23 XRP**' +
            '<break time="1s"/>To get the portfolio ask **What\'s my portfolio?**</speak>')
            .setTitle('Math & prime numbers')
            .addButton('Read more', 'https://example.google.com/mathandprimes')
            .setImage('https://example.google.com/42.png', 'Image alternate text')
            .setImageDisplay('CROPPED')

        ))

    return



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

    welcomeMessage = '<emphasis level="moderate">Welcome to AllCryptoCoinZ</emphasis>' +
        '<break time="1s"/>To change the default currency say **Set currency to USD**'

    //sendSimpleMessage(welcomeMessage)
}

function formatWelcomeMessage(displayName) {
    var welcomeMessage = ""
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

    welcomeMessage = '<emphasis level="moderate">Welcome to AllCryptoCoinZ</emphasis><break time="1s"/>Say help anytime. Which coin would you want to select ? ' +


        sendSimpleMessage(welcomeMessage)
}





function getPayLoadMessage(message) {

    return {
        speech: "telegram",
        "messages": [{
            "platform": "telegram",
            "type": 4,
            payload: {
                "telegram": {
                    "text": message,
                    parse_mode: "Markdown",
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


function formatMyPortfoliowithData(data, myCoins) {
    var currency = Util.m_myCurrency
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

        op = op + "`" + (+myCoins[coin]).toFixed(2) + "` " + "*[" + coin + "*]=`" + priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL + "` " +
            "\n"
        displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
        displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

        totalBTC = +totalBTC + +priceinBTC
        totalCurrency = +totalCurrency + +priceinCurrency


    }
    op = op + "\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC + "*"
    gapp.ask("<speak>Total Value is " + '<emphasis level="moderate"><say-as interpret-as="fraction">' + totalCurrency.toFixed(3) + " " + displayCurrency + "</say-as></emphasis></speak>")
    return op;
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

    text = CoinInfo.CoinFN.toUpperCase() + " = " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL

    var sound = '<speak>' + CoinInfo.CoinFN.toUpperCase() + " is " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + '</speak>';

    var simpleResponse = '<speak> <say-as interpret-as="fraction">' + CoinInfo.CoinCount + '</say-as> ' + CoinInfo.CoinFN + ' is <emphasis level="moderate"><say-as interpret-as="fraction">' + (CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " + coinInfoinCurrency.TOSYMBOL + '</say-as></emphasis><break time="1.5" />, Which coin next ?</speak>';

    var content = "  \n *" + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + "**" +
        "  \n *" + CoinInfo.CoinCount + "" + CoinInfo.CoinSN + "* = **" + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "**" +
        "  \n *% in 24 Hrs :* **" + coinInfoinCurrency.CHANGEPCT24HOUR + "**" +
        "  \n *High Day :* **" + coinInfoinCurrency.HIGHDAY + "**" +
        "  \n *Low Day :* **" + coinInfoinCurrency.LOWDAY + "**" +
        "  \n *Market Cap :* **" + coinInfoinCurrency.MKTCAP + "**" +
        "  \n *Updated :* **" + coinInfoinCurrency.LASTUPDATE + "**"

    gapp.ask(gapp.buildRichResponse()
        // Create a basic card and add it to the rich response
        .addSimpleResponse(simpleResponse)

        .addSuggestions(Util.m_getDefaultSuggestions)
        .addBasicCard(gapp.buildBasicCard(content)
            .setTitle("💰💰💰" + CoinInfo.CoinFN.toUpperCase() + "💰💰💰")
            .addButton('View ' + CoinInfo.CoinSN, CoinInfo.CoinURL)
            .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)
            .setImageDisplay('DEFAULT')
        )
    )

    // gapp.askWithCarousel(gapp.buildRichResponse().addSimpleResponse(simpleResponse)
    //     .addSuggestions(['BTC', 'XRP', 'ETH', 'ADA', 'XVG']),


    //     gapp.buildCarousel("💰" + CoinInfo.CoinFN.toUpperCase() + "💰")
    //         // Add the first item to the carousel
    //         .addItems(gapp.buildOptionItem('CoinInfo.CoinSN' + "FIAT",
    //             [CoinInfo.PRICE])
    //             .setTitle(CoinInfo.CoinCount + " " + CoinInfo.CoinSN + " = " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL)
    //             .setDescription(CoinInfo.CoinCount + " " + CoinInfo.CoinSN + " = " + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL
    //             )
    //             .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)

    //         )
    //         .addItems(gapp.buildOptionItem('CoinInfo.CoinSN' + "PERCENT24",
    //             [CoinInfo.CHANGEPCT24HOUR])
    //             .setTitle("% in 24 Hrs: " + coinInfoinCurrency.CHANGEPCT24HOUR)
    //             .setDescription("% in 12 Hrs: " + coinInfoinCurrency.CHANGEPCTDAY)
    //             .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)
    //         )
    //         .addItems(gapp.buildOptionItem('CoinInfo.CoinSN' + "HIGHDAY",
    //             [CoinInfo.HIGHDAY])
    //             .setTitle("High Day : " + coinInfoinCurrency.HIGHDAY)
    //             .setDescription("Low Day : " + coinInfoinCurrency.LOWDAY )
    //             .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)
    //         )
    //         .addItems(gapp.buildOptionItem('CoinInfo.CoinSN' + "MKTCAP",
    //             [CoinInfo.MKTCAP])
    //             .setTitle("Market Cap : " + coinInfoinCurrency.MKTCAP)
    //             .setDescription("Updated : " + coinInfoinCurrency.LASTUPDATE)
    //             .setImage(CoinInfo.CoinImg, CoinInfo.CoinFN)
    //         )
    // );




}

function getPortfolioData(data, myCoins) {
    var currency = Util.m_myCurrency
    var op = "";

    var priceinBTC = 0;
    var priceinCurrency = 0;
    var totalBTC = 0;
    var totalCurrency = 0;
    var displayCurrency;
    var displayBTC;

    var mylist = gapp.buildList('My Portfolio:')

    var BaseLinkUrl = "https://www.cryptocompare.com";
    var cryptoCoin = "";
    var link;
    var ilink
    var description;
    for (const coin of Object.keys(myCoins)) {

        if (myCoins[coin] <= 0) {
            continue
        }
        cryptoCoin = jsCoin.m_findCoin(coin.toUpperCase());;
        console.log("after my " + BaseLinkUrl + cryptoCoin[0].iu)

        link = BaseLinkUrl + cryptoCoin[0].u;
        ilink = BaseLinkUrl + cryptoCoin[0].iu;
        op = op + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as>"


        priceinBTC = (Util.m_removeCurrencySymbols(data.DISPLAY[coin]["BTC"]) * myCoins[coin]).toFixed(9)
        priceinCurrency = (Util.m_removeCurrencySymbols(data.DISPLAY[coin][currency]) * myCoins[coin]).toFixed(2)
        description = priceinCurrency + "" + data.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + data.DISPLAY[coin]["BTC"].TOSYMBOL

        mylist.addItems(gapp.buildOptionItem((+myCoins[coin]).toFixed(3) + "#" + coin, [coin])
            .setTitle((+myCoins[coin]).toFixed(3) + " " + coin)
            .setDescription(description)
            .setImage(ilink, coin)
        )
        displayCurrency = data.DISPLAY[coin][currency].TOSYMBOL
        displayBTC = data.DISPLAY[coin]["BTC"].TOSYMBOL

        totalBTC = +totalBTC + +priceinBTC
        totalCurrency = +totalCurrency + +priceinCurrency
    }


    if (cryptoCoin == '') {
        return sendPortfolioUpdate("Please create a new portfolio. Check help !!!");
    }

    mylist.title = "Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency //+ "  \n" + totalBTC.toFixed(5) + " " + displayBTC

    if (mylist.items.length < 200) {
        mylist.addItems(gapp.buildOptionItem("My Portfolio", ['My Portfolio'])
            .setTitle("[My Portfolio Value]")
            .setDescription(totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(6) + " " + displayBTC)
            .setImage("https://i.imgur.com/yXARQuc.png", "AllCryptoCoinZ")
        )
    }



    mylist.title = "My Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency //+ " | " + totalBTC.toFixed(9) + " " + displayBTC
    console.log(mylist.title)

    console.log("\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC)
    gapp.askWithList(gapp.buildRichResponse()
        .addSimpleResponse("<speak>" + "My Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency + " equivalent to " + totalBTC.toFixed(9) + " BTC " + "</speak>")
        //.addSuggestions(Util.m_getDefaultSuggestions)
        , mylist)




}



//format portfolio info

function getPortfolioInfo(myCoins) {

    var op;


    var mylist = gapp.buildList('My Portfolio:')

    for (const coin of Object.keys(myCoins)) {

        op = op + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as>"

        mylist.addItems(gapp.buildOptionItem(coin, ['AllCryptoCoinZ'])
            .setTitle((+myCoins[coin]).toFixed(3) + " " + coin)
            .setDescription("description")
            .setImage("https://assets.pcmag.com/media/images/436663-yahoo-aabaco.jpg", coin))

    }
    gapp.askWithList(gapp.buildRichResponse()
        .addSimpleResponse("<speak>My Portfolio: " + op + "</speak>")
        .addSuggestions(
        ['Total Value']), mylist)
}

function formatFallback() {
    sendSimpleMessage("I don't understand it.Please check the command or Coin name.")


}
module.exports = {
    m_formatWelcomeMessage: formatWelcomeMessage,
    m_ResponseMessage: ResponseMessage,
    m_getPortfolioData: getPortfolioData,
    m_getPortfolioInfo: getPortfolioInfo,
    m_getPayLoadMessage: getPayLoadMessage,
    m_gapp: setgapp,
    m_sendPortfolioUpdate: sendPortfolioUpdate,
    m_sendSimpleMessage: sendSimpleMessage,
    m_formatFallback: formatFallback,
    m_getHelp: getHelp
}