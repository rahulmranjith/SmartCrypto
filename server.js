'use strict'; //rahulmr

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const Map = require('es6-map');

const Q = require('q')
const dbAllCoinZ = require('./db/initialize');
const telegramAPI = require('./AllCoinZ/telegram')
const Util = require('./AllCoinZ/util')
const GenProc = require('./AllCoinZ/GenericProcess')
const telegramPush = require('./AllCoinZ/push')

const Google = require('./AllCoinZ/Google')

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

var gapp;

<<<<<<< HEAD
server.post('/getCoinValue', function (req, res) {

    let result = req.body.result;
    let source = req.body.originalRequest.source
=======
const ApiAiApp = require('actions-on-google').DialogflowApp;

let res;

server.post('/', function (request, response, next) {
>>>>>>> 9f07c58f0ed0864651dff7e0643ba042b8e9ffb8

    console.log(JSON.stringify(request))
    gapp = new ApiAiApp({ request, response });
  
    Google.m_gapp(gapp)
    //console.log("GAPP" + JSON.stringify(gapp.body_.originalRequest))


    res = response;
    let originalRequest = gapp.body_.originalRequest

    //console.log(originalRequest.source)  
    switch (originalRequest.source) {
        case "telegram":
            platform = "telegram"
            displayName = originalRequest.data.message.chat.username;
            uniqID = originalRequest.data.message.chat.id
            break;
        case "slack_testbot":
            displayName = originalRequest.data.user;
            uniqID = originalRequest.data.user;
            platform = "slack"
            break;
        case "skype":
            platform = "skype"
            break;
        case "google":
            platform = "google"      
        displayName = gapp.body_.originalRequest.data.user.userId
            uniqID =gapp.body_.originalRequest.data.user.userId
            break;
        default:
            platform = "telegram"
    }
    Util.m_platform = platform



    let actionMap = new Map();
    //actionMap.set('request_name_permission', getName);
    //actionMap.set('thankyouPermission', thankyouPermission);
    //actionMap.set('ViewPortfolio', ViewPortfolio);
    actionMap.set('getCoinValue', getCoinValue);
    actionMap.set('TotalPortfolioValue', TotalPortfolioValue);
    actionMap.set('ViewPortfolio', ViewPortfolio);
    actionMap.set('ViewPortfolio', ViewPortfolio);

    actionMap.set('input.welcome', DefaultWelcomeIntent);
    actionMap.set('setCurrency', ChangeCurrency);
    actionMap.set('input.unknown', DefaultFallbackIntent);
    actionMap.set('BuySellCoin', BuySellCoin);
    actionMap.set('gethelp', DefaultWelcomeIntent);

    gapp.handleRequest(actionMap);

})
function DefaultWelcomeIntent() {
    
    var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform, displayName)
    sendDialogflowResponse(res, welcomeMessageResponse)
}

function ChangeCurrency() {
    var userCurrency = gapp.getArgument("currency-name")
    if (userCurrency == "" && gapp.getArgument["CryptoCoin"] !== "") {
        userCurrency = gapp.getArgument["CryptoCoin"]
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
}

function DefaultFallbackIntent() {
    sendDialogflowResponse(res, GenProc.m_callPayLoadFormatMessage("`Please check the keyword or Coin name .  Check help for keywords`"))
}
function BuySellCoin() {//var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform,displayName)
    //sendDialogflowResponse(res, welcomeMessageResponse)
    GenProc.m_SyncPortfolio({
        displayName,
        uniqID
    }, gapp).then(function (message) {
        sendDialogflowResponse(res, message)
    }, function (error) {
        sendDialogflowResponse(res, error)
    })
}

function getCoinValue() {
  
    Util.m_getCurrency(uniqID).then(function () {
      
        var count = 1;
        if (gapp.getArgument("count") != null) {
            count = gapp.getArgument("count")
        }
        var oCoin = Util.m_getCoinObject({
            count: count,
            CryptoCoin: gapp.getArgument("CryptoCoin")
        })
        oCoin.then(function (coinResult) {
          
            sendDialogflowResponse(res, GenProc.m_getResponseMessage(coinResult))
          
        }).catch(function (err) {
            console.log("m_getCurrency method failed"+ err)
        });
    }
    )
}
function ViewPortfolio() {
    GenProc.m_getTotalPortfolioValue({
        displayName,
        uniqID
    }, false).then(function (VPortfolio) {
        sendDialogflowResponse(res, VPortfolio)
    }, function (error) {
        console.log(error);
        sendDialogflowResponse(res, error)
    })
}
function TotalPortfolioValue() {
    GenProc.m_getTotalPortfolioValue({
        displayName,
        uniqID
    }, true)
        .then(function (TPV) {
            //console.log("aaa" + TPV)
            sendDialogflowResponse(res, TPV)
        },
        function (error) {
            console.log(error);
            sendDialogflowResponse(res, error)
        })
}

server.get('/rahul', (req, res) => {
    res.status(200).send('JAI - Welcome to AllCryptoCoinZ \n'+ new Date()).end();
  });

// server.listen((process.env.PORT || 8000), function () {
//     console.log("Server is up and running... ");
// });
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

function sendDialogflowResponse(res, result) {
  //console.log(gapp.body_.originalRequest.data.user.userId)
  
  if(Util.m_platform!="google"){
    res.send(result)
  }
    //console.log("result"+JSON.stringify(result))
  
//     res.send({"messages": [
//   {
//     "displayText": "Text response",
//     "platform": "google",
//     "textToSpeech": "A",//result.messages[0].subtitle,
//     "type": "simple_response"
//   }
// ]})
  
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
}

