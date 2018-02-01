const Util = require('../AllCoinZ/util')
var AlexaSDK = require('alexa-sdk');
const dbAllCoinZ = require('../db/initialize');
var gUser = dbAllCoinZ.g_User;
const GenProc = require('../AllCoinZ/GenericProcess')
const jsCoin = require('../AllCoinZ/jsonCoin');
const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'AllCryptoCoinZ',
            HELP_MESSAGE: 'You can ask me to tell value of crypto coin, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye! Have a good day.',
            LAUNCH_MESSAGE: 'Hello  Welcome to AllCryptoCoinZ!!! Say help for getting assistance or Say a coin name ',
            LAUNCH_MESSAGE_REPROMPT: 'Tell me a coin name for it\'s value or say help.'

        },
    }
};


const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('LAUNCH_MESSAGE');
        const repromptOutput = this.t('LAUNCH_MESSAGE_REPROMPT');
        this.emit(':askWithCard', speechOutput, repromptOutput, this.t('SKILL_NAME'), removeSSML(speechOutput));

    },
    'DefaultWelcomeIntent': function () {
        const speechOutput = this.t('LAUNCH_MESSAGE');
        const repromptOutput = this.t('LAUNCH_MESSAGE_REPROMPT');
        this.emit(':askWithCard', speechOutput, repromptOutput, this.t('SKILL_NAME'), removeSSML(speechOutput));

    },
    'ViewPortfolio': function () {
        var self = this;
        const uniqID = this.event.context.System.user.userId
        dbAllCoinZ.g_getRecord(gUser, {
            uniqID: uniqID
        }).then(function (result) {
            let myPortfolio;
            if (result != null) { myPortfolio = result.portfolio; }
            if (result == null || myPortfolio == null) {
                this.emit(':askWithCard', "Please create a new portfolio. Check help !!!", "Please create a new portfolio. Check help !!!", this.t('SKILL_NAME'), "Please create a new portfolio. Check help !!!");
            }
            if (result.curr == null) {
                Util.m_myCurrency == "INR"
            } else {
                Util.m_myCurrency = result.curr;
            }
            var jsonPortfolioParse = JSON.parse(myPortfolio)
            var oPortFolioLatestData = GenProc.m_getPortFolioCoinData(jsonPortfolioParse, Util.m_myCurrency)
            oPortFolioLatestData.then(function (myportFolioData) {
                console.log('total')

                var myCoins = jsonPortfolioParse;
                var currency = Util.m_myCurrency
                var op = "";

                var priceinBTC = 0;
                var priceinCurrency = 0;
                var totalBTC = 0;
                var totalCurrency = 0;
                var displayCurrency;
                var displayBTC;

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


                    link = BaseLinkUrl + cryptoCoin[0].u;
                    ilink = BaseLinkUrl + cryptoCoin[0].iu;


                    priceinBTC = (myportFolioData.RAW[coin]["BTC"].PRICE * myCoins[coin]).toFixed(9)
                    priceinCurrency = (myportFolioData.RAW[coin][currency].PRICE * myCoins[coin]).toFixed(2)
                    //description = priceinCurrency + "" + myportFolioData.DISPLAY[coin][currency].TOSYMBOL + " |" + " " + priceinBTC + "" + myportFolioData.DISPLAY[coin]["BTC"].TOSYMBOL

                    op = op + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as> is " + priceinCurrency + myportFolioData.DISPLAY[coin][currency].TOSYMBOL + "\n"


                    displayCurrency = myportFolioData.DISPLAY[coin][currency].TOSYMBOL
                    displayBTC = myportFolioData.DISPLAY[coin]["BTC"].TOSYMBOL

                    totalBTC = +totalBTC + +priceinBTC
                    totalCurrency = +totalCurrency + +priceinCurrency
                }
                const imageObj = {
                    smallImageUrl: 'https://i.imgur.com/yXARQuc.png',
                    largeImageUrl: 'https://i.imgur.com/yXARQuc.png'
                };
                if (cryptoCoin == '') {
                    return sendPortfolioUpdate("Please create a new portfolio. Check help !!!");
                }

                var title = "Total Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency + " equivalent to " + totalBTC.toFixed(5) + " " + displayBTC + "\n\n"
                title = title + op;

                self.emit(':askWithCard', title, title, "Portfolio Value:", removeSSML(title), imageObj)

                //console.log("\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC)

            }).catch(function (err) {
                return deferred.reject(false);
            })

        })


    },
    'BuySellCoin': function () {
        if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS") {
            this.emit(':delegate')
        }else{

            //this.emit(':askWithCard', "Ok. Completed", "The portfolio update has been cancelled. Which coin next ?", this.t('SKILL_NAME'), "The portfolio update has been cancelled now. Which coin next ?")

            const slotToElicit = 'Coins';
            const speechOutput = 'Where coin would you like to use ?';
            const repromptSpeech = speechOutput;
            return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech)
        }
    },


    'BuySellCoin1': function () {

        console.log("dialog state " + this.event.request.dialogState)
        console.log("confirmation status " + this.event.request.intent.confirmationStatus)

        const intentObj = this.event.request.intent;
        if (intentObj.confirmationStatus !== 'CONFIRMED') {
            if (intentObj.confirmationStatus !== 'DENIED') {
                // Intent is not confirmed
                if (!intentObj.slots.Coins.value) {
                    const slotToElicit = 'Coins';
                    const speechOutput = 'Where coin would you like to use ?';
                    const repromptSpeech = speechOutput;
                    return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech)

                }
                var inputcount;
                var decimal;
                const coin = this.event.request.intent.slots.Coins.value


                if (this.event.request.intent.slots.Count != undefined) {
                    inputcount = parseInt(this.event.request.intent.slots.Count.value);
                    if (isNaN(inputcount)) {
                        inputcount = 0;
                    } else {
                        inputcount = inputcount
                    }
                }
                if (this.event.request.intent.slots.Decimal != undefined) {
                    decimal = parseInt(this.event.request.intent.slots.Decimal.value);
                    if (isNaN(decimal)) {
                        decimal = 0;
                    } else {
                        decimal = '.' + decimal
                    }
                }

                var buysell = this.event.request.intent.slots.BUYSELL.value.toUpperCase();

                inputcount = +inputcount + +decimal;
                const speechOutput = 'You would like to ' + buysell + ' ' + inputcount + ' ' +
                    coin.toUpperCase() + ', is that correct?';

                const cardTitle = "Portfolio Update :";
                const repromptSpeech = speechOutput;
                const cardContent = speechOutput;
                this.emit(':confirmIntentWithCard', speechOutput, repromptSpeech, cardTitle, cardContent);
            } else {
                // Users denies the confirmation of intent. May be value of the slots are not correct.
                //handleIntentConfimationDenial();
                console.log("denied");
                this.emit(':askWithCard', "Ok. I am cancelling the portfolio update.Which coin would you like to select next ?", "The portfolio update has been cancelled. Which coin next ?", this.t('SKILL_NAME'), "The portfolio update has been cancelled now. Which coin next ?")

            }
        } else {
            console.log("confirmed")
            var portfolio;
            var cryptoCoin = this.event.request.intent.slots.Coins.value;
            var inputcount;
            var decimal;
            var self = this;

            if (cryptoCoin == undefined) {
                return self.emit(':askWithCard', "Coin cannot be identified .Please try again.", "Coin cannot be identified .Please try again.", this.t('SKILL_NAME'), "Coin cannot be identified .Please try again.")
            } else {
                var shortName = jsCoin.m_findCoin(cryptoCoin.toUpperCase());
                if (shortName != undefined && shortName != null) {
                    if (shortName.length > 0) {
                        cryptoCoin = shortName[0].n.toUpperCase()
                    };
                }

            }
            if (this.event.request.intent.slots.Count != undefined) {
                inputcount = parseInt(this.event.request.intent.slots.Count.value);
                if (isNaN(inputcount)) {
                    inputcount = 0;
                } else {
                    inputcount = inputcount
                }
            }
            if (this.event.request.intent.slots.Decimal != undefined) {
                decimal = parseInt(this.event.request.intent.slots.Decimal.value);
                if (isNaN(decimal)) {
                    decimal = 0;
                } else {
                    decimal = '.' + decimal
                }
            }
            inputcount = +inputcount + +decimal;


            var BuySell;

            switch (this.event.request.intent.slots.BUYSELL.value.toUpperCase()) {
                case "ADD":
                case "BUY [+]":
                case "ADD[+]":
                case "ADD COIN":
                case "B":
                case "BUY":
                    BuySell = "ADD";
                    break;
                case "REMOVE":
                case "DELETE":
                    BuySell = "DELETE";
                    break;
                case "SELL":
                case "S":
                case "DEDUCT[-]":
                case "DEDUCT":
                    BuySell = "DEDUCT";
                    break;
                default:
                    break;
            }

            const uniqID = this.event.context.System.user.userId;
            const displayName = "";
            dbAllCoinZ.g_getRecord(gUser, {
                uniqID: uniqID
            }).then(function (item) {
                var coinQuantity;
                var updatedQuantity
                var updatetext = "added";
                //console.log("items" + item);
                if (item == null) {
                    updatedQuantity = inputcount
                    userInfoData = {
                        displayName: displayName,
                        uniqID: uniqID,
                        curr: "INR",
                        portfolio: JSON.stringify({
                            [cryptoCoin]: inputcount
                        })
                    }
                    //console.log(JSON.stringify(item))
                } else {
                    var currentPortfolio = JSON.parse(item.portfolio)
                    if (currentPortfolio != null) {
                        if (currentPortfolio[cryptoCoin] == undefined) {
                            currentPortfolio[cryptoCoin] = inputcount;
                        } else {
                            //var updatedQuantity = 1;
                            coinQuantity = currentPortfolio[cryptoCoin]
                            if (BuySell == "ADD") {
                                updatetext = "added"
                                updatedQuantity = +inputcount + +coinQuantity;
                            } else if (BuySell == "DEDUCT") {
                                updatetext = "deducted"
                                updatedQuantity = +coinQuantity - inputcount;
                            } else if (BuySell == "DELETE") {
                                updatetext = "deleted"
                                updatedQuantity = 0;
                            }
                            if (updatedQuantity < 0) {
                                updatedQuantity = 0;
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
                            displayName: "",
                            uniqID: uniqID,
                            curr: "INR",
                            portfolio: JSON.stringify({
                                [cryptoCoin]: inputcount
                            })
                        }
                    }
                }
                var currentValue = inputcount
                if (updatedQuantity != undefined) {
                    currentValue = updatedQuantity
                }
                dbAllCoinZ.g_UpdateInsert(gUser, {
                    uniqID: uniqID
                }, userInfoData).then(function () {

                    var responsetext = inputcount + " " + cryptoCoin.toUpperCase() + " has been " + updatetext + "!!!\nAvailable " + cryptoCoin.toUpperCase() + ": " + currentValue

                    return self.emit(':askWithCard', responsetext, "Which coin next ?", "Portfolio Update :", responsetext)



                }, function (error) {
                    //deferred.reject(error)
                })
            })
            // return deferred.promise;

        }
    },
    'BuySellCoin1': function () {

        // const intentObj = this.event.request.intent;
        // if (intentObj.confirmationStatus !== 'CONFIRMED') {
        //     if (intentObj.confirmationStatus !== 'DENIED') {
        //         // Intent is not confirmed
        //         const speechOutput = 'You would like to book flight from ' + 'a' + ' to ' +
        //         'b' + ', is that correct?';
        //         const cardTitle = 'Booking Summary';
        //         const repromptSpeech = speechOutput;
        //         const cardContent = speechOutput;
        //         this.emit(':confirmIntentWithCard', speechOutput, repromptSpeech, cardTitle, cardContent);
        //     } else {
        //         // Users denies the confirmation of intent. May be value of the slots are not correct.
        //         handleIntentConfimationDenial();
        //     }
        // } else {
        //     processBuySell();
        // }
    },

    'ChangeCurrency': function () {

        const userCurrency = this.event.request.intent.slots.Currency.value;
        const uniqID = this.event.context.System.user.userId;
        var self = this;
        if (userCurrency == "") {
            this.emit(':ask', 'Currency could not be identified.No changes are made.')

        }

        dbAllCoinZ.g_UpdateInsert(gUser, {
            uniqID: uniqID
        }, {
                displayName: "",
                uniqID: uniqID,
                curr: userCurrency
            }).then(function () {
                self.emit(':ask', "Default currency has been set to " + userCurrency + ".")
            }, function (error) {
                console.log(error)
            })


    },

    'Unhandled': function () {
        this.emit(':ask', `I\'m sorry, but I\'m not sure what you asked me.`)
    },

    'GetCoinValue': function () {

        const uniqID = this.event.context.System.user.userId;
        var self = this;

        var request = require('request');
        var input = this.event;
        var cryptoCoin = input.request.intent.slots.Coins.value;
        var inputcount;
        var decimal;

        if (cryptoCoin == undefined) {

            return self.emit(':askWithCard', "Coin cannot be identified .Please try again.", "Coin cannot be identified .Please try again.", this.t('SKILL_NAME'), "Coin cannot be identified .Please try again.")
        }
        if (input.request.intent.slots.Count != undefined) {
            inputcount = parseInt(input.request.intent.slots.Count.value);
            if (isNaN(inputcount)) {
                inputcount = 0;
            } else {
                inputcount = inputcount
            }
        }
        if (input.request.intent.slots.Decimal != undefined) {
            decimal = parseInt(input.request.intent.slots.Decimal.value);
            if (isNaN(decimal)) {
                decimal = 0;
            } else {
                decimal = '.' + decimal
            }

        }
        inputcount = +inputcount + +decimal;
        if (inputcount == 0) {
            inputcount = 1;
        }

        Util.m_getCurrency(uniqID).then(function () {

            var count = 1;
            if (inputcount != null) {
                count = inputcount
            }
            var oCoin;

            oCoin = Util.m_getCoinObject({
                count: count,
                CryptoCoin: cryptoCoin
            })

            oCoin.then(function (coinResult) {

                ResponseMessage(coinResult, self)

            }).catch(function (err) {
                console.log("m_getCurrency method failed" + err)
            });
        })

        // if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS") {
        //     this.context.succeed({
        //         "response": {
        //             "directives": [{
        //                 "type": "Dialog.Delegate"
        //             }],
        //             "shouldEndSession": false
        //         },
        //         "sessionAttributes": {}
        //     });
        // } else {

        //     var self = this;
        //     var request = require('request');
        //     var input = this.event;

        //     var cryptoCoin = "";
        //     var speechOutput = "";
        //     cryptoCoin = input.request.intent.slots['CryptoCoin'];
        //     var currency = "INR";//input.request.intent.slots['Currency'];
        //     var speechOP = "";

        //     if (cryptoCoin.value == undefined || currency == undefined) {
        //         speechOP = "Coin or Currency cannot be identified.";
        //     } else {
        //         cryptoCoin = getCOIN(cryptoCoin.value.toUpperCase());;
        //         console.log(cryptoCoin);
        //         if (cryptoCoin == "NA") {
        //             speechOP = "Coin cannot be identified";
        //         }
        //     }
        //     if (speechOP != "") {
        //         self.emit(':tellWithCard', speechOP, self.t('SKILL_NAME'), speechOP);
        //     }
        //     else {
        //         var baseUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
        //         var parsedUrl = baseUrl + cryptoCoin + "&tsyms=" + currency;
        //         //'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR'

        //         var request = require('request');
        //         request(parsedUrl, function (error, response, body) {
        //             var JSONResponse = JSON.parse(response.body);
        //             var coinValue = JSONResponse[cryptoCoin][currency];

        //             if (coinValue != undefined) {
        //                 coinValue = coinValue.toFixed(2);
        //                 speechOP = cryptoCoin + " is " + coinValue + " " + currency;
        //             } else {
        //                 speechOP = "Could not fetch value of " + cryptoCoin;
        //             }
        //             speechOutput = speechOP
        //             self.emit(':tellWithCard', speechOutput, self.t('SKILL_NAME'), speechOutput);
        //         });

        //     }

        // }
    },
    'AMAZON.HelpIntent': function () {
        const imageObj = {
            smallImageUrl: 'https://i.imgur.com/yXARQuc.png',
            largeImageUrl: 'https://i.imgur.com/yXARQuc.png'
        };
        const help = 'To change the default currency say "Set currency to USD"  ' +
            '  \n\n  To add a coin to portfolio say  "Add 1.23 XRP"  ' +
            '  \n\n To reduce a coin count from portfolio say "Deduct 0.23 BCH"  ' +
            '  \n\n  To delete a coin from portfolio say  "Delete XRP"  ' +
            '  \n\n  To get the portfolio askWhat\'s my portfolio?  '

        const speechOutput = this.t('LAUNCH_MESSAGE');
        const repromptOutput = "Please say a coin name or say help"

        this.emit(':askWithCard', help, repromptOutput, this.t('SKILL_NAME'), help, imageObj)
        //this.emit(':askWithCard', help, repromptOutput, this.t('SKILL_NAME'), removeSSML(speechOutput));

    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
};


function ResponseMessage(CoinInfo, self) {

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



    var simpleResponse = CoinInfo.CoinCount + " " + CoinInfo.CoinFN + ' is <emphasis level="strong">' + (CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " + coinInfoinCurrency.TOSYMBOL + '</emphasis><break time="2" />, Which coin next ?';

    var content = "  \n " + CoinInfo.CoinCount + " " + CoinInfo.CoinSN + " = " + (CoinInfo.CoinCount * currencyPrice).toFixed(5) + " " + coinInfoinCurrency.TOSYMBOL + "" +
        "  \n " + CoinInfo.CoinCount + "" + CoinInfo.CoinSN + " = " + (CoinInfo.CoinCount * BTCPrice).toFixed(9) + " " + coinInfoinBTC.TOSYMBOL + "" +
        "  \n % in 24 Hrs : " + coinInfoinCurrency.CHANGEPCT24HOUR + "" +
        "  \n High Day : " + coinInfoinCurrency.HIGHDAY + "" +
        "  \n Low Day : " + coinInfoinCurrency.LOWDAY + "" +
        "  \n Market Cap : " + coinInfoinCurrency.MKTCAP + "" +
        "  \n Updated : " + coinInfoinCurrency.LASTUPDATE + ""

    const imageObj = {
        smallImageUrl: CoinInfo.CoinImg,
        largeImageUrl: CoinInfo.CoinImg
    };

    var sound = '<say-as interpret-as="interjection">' + CoinInfo.CoinCount + " " + CoinInfo.CoinFN + ' is </say-as><break time="0.6s"/>' + (CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " + coinInfoinCurrency.TOSYMBOL + ' <emphasis level="moderate">, Which coin next ?</emphasis>'
    self.emit(':askWithCard', sound, "Which coin would you want to select next ?", self.t('SKILL_NAME'), content, imageObj)

}
function processBuySell() {



}
function removeSSML(s) {
    return s.replace(/<\/?[^>]+(>|$)/g, "");
};


function configure(request, response) {

    //amazon alexa context
    var context = {
        succeed: function (result) {
            console.log(result);
            response.json(result);
        },
        fail: function (error) {
            console.log(error);
        }
    };

    var alexa = AlexaSDK.handler(request.body, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
}

module.exports = {
    configure: configure
}