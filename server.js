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
const Alexa = require('./AllCoinZ/Alexa')
const verifier = require('alexa-verifier-middleware')
var gUser = dbAllCoinZ.g_User;

const app = express();

var alexaRouter = express.Router()
app.use('/', alexaRouter)


//alexaRouter.use(verifier)

alexaRouter.use(bodyParser.urlencoded({
    extended: true
}));

alexaRouter.use(bodyParser.json());



let uniqID;
let displayName;
var currency = "";
var exchange = "CCCAGG"
var platform;

var gapp;
const ApiAiApp = require('actions-on-google').DialogflowApp;
let res;

var hanlders = Alexa.handlers
var languageStrings = Alexa.languageStrings


app.post('/', function (request, response, next) {


    //console.log(request)
    console.log(JSON.stringify(request.body))

    var reqsession = request.body.session
    if (reqsession != undefined) {
        if (reqsession.user != null) {
            if (reqsession.user.userId.toUpperCase().indexOf('AMZN') > -1) {
                Alexa.configure(request, response)
            }
        }
    } else {

        gapp = new ApiAiApp({
            request,
            response
        });

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
        actionMap.set('gethelp', help);
        actionMap.set('GoogleWelcomeContext', googleWelcomeContext)
        actionMap.set('ViewPortfolio-SelectItemAction', portfolioOptionSelect)
        actionMap.set('getCoinValueOption', getCoinValueOption)


        gapp.handleRequest(actionMap);
    }
})

function getCoinValueOption() {
    console.log("getCoinValueOption")
    const selectedItem = gapp.getContextArgument('actions_intent_option', 'OPTION').value;
}

function help() {
    GenProc.m_help(displayName)
}

function googleWelcomeContext() {
    if (gapp.isPermissionGranted()) {

        let userName = gapp.getUserName().displayName;
        displayName = userName
        let userID = gapp.getUser().user_id;
        dbAllCoinZ.g_UpdateInsert(gUser, {
            uniqID: uniqID
        }, {
            displayName: userName,
            uniqID: userID,
            curr: "USD"
        }).then(function () {
            GenProc.m_sendSimpleMessage("Hello " + userName + ", Welcome to AllCryptoCoinZ!!! Say help for getting assitance or Say a coin name ")
        }, function (error) {
            console.log(error)
        })
        // gapp.ask("Hi " + userName + " I can already tell you the value of crypto coin. Which coin would you like to select ? ");
    } else {
        GenProc.m_sendSimpleMessage("Hello  Welcome to AllCryptoCoinZ!!! Say help for getting assitance or Say a coin name ")
    }
}


function portfolioOptionSelect() {

    const selectedItem = gapp.getContextArgument('actions_intent_option', 'OPTION').value;

    var coinObject = {
        count: selectedItem.split('#')[0],
        CryptoCoin: selectedItem.split('#')[1]
    }
    if (!selectedItem) {
        gapp.ask('You did not select any item from the list');
    }
    getCoinValue(coinObject, true)
}

function DefaultWelcomeIntent() {

    if (Util.m_platform == "google") {
        let namePermission = gapp.SupportedPermissions.NAME;

        dbAllCoinZ.g_getRecord(gUser, {
            uniqID: gapp.getUser().user_id
        }).then(function (data) {
            if (data == null) {
                if (!gapp.isPermissionGranted()) {
                    return gapp.askForPermission('To address you by name and for saving portfolio details', gapp.SupportedPermissions.NAME);
                }
            } else {
                GenProc.m_sendSimpleMessage("Hello **" + data.displayName + "**,  \nWelcome to AllCryptoCoinZ!!!  \n  \n*Say a coin name* ")
            }
        })

    } else {
        GenProc.m_getWelcomeMessage(displayName)
    }
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
    GenProc.m_getDefaultFallBack()
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

function getCoinValue(coinObject, external) {

    Util.m_getCurrency(uniqID).then(function () {

        var count = 1;
        if (gapp.getArgument("count") != null) {
            count = gapp.getArgument("count")
        }
        var oCoin;
        if (external != true) {
            oCoin = Util.m_getCoinObject({
                count: count,
                CryptoCoin: gapp.getArgument("CryptoCoin")
            })
        } else {

            oCoin = Util.m_getCoinObject(coinObject)
        }
        oCoin.then(function (coinResult) {

            GenProc.m_sendCoinResponse(coinResult)

        }).catch(function (err) {
            console.log("m_getCoinObject method failed" + err)
        });
    })
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

app.listen((process.env.PORT || 8000), function () {
    //console.log("Server is up and running... ");

    fetchCoin.m_updateCoins("update").then(function (success) {
        console.log("Loaded the coin array without errors..")

    }, function (error) {
        console.log(error)
    })
});
app.get('/users/:secret?', (req, res) => {

    if (req.params.secret == "rmr999") {
        Util.m_getUsers().then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })
    } else {
        res.status(400).send("Check the request")
    }
});

app.get('/users/del/:key?/:secret?', (req, res) => {

    if (req.params.secret == "rmr999") {
        Util.m_deleteUser(req.params.key).then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })
    } else {
        res.status(400).send("Check request")
    }
});

app.get('/rahulmr', (req, res) => {
    res.status(200).send('JAI - Welcome to AllCryptoCoinZ \n' + new Date()).end();
});


app.get('/updateCoins/:optype?', (req, res) => {
    var optype = "";
    optype = req.params.optype

    fetchCoin.m_updateCoins(optype).then(function (success) {
        console.log(success)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(success)

    }, function (error) {
        console.log(error);
        res.status(400).send(error)
    })
});
app.get('/users/:secret?', (req, res) => {

    if (req.params.secret == "rmr999") {
        Util.m_getUsers().then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })


    } else {
        res.status(400).send("Check the request")
    }
});
app.get('/cv/:coin?', (req, res) => {

    if (req.params.coin != "") {

        var oCoin
        oCoin = Util.m_getCoinObject({
            Count: 1,
            CryptoCoin: req.params.coin,
            currency: "INR"
        })

        oCoin.then(function (CoinInfo) {

            var coinDetail = "💰" + "" + CoinInfo.CoinFN.toUpperCase() + "💰\n\n " + 1 + " " + CoinInfo.CoinSN + " = " + CoinInfo.CoinValue.RAW[CoinInfo.CoinSN][CoinInfo.CoinCurrency].PRICE.toFixed(5) + "\n "


            res.setHeader('Content-Type', 'application/text');
            res.status(200).send(coinDetail)

        }).catch(function (err) {
            console.log("m_getCoinObject method failed" + err)
        });



    } else {
        res.status(400).send("Check the request")
    }


});
app.get('/rahulmr', (req, res) => {
    res.status(200).send('JAI - Welcome to AllCryptoCoinZ \n' + new Date()).end();
});


app.get('/updateCoins/:optype?', (req, res) => {
    var optype = "";
    optype = req.params.optype

    fetchCoin.m_updateCoins(optype).then(function (success) {
        console.log(success)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(success)

    }, function (error) {
        console.log(error);
        res.status(400).send(error)
    })
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