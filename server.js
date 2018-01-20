

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
const fetchCoin = require('./AllCoinZ/fetchCoin');
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
const ApiAiApp = require('actions-on-google').DialogflowApp;
let res;




server.post('/', function (request, response, next) {
  
    console.log(JSON.stringify(request.body))
    gapp = new ApiAiApp({ request, response });

    Google.m_gapp(gapp)
    //console.log("GAPP" + JSON.stringify(gapp.body_.originalRequest))


    res = response;
    Util.m_setHttpResponse(res)
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
            uniqID = gapp.body_.originalRequest.data.user.userId
            break;
        default:
            platform = "telegram"
    }
    Util.m_platform = platform

    let actionMap = new Map();
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
    GenProc.m_getWelcomeMessage(platform, displayName)
}

function ChangeCurrency() {
    var userCurrency = gapp.getArgument("currency-name")
    if (userCurrency == "" && gapp.getArgument["CryptoCoin"] !== "") {
        userCurrency = gapp.getArgument["CryptoCoin"]
    }
    if (userCurrency == "") {
        return GenProc.m_sendSimpleMessage("Currency could not be identified.No changes are made :(")
    }

    dbAllCoinZ.g_UpdateInsert(gUser, {
        uniqID: uniqID
    }, {
            displayName: displayName,
            uniqID: uniqID,
            curr: userCurrency
        }).then(function () {
            GenProc.m_sendSimpleMessage("Default currency has been set to " + userCurrency)
        }, function (error) {
            console.log(error)
        })
}

function DefaultFallbackIntent() {
    sendDialogflowResponse(res, GenProc.m_sendSimpleMessage("`Please check the keyword or Coin name .  Check help for keywords`"))
}
function BuySellCoin() {
    GenProc.m_SyncPortfolio({
        displayName,
        uniqID
    }, gapp)
    // .then(function (message) {
    //     sendDialogflowResponse(res, message)
    // }, function (error) {
    //     sendDialogflowResponse(res, error)
    // })
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

            GenProc.m_sendCoinResponse(coinResult)

        }).catch(function (err) {
            console.log("m_getCurrency method failed" + err)
        });
    }
    )
}
function ViewPortfolio() {
    GenProc.m_getTotalPortfolioValue({
        displayName,
        uniqID
    }, false)
    // .then(function (VPortfolio) {
    //     sendDialogflowResponse(res, VPortfolio)
    // }, function (error) {
    //     console.log(error);
    //     sendDialogflowResponse(res, error)
    // })
}
function TotalPortfolioValue() {
    GenProc.m_getTotalPortfolioValue({
        displayName,
        uniqID
    }, true)
        // .then(function (TPV) {
        //     //console.log("aaa" + TPV)
        //     sendDialogflowResponse(res, TPV)
        // },
        // function (error) {
        //     console.log(error);
        //     sendDialogflowResponse(res, error)
        // })
}

server.listen((process.env.PORT || 8000), function () {
    //console.log("Server is up and running... ");
    fetchCoin.m_updateCoins("").then(function (success) {
        console.log("Loaded the coin array without errors..")

    }, function (error) { console.log(error) })
});
server.get('/users/:value?', (req, res) => {

    if (req.params.value == "rmr999") {
        Util.m_getUsers().then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })


    } else { res.status(400).send("Check the request") }


});
server.get('/rahulmr', (req, res) => {
    res.status(200).send('JAI - Welcome to AllCryptoCoinZ \n' + new Date()).end();
});


server.get('/updateCoins/:optype?', (req, res) => {
    var optype = "";
    optype = req.params.optype

    fetchCoin.m_updateCoins(optype).then(function (success) {
        console.log(success)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(success)

    }, function (error) { console.log(error); res.status(400).send(error) })
});



function sendDialogflowResponse(res, result) {
    //console.log(gapp.body_.originalRequest.data.user.userId)

    if (Util.m_platform != "google") {
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

