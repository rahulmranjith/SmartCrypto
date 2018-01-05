'use strict'; //rahulmr

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
const app = express();
const Map = require('es6-map');

const Q = require('q')
const dbAllCoinZ = require('./db/initialize');

const telegramAPI = require('./AllCoinZ/telegram')
const Util = require('./AllCoinZ/util')

const GenProc = require('./AllCoinZ/GenericProcess')

//const telegramPush = require('./AllCoinZ/push')

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


server.post('/getCoinValue', function (req, res) {


    let result = req.body.result;
    let source = req.body.originalRequest.source

    //console.log(JSON.stringify(req.body.originalRequest))
    ////console.log(result.metadata.intentName)
    console.log(JSON.stringify(req.body))


    switch (source) {
        case "telegram":
            platform = "telegram"
            displayName = (req.body).originalRequest.data.message.chat.username;
            uniqID = (req.body).originalRequest.data.message.chat.id
            break;
        case "slack_testbot":
            displayName = (req.body).originalRequest.data.user;
            uniqID = (req.body).originalRequest.data.user;
            platform = "slack"
            break;
        case "skype":
            platform = "skype"
            break;
        default:
            platform = "telegram"
    }
    Util.m_platform = platform


  
    if (result.metadata.intentName == "ViewPortfolio") {

        GenProc.m_getTotalPortfolioValue({
            displayName,
            uniqID
        }, false).then(function (VPortfolio) {
            sendDialogflowResponse(res, VPortfolio)

        }, function (error) {
            console.log(error);
            sendDialogflowResponse(res, error)
        })
    } else if (result.metadata.intentName == "TotalPortfolioValue") {
        //var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform,displayName)
        //sendDialogflowResponse(res, welcomeMessageResponse)
        GenProc.m_getTotalPortfolioValue({
                displayName,
                uniqID
            }, true)
            .then(function (TPV) {
                    console.log("aaa" + TPV)
                    sendDialogflowResponse(res, TPV)
                },
                function (error) {
                    console.log(error);
                    sendDialogflowResponse(res, error)
                })





    } else if (result.metadata.intentName == "BuySellCoin") {
        //var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform,displayName)
        //sendDialogflowResponse(res, welcomeMessageResponse)
        GenProc.m_SyncPortfolio({
            displayName,
            uniqID
        }, result.parameters).then(function (message) {
            sendDialogflowResponse(res, message)
        }, function (error) {
            sendDialogflowResponse(res, error)
        })



    } else if (result.metadata.intentName == "Default Welcome Intent" || result.metadata.intentName =="help") {
        var welcomeMessageResponse = GenProc.m_getWelcomeMessage(platform, displayName)
        sendDialogflowResponse(res, welcomeMessageResponse)
    } else if (result.metadata.intentName == "getCoinValue") {

        Util.m_getCurrency(uniqID).then(function () {

            var count = 1;
            if (result.parameters.count != "") {
                count = result.parameters.count
            }

            var oCoin = Util.m_getCoinObject({
                count: count,
                CryptoCoin: result.parameters.CryptoCoin
            })
            oCoin.then(function (coinResult) {
                sendResult(true, coinResult, res)
            }).catch(function (err) {
                console.log("m_getCurrency method failed")
            });
        })

    } else if (result.metadata.intentName == "ChangeCurrency") {
        var userCurrency = result.parameters["currency-name"];
        if (userCurrency == "" && result.parameters["CryptoCoin"] !== "") {
            userCurrency = result.parameters["CryptoCoin"]
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

    } else if (result.metadata.intentName == "Default Fallback Intent") {
      
      
        sendDialogflowResponse(res, GenProc.m_callPayLoadFormatMessage("`Please check the keyword or Coin name .  Check help for keywords`"))
        //sendResult(false, null, res)
    }

});

server.listen((process.env.PORT || 8000), function () {
    //console.log("Server is up and running... ");
});

function sendDialogflowResponse(res, result) {

    res.send(result)

}

function sendResult(success, coinResult, res) {

    var text;
    var responseData

    var responseData = GenProc.m_getResponseMessage(coinResult)

    sendDialogflowResponse(res, responseData)
}