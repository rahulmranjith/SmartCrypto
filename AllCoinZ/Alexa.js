const Util = require('../AllCoinZ/util')
var Alexa = require('alexa-sdk');
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


const APP_ID = undefined;



const skillName = "AllCryptoCoinZ";

const COIN_SELECT_MESSAGE = [{
	MSG: 'Which coin would you like to select next ?'
}, {
	MSG: 'Name of the coin you want to try out next'
}, {
	MSG: 'Which coin value you need next ?'
}, {
	MSG: 'Which coin you need to try next '
}, {
	MSG: 'Please tell me next coin name'
}]

var SAMPLE_COINS = [{
	CoinName: "Bitcoin"
}, {
	CoinName: "Ripple"
}, {
	CoinName: "Ethereum"
}, {
	CoinName: "Cardano"
}]
var SAMPLE_CURRENCIES = [{
	Currency: "INR"
}, {
	Currency: "USD"
}, {
	Currency: "EURO"
}, {
	Currency: "CNY"
}]

var WELCOME_MESSAGE = "Welcome to " + skillName + " !! \nGet crypto currency values and  manage portfolios . For example, " + getGenericHelpMessage();
var HELP_MESSAGE = "I can help you find the value of a crypto coin or manage your portfolio.";
var NEW_SEARCH_MESSAGE = getGenericHelpMessage();
var SEARCH_STATE_HELP_MESSAGE = getGenericHelpMessage();
const SHUTDOWN_MESSAGE = "Ok.";
const EXIT_SKILL_MESSAGE = "Ok.";


const states = {
	SearchUpdateMODE: "_SearchUpdateMODE",
	RESULTS: "_RESULTS",
	MULTIPLE_RESULTS: "_MULTIPLE_RESULTS",
	UPDATE: "_UPDATE"
};

const newSessionHandlers = {
	"LaunchRequest": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"GetCoinValueByCountIntent": function () {
		console.log("SEARCH INTENT");
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("GetCoinValueByCountIntent");
	},
	"GetCoinValueByDecimalIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("GetCoinValueByDecimalIntent");
	},
	"UpdateCoinByCountIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("UpdateCoinByCountIntent");
	},
	"UpdateCoinByDecimalIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("UpdateCoinByDecimalIntent");
	},
	"ChangeCurrencyIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("ChangeCurrencyIntent");
	},
	"PortfolioIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("PortfolioIntent");
	},
	"TellMeMoreIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"TellCoinValueIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("GetCoinValueByCountIntent");
	},
	"AMAZON.YesIntent": function () {
		this.response.speak(getGenericHelpMessage()).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function () {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function () {
		this.response.speak(HELP_MESSAGE).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		var output = "Ok, starting over." + getGenericHelpMessage();
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"AMAZON.HelpIntent": function () {
		this.response.speak(HELP_MESSAGE + getGenericHelpMessage()).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function () {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("GetCoinValueByCountIntent");
	}
};
var searchUpdateHandlers = Alexa.CreateStateHandler(states.SearchUpdateMODE, {
	"AMAZON.YesIntent": function () {
		this.response.speak(NEW_SEARCH_MESSAGE).listen(NEW_SEARCH_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function () {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function () {
		var output;
		if (this.attributes.lastSearch) {
			output = this.attributes.lastSearch.lastSpeech;
		} else {
			output = getGenericHelpMessage();
		}
		this.emit(":ask", output, output);
	},
	"GetCoinValueByCountIntent": function () {
		GetCoinValueByCountIntentHandler.call(this);
	},
	"GetCoinValueByDecimalIntent": function () {
		GetCoinValueByDecimalIntentHandler.call(this);
	},
	"UpdateCoinByCountIntent": function () {
		confirmPortfolioUpdate.call(this);
	},
	"UpdateCoinByDecimalIntent": function () {
		confirmPortfolioUpdate.call(this);
	},
	"ChangeCurrencyIntent": function () {
		ChangeCurrencyIntentHandler.call(this);
	},
	"PortfolioIntent": function () {
		PortfolioHandler.call(this);
	},
	"TellChangeCurrencyIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellChangeCurrencyIntent");
	},
	"TellPortfolioIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellPortfolioIntent");
	},
	"TellCoinUpdateIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellCoinUpdateIntent");
	},
	"TellCoinValueIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellCoinValueIntent");
	},
	"TellMeMoreIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellMeMoreIntent");
	},
	"AMAZON.HelpIntent": function () {
		this.response.speak(getGenericHelpMessage()).listen(getGenericHelpMessage());
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		var output = "Ok, starting over." + getGenericHelpMessage();
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function () {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function () {
		console.log("Unhandled intent in startSearchHandlers");
		this.response.speak(SEARCH_STATE_HELP_MESSAGE).listen(SEARCH_STATE_HELP_MESSAGE);
		this.emit(':responseReady');
	}
});

function PortfolioHandler() {

	var self = this;
	const uniqID = this.event.context.System.user.userId

	dbAllCoinZ.g_getRecord(gUser, {
		uniqID: uniqID
	}).then(function (result) {
		let myPortfolio;
		if (result != null) {
			myPortfolio = result.portfolio;
		}
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
			var TotalDetails = "";

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

				TotalDetails = TotalDetails + "<break time='1s'/>" + (+myCoins[coin]).toFixed(3) + " <say-as interpret-as='characters'>" + coin + "</say-as> is " + priceinCurrency + myportFolioData.DISPLAY[coin][currency].TOSYMBOL + "\n"


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

			var summaryDetails = "Total Portfolio Value: " + totalCurrency.toFixed(3) + " " + displayCurrency + " equivalent to " + totalBTC.toFixed(5) + " " + displayBTC + "\n\n"
			//summaryDetails = summaryDetails + TotalDetails;

			var lastSearch = self.attributes.lastSearch = {
				summaryDetails: summaryDetails,
				TotalDetails: TotalDetails
			}
			self.attributes.lastSearch.lastIntent = "PortfolioIntent";
			self.emitWithState("TellPortfolioIntent");

			//console.log("\n*[TPV]:  " + " " + totalCurrency.toFixed(3) + " " + displayCurrency + " | " + totalBTC.toFixed(9) + " " + displayBTC)

		}).catch(function (err) {
			return deferred.reject(false);
		})

	})
}

function ChangeCurrencyIntentHandler() {
	var userCurrency = isSlotValid(this.event.request, "myCurrency");
	const uniqID = this.event.context.System.user.userId;

	var self = this;
	if (userCurrency == false) {
		this.emit(':ask', 'Currency could not be identified.No changes are made.')
		return;
	}
	userCurrency = userCurrency.toUpperCase();
	dbAllCoinZ.g_UpdateInsert(gUser, {
		uniqID: uniqID
	}, {
			displayName: "",
			uniqID: uniqID,
			curr: userCurrency
		}).then(function () {
			var lastSearch = self.attributes.lastSearch = "Default currency has been set to " + userCurrency + "."
			self.attributes.lastSearch.lastIntent = "TellChangeCurrencyIntent";
			self.emitWithState("TellChangeCurrencyIntent");

		}, function (error) {
			console.log(error)
		})
}


function confirmPortfolioUpdate() {
	var cryptoCoinValue = isSlotValid(this.event.request, "Coins");
	var inputcountSlotValue = isSlotValid(this.event.request, "Count");
	var decimalSlotValue = isSlotValid(this.event.request, "Decimal");
	var buySellSlotValue = isSlotValid(this.event.request, "BuySell");

	var slotsFilled = cryptoCoinValue && inputcountSlotValue && buySellSlotValue
	if (slotsFilled != false) {
		if (cryptoCoinValue == false) {
			return self.emit(':askWithCard', "Coin cannot be identified .Please try again.", "Coin cannot be identified .Please try again.", this.t('SKILL_NAME'), "Coin cannot be identified .Please try again.")
		} else {
			var coinShortName = jsCoin.m_findCoin(cryptoCoinValue.toUpperCase());
			if (coinShortName != undefined && coinShortName != null) {
				if (coinShortName.length > 0) {
					cryptoCoinValue = coinShortName[0].n.toUpperCase()
				};
			}
		}
		if (inputcountSlotValue != false) {
			inputcountSlotValue = parseInt(inputcountSlotValue);
			if (isNaN(inputcountSlotValue)) {
				inputcountSlotValue = 0;
			}
		}
		if (decimalSlotValue != false) {
			decimalSlotValue = parseInt(decimalSlotValue);
			if (isNaN(decimalSlotValue)) {
				decimalSlotValue = 0;
			} else {
				decimalSlotValue = '.' + decimalSlotValue
			}
		}

		inputcountSlotValue = +inputcountSlotValue + +decimalSlotValue;
		var buysell = buySellSlotValue.toUpperCase();

		if (buysell.indexOf('DEL') > -1) {
			inputcountSlotValue = "";
		}
		const speechOutput = 'You would like to ' + buysell + ' ' + inputcountSlotValue + ' ' +
			cryptoCoinValue.toUpperCase() + ', is that correct?';

		var lastSearch = this.attributes.lastSearch = {
			speechOutput: this.event.request,
		}

		this.attributes.lastSearch.lastIntent = "UpdateCoinByCountIntent";
		this.attributes.lastSearch.lastIntentStatus = "UpdateCoinByCountIntentPending"


		this.response.speak(speechOutput).listen(speechOutput);
		this.handler.state = states.RESULTS;
		this.emit(':responseReady');


	}
}

function UpdateCoinByCountIntentHandler() {
	var cryptoCoinValue = isSlotValid(this.attributes.lastSearch.speechOutput, "Coins");
	var inputcountSlotValue = isSlotValid(this.attributes.lastSearch.speechOutput, "Count");
	var decimalSlotValue = isSlotValid(this.attributes.lastSearch.speechOutput, "Decimal");
	var buySellSlotValue = isSlotValid(this.attributes.lastSearch.speechOutput, "BuySell");

	var UsrePortfolio;

	var inputcountSlotValue;
	var decimalSlotValue;
	var self = this;

	if (cryptoCoinValue == false) {
		return self.emit(':askWithCard', "Coin cannot be identified .Please try again.", "Coin cannot be identified .Please try again.", this.t('SKILL_NAME'), "Coin cannot be identified .Please try again.")
	} else {
		var coinShortName = jsCoin.m_findCoin(cryptoCoinValue.toUpperCase());
		if (coinShortName != undefined && coinShortName != null) {
			if (coinShortName.length > 0) {
				cryptoCoinValue = coinShortName[0].n.toUpperCase()
			};
		}

	}
	if (inputcountSlotValue != false) {
		inputcountSlotValue = parseInt(inputcountSlotValue);
		if (isNaN(inputcountSlotValue)) {
			inputcountSlotValue = 0;
		}
	}
	if (decimalSlotValue != false) {
		decimalSlotValue = parseInt(decimalSlotValue);
		if (isNaN(decimalSlotValue)) {
			decimalSlotValue = 0;
		} else {
			decimalSlotValue = '.' + decimalSlotValue
		}
	}

	inputcountSlotValue = +inputcountSlotValue + +decimalSlotValue;

	var userRequestedOption;
	switch (buySellSlotValue.toUpperCase()) {
		case "ADD":
		case "BUY [+]":
		case "ADD[+]":
		case "ADD COIN":
		case "B":
		case "BUY":
			userRequestedOption = "ADD";
			break;
		case "REMOVE":
		case "DELETE":
			userRequestedOption = "DELETE";
			break;
		case "SELL":
		case "S":
		case "DEDUCT[-]":
		case "DEDUCT":
			userRequestedOption = "DEDUCT";
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
		if (item == null) {
			updatedQuantity = inputcountSlotValue
			userInfoData = {
				displayName: displayName,
				uniqID: uniqID,
				curr: "INR",
				portfolio: JSON.stringify({
					[cryptoCoinValue]: inputcountSlotValue
				})
			}
		} else {
			var currentPortfolio = JSON.parse(item.portfolio)
			if (currentPortfolio != null) {
				if (currentPortfolio[cryptoCoinValue] == undefined) {
					currentPortfolio[cryptoCoinValue] = inputcountSlotValue;
				} else {
					//var updatedQuantity = 1;
					coinQuantity = currentPortfolio[cryptoCoinValue]
					if (userRequestedOption == "ADD") {
						updatetext = "added"
						updatedQuantity = +inputcountSlotValue + +coinQuantity;
					} else if (userRequestedOption == "DEDUCT") {
						updatetext = "deducted"
						updatedQuantity = +coinQuantity - inputcountSlotValue;
					} else if (userRequestedOption == "DELETE") {
						updatetext = "deleted"
						updatedQuantity = 0;
					}
					if (updatedQuantity < 0) {
						updatedQuantity = 0;
					}
					currentPortfolio[cryptoCoinValue] = updatedQuantity
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
						[cryptoCoinValue]: inputcountSlotValue
					})
				}
			}
		}
		var currentValue = inputcountSlotValue
		if (updatedQuantity != undefined) {
			currentValue = updatedQuantity
		}
		dbAllCoinZ.g_UpdateInsert(gUser, {
			uniqID: uniqID
		}, userInfoData).then(function () {

			var responseMessage = inputcountSlotValue + " " + cryptoCoinValue.toUpperCase() + " has been " + updatetext + " !!!\nAvailable " + cryptoCoinValue.toUpperCase() + " : " + currentValue;;
			self.handler.state = states.SearchUpdateMODE;
			self.attributes.lastSearch = {}//.lastSpeech = responseMessage;
			var repromptSpeech = getRandomValues(COIN_SELECT_MESSAGE, "MSG");

			self.response.speak(responseMessage).listen(repromptSpeech).cardRenderer("Portfolio Update :", responseMessage)
			self.emit(':responseReady');

		}, function (error) {
			//deferred.reject(error)
		})
	})

}

function GetCoinValueByCountIntentHandler() {

	if (this.attributes.lastSearch != undefined) {
		if (this.attributes.lastSearch.lastIntentStatus != undefined) {
			if (this.attributes.lastSearch.lastIntentStatus = "UpdateCoinByCountIntentPending") {
				UpdateCoinByCountIntentHandler.call(this);
				return;
			}
		}
	}



	var cryptoCoin = isSlotValid(this.event.request, "Coins");
	var inputcount = isSlotValid(this.event.request, "Count");
	var decimal = isSlotValid(this.event.request, "Decimal");

	const uniqID = this.event.context.System.user.userId;
	var self = this;
	var inputcount;
	var decimal;

	if (cryptoCoin == false) {
		var output = "Coin cannot be identified .Please try again."
		this.response.speak(output).listen(output);
		//return self.emit(':askWithCard', "Coin cannot be identified .Please try again.", "Coin cannot be identified .Please try again.", this.t('SKILL_NAME'), "Coin cannot be identified .Please try again.")
	}
	if (inputcount == false) {
		inputcount = 1;
	}
	if (decimal != false) {
		if (isNaN(decimal)) {
			decimal = 0;
		} else {
			decimal = '.' + decimal
		}
	}
	inputcount = +inputcount + +decimal;

	Util.m_getCurrency(uniqID).then(function () {
		var count = 1;
		if (inputcount != null) {
			count = inputcount
		}
		var oCoin;
		oCoin = Util.m_getCoinObject({
			count: count,
			CryptoCoin: cryptoCoin
		});
		oCoin.then(function (coinResult) {
			var result = [];
			result.push(coinResult)
			var lastSearch = self.attributes.lastSearch = {
				results: result
			};
			var output;

			//saving last intent to session attributes
			self.attributes.lastSearch.lastIntent = "GetCoinValueByCountIntent";
			self.emitWithState("TellCoinValueIntent");
			//ResponseMessage(coinResult, self)

		}).catch(function (err) {
			console.log("m_getCurrency method failed" + err)
			self.response.speak(generateSearchResultsMessage(searchQuery, false)).listen(generateSearchResultsMessage(searchQuery, false));

		});
	})
}



var descriptionHandlers = Alexa.CreateStateHandler(states.RESULTS, {


	"TellMeNoIntent": function () {
		if (this.attributes.lastSearch.lastIntent.toUpperCase() == "UPDATECOINBYCOUNTINTENT") {
			speechOutput = "Ok. I am cancelling the portfolio update " + getRandomValues(COIN_SELECT_MESSAGE, "MSG")
			repromptSpeech = " The portfolio update has been cancelled" + getRandomValues(COIN_SELECT_MESSAGE, "MSG")
			this.handler.state = states.SearchUpdateMODE;
			this.response.speak(speechOutput).listen(repromptSpeech);
			this.emit(':responseReady');
		}
	},
	"TellMeMoreIntent": function () {
		var speechOutput;
		var repromptSpeech;
		var cardContent;

		if (this.attributes.lastSearch.lastIntent.toUpperCase() == "PORTFOLIOINTENT") {
			var speechOutput = this.attributes.lastSearch.TotalDetails;
			this.handler.state = states.SearchUpdateMODE;
			this.attributes.lastSearch.lastSpeech = speechOutput;
			repromptSpeech = getRandomValues(COIN_SELECT_MESSAGE, "MSG");
			this.response.speak(speechOutput + "<break time ='1s'/> " + repromptSpeech).listen(repromptSpeech).cardRenderer("My Portfolio Detailed View :", removeSSML(speechOutput))
			this.emit(':responseReady')

		} else if (this.attributes.lastSearch.lastIntent.toUpperCase() == "UPDATECOINBYCOUNTINTENT") {

			UpdateCoinByCountIntentHandler.call(this);

		} else {
			speechOutput = getGenericHelpMessage();
			repromptSpeech = getGenericHelpMessage();
			this.handler.state = states.SearchUpdateMODE;
			this.response.speak(speechOutput).listen(repromptSpeech);
			this.emit(':responseReady');
		}

	},
	"TellPortfolioIntent": function () {
		var responseMessage = this.attributes.lastSearch.summaryDetails;
		this.handler.state = states.RESULTS;
		this.attributes.lastSearch.lastSpeech = responseMessage + " Would you like to hear the split wise details ?";
		this.response.speak(responseMessage + " Would you like to hear the split wise details ?").listen("Would you like to hear split wise details or Say a coin name.").cardRenderer("My Portfolio :", removeSSML(responseMessage))
		this.emit(':responseReady')


	},
	"TellChangeCurrencyIntent": function () {
		var responseMessage = this.attributes.lastSearch;
		this.handler.state = states.SearchUpdateMODE;
		this.attributes.lastSearch.lastSpeech = responseMessage;
		var repromptSpeech = getRandomValues(COIN_SELECT_MESSAGE, "MSG");

		this.response.speak(responseMessage).listen(repromptSpeech).cardRenderer("Currency Update :", responseMessage)
		this.emit(':responseReady');

	},

	"TellCoinUpdateIntent": function () {

		var responseMessage = this.attributes.lastSearch;
		this.handler.state = states.SearchUpdateMODE;
		this.attributes.lastSearch.lastSpeech = responseMessage;
		var repromptSpeech = getRandomValues(COIN_SELECT_MESSAGE, "MSG");
		this.response.speak(responseMessage).listen(repromptSpeech).cardRenderer("Portfolio Update :", responseMessage)
		this.emit(':responseReady');
	}

	,
	"TellCoinValueIntent": function () {

		var CoinInfo = this.attributes.lastSearch.results[0];
		var infoType = isSlotValid(this.event.request, "infoType");
		var speechOutput;
		var repromptSpeech;
		var cardContent;

		cardContent = generateCoinCard(CoinInfo)
		speechOutput = generateCoinMessage(CoinInfo)
		repromptSpeech = "Would you like to selet another coin? Say yes or no";
		this.handler.state = states.SearchUpdateMODE;
		this.attributes.lastSearch.lastSpeech = speechOutput;
		this.response.cardRenderer(cardContent.title, cardContent.body, cardContent.image);
		this.response.speak(speechOutput).listen(repromptSpeech);
		this.emit(':responseReady');
	},
	"GetCoinValueByCountIntent": function () {
		GetCoinValueByCountIntentHandler.call(this);
	},

	"AMAZON.HelpIntent": function () {
		var person = this.attributes.lastSearch.results[0];
		this.response.speak(generateNextPromptMessage(person, "current")).listen(generateNextPromptMessage(person, "current"));
		this.emit(':responseReady');
	},
	"AMAZON.StopIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.CancelIntent": function () {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellMeNoIntent");
	},
	"AMAZON.YesIntent": function () {
		this.handler.state = states.RESULTS;
		this.emitWithState("TellMeMoreIntent");
	},
	"AMAZON.RepeatIntent": function () {
		this.response.speak(this.attributes.lastSearch.lastSpeech).listen(this.attributes.lastSearch.lastSpeech);
		this.emit(':responseReady');
	},
	"AMAZON.StartOverIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		var output = "Ok, starting over." + getGenericHelpMessage();
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"SessionEndedRequest": function () {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function () {
		var person = this.attributes.lastSearch.results[0];
		console.log("Unhandled intent in DESCRIPTION state handler");
		this.response.speak("Sorry, I don't know that" + generateNextPromptMessage(person, "general"))
			.listen("Sorry, I don't know that" + generateNextPromptMessage(person, "general"));
		this.emit(':responseReady');
	}
});


function generateCoinCard(CoinInfo) {
	var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency]
	var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"]
	var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency)
	var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC)
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
	return {
		"title": "💰" + CoinInfo.CoinFN.toUpperCase() + "💰",
		"body": content,
		"image": imageObj
	};
}

function generateCoinMessage(CoinInfo) {
	var coinInfoinCurrency = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN][CoinInfo.CoinCurrency];
	var coinInfoinBTC = CoinInfo.CoinValue.DISPLAY[CoinInfo.CoinSN]["BTC"];
	var currencyPrice = Util.m_removeCurrencySymbols(coinInfoinCurrency);
	var BTCPrice = Util.m_removeCurrencySymbols(coinInfoinBTC);

	var soundop = '<say-as interpret-as="interjection">' + CoinInfo.CoinCount + " " + CoinInfo.CoinFN + ' is </say-as><break time="0.6s"/>' + (CoinInfo.CoinCount * currencyPrice).toFixed(2) + " " + coinInfoinCurrency.TOSYMBOL + ' <emphasis level="moderate">, ' + getRandomValues(COIN_SELECT_MESSAGE, "MSG") + '</emphasis>'
	return soundop;

}


function GetCoinValueByDecimalIntentHandler() {

	this.handler.state = states.SearchUpdateMODE;
	this.emitWithState("GetCoinValueByCountIntent");

}

function getGenericHelpMessage() {
	//'You can ask me to tell value of crypto coin, or, you can say exit... What can I help you with?',

	var sentences = ["ask - What's the value of " + getRandomValues(SAMPLE_COINS, "CoinName"),
	"say - Add 1.23 " + getRandomValues(SAMPLE_COINS, "CoinName"),
		"say - What's my portfolio",
	"say - Change currency to " + getRandomValues(SAMPLE_CURRENCIES, "Currency"),
	"say - Set Currency to " + getRandomValues(SAMPLE_CURRENCIES, "Currency")

	]
	const randomMessage = "You can " + sentences[getRandom(0, sentences.length - 1)];
	return randomMessage
}


function getRandomValues(arrayOfStrings, itemName) {
	var randomNumber = getRandom(0, arrayOfStrings.length - 1);
	return arrayOfStrings[randomNumber][itemName];
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}



function isSlotValid(request, slotName) {
	var slot = request.intent.slots[slotName];
	//console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
	var slotValue;

	//if we have a slot, get the text and store it into speechOutput
	if (slot && slot.value) {
		//we have a value in the slot
		slotValue = slot.value.toLowerCase();
		return slotValue;
	} else {
		//we didn't get a value in the slot.
		return false;
	}
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

	var alexa = Alexa.handler(request.body, context);
	alexa.resources = languageStrings;
	//alexa.registerHandlers(handlers);
	alexa.registerHandlers(newSessionHandlers, searchUpdateHandlers, descriptionHandlers);
	alexa.execute();
}

/////old
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
			if (result != null) {
				myPortfolio = result.portfolio;
			}
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
};


module.exports = {
	configure: configure
}