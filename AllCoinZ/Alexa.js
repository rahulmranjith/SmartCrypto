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


//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = undefined;

// =====================================================================================================
// --------------------------------- Section 1. Data and Text strings  ---------------------------------
// =====================================================================================================
//TODO: Replace this data with your own.
//======================================================================================================

const data = [{
		firstName: "dave",
		lastName: "isbitski",
		title: "Chief Alexa evangelist",
		cityName: "philadelphia",
		twitter: "thedavedev",
		saytwitter: "the dave dev",
		github: "disbitski",
		saygithub: "d, isbitski",
		linkedin: "https://www.linkedin.com/in/davidisbitski",
		saylinkedin: "david isbitski",
		joinDate: "October 2015",
		gender: "m"
	},
	{
		firstName: "paul",
		lastName: "cutsinger",
		title: "Head of Voice Design Education on Amazon Alexa",
		cityName: "seattle",
		twitter: "paulcutsinger",
		saytwitter: "paul cutsinger",
		github: "paulcutsinger",
		saygithub: "paulcutsinger",
		linkedin: "https://www.linkedin.com/in/paulcutsinger",
		saylinkedin: "paul cutsinger",
		joinDate: "January 2016",
		gender: "m"
	},
	{
		firstName: "amit",
		lastName: "jotwani",
		title: "an Alexa AI and machine learning evangelist",
		cityName: "new york",
		twitter: "amit",
		saytwitter: "amit",
		github: "ajot",
		saygithub: "a, jot",
		linkedin: "https://www.linkedin.com/in/ajotwani",
		saylinkedin: "a jotwani",
		joinDate: "February 2016",
		gender: "m"
	},
	{
		firstName: "jeff",
		lastName: "blankenburg",
		title: "an Alexa evangelist",
		cityName: "columbus",
		twitter: "jeffblankenburg",
		saytwitter: "jeff blankenburg",
		github: "jeffblankenburg",
		saygithub: "jeffblankenburg",
		linkedin: "https://www.linkedin.com/in/jeffblankenburg",
		saylinkedin: "jeff blankenburg",
		joinDate: "September 2016",
		gender: "m"
	},
	{
		firstName: "rob",
		lastName: "mccauley",
		title: "a Solutions Architect on the Alexa Skills Team",
		cityName: "boston",
		twitter: "robmccauley",
		saytwitter: "rob mccauley",
		github: "robm26",
		saygithub: "rob m 26",
		linkedin: "https://www.linkedin.com/in/robm26",
		saylinkedin: "rob m 26",
		joinDate: "February 2016",
		gender: "m"
	},
	{
		firstName: "memo",
		lastName: "doring",
		title: "a Solutions Architect on the Alexa Skills Team",
		cityName: "seattle",
		twitter: "memodoring",
		saytwitter: "memo doring",
		github: "memodoring",
		saygithub: "memo doring",
		linkedin: "https://www.linkedin.com/in/guillermodoring",
		saylinkedin: "guillermo doring",
		joinDate: "April 2016",
		gender: "m"
	},
	{
		firstName: "jen",
		lastName: "gilbert",
		title: "a Marketing Manager on the Alexa Skills team",
		cityName: "seattle",
		twitter: "thejengil",
		saytwitter: "the jengil",
		github: "jengilbert",
		saygithub: "jen gilbert",
		linkedin: "https://www.linkedin.com/in/jenpaullgilbert/",
		saylinkedin: "jen paull gilbert",
		joinDate: "June 2016",
		gender: "f"
	}
];


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
//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Welcome to " + skillName + " !! \nGet crypto currency values and  manage portfolios . For example, " + getGenericHelpMessage(data);

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "I can help you find the value of a crypto coin or manage your portfolio.";

//This is the message a user will hear when they begin a new search
var NEW_SEARCH_MESSAGE = getGenericHelpMessage(data);

//This is the message a user will hear when they ask Alexa for help while in the SEARCH state
var SEARCH_STATE_HELP_MESSAGE = getGenericHelpMessage(data);

const DESCRIPTION_STATE_HELP_MESSAGE = "Here are some things you can say: Tell me more, or give me his or her contact info";

const MULTIPLE_RESULTS_STATE_HELP_MESSAGE = "Sorry, please say the first and last name of the person you'd like to learn more about";

// This is the message use when the decides to end the search
const SHUTDOWN_MESSAGE = "Ok.";

//This is the message a user will hear when they try to cancel or stop the skill.
const EXIT_SKILL_MESSAGE = "Ok.";

// =====================================================================================================
// ------------------------------ Section 2. Skill Code - Intent Handlers  -----------------------------
// =====================================================================================================
// CAUTION: Editing anything below this line might break your skill.
//======================================================================================================

const states = {
	SearchUpdateMODE: "_SearchUpdateMODE",
	RESULTS: "_RESULTS",
	MULTIPLE_RESULTS: "_MULTIPLE_RESULTS",
	UPDATE: "_UPDATE"
};

const newSessionHandlers = {
	"LaunchRequest": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage(data));
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
		this.response.speak(WELCOME_MESSAGE).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"TellCoinValueIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		this.emitWithState("GetCoinValueByCountIntent");
	},

	"AMAZON.YesIntent": function () {
		this.response.speak(getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function () {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function () {
		this.response.speak(HELP_MESSAGE).listen(getGenericHelpMessage(data));
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
		var output = "Ok, starting over." + getGenericHelpMessage(data);
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"AMAZON.HelpIntent": function () {
		this.response.speak(HELP_MESSAGE + getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
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
			output = getGenericHelpMessage(data);
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
		this.response.speak(getGenericHelpMessage(data)).listen(getGenericHelpMessage(data));
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
		var output = "Ok, starting over." + getGenericHelpMessage(data);
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



function help() {

}

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

			// var portfolioUpdateText = inputcountSlotValue + " " + cryptoCoinValue.toUpperCase() + " has been " + updatetext + " !!!\nAvailable " + cryptoCoinValue.toUpperCase() + " : " + currentValue;
			// var lastSearch = self.attributes.lastSearch = portfolioUpdateText
			// self.attributes.lastSearch.lastIntent = "UpdateCoinByCountIntent";
			// self.handler.state = states.RESULTS
			// self.emitWithState("TellCoinUpdateIntent");

			var responseMessage = inputcountSlotValue + " " + cryptoCoinValue.toUpperCase() + " has been " + updatetext + " !!!\nAvailable " + cryptoCoinValue.toUpperCase() + " : " + currentValue;;
			self.handler.state = states.SearchUpdateMODE;
			self.attributes.lastSearch.lastSpeech = responseMessage;
			var repromptSpeech = getRandomValues(COIN_SELECT_MESSAGE, "MSG");

			self.response.speak(responseMessage).listen(repromptSpeech).cardRenderer("Portfolio Update :", responseMessage)
			self.emit(':responseReady');

		}, function (error) {
			//deferred.reject(error)
		})
	})
	// return deferred.promise;




}

function GetCoinValueByCountIntentHandler() {
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

	// var cityName = isSlotValid(this.event.request, "cityName");
	// var infoType = isSlotValid(this.event.request, "infoType");

	// var canSearch = figureOutWhichSlotToSearchBy(firstName, lastName, cityName);
	// console.log("canSearch is set to = " + canSearch);

	// if (canSearch) {
	// 	var searchQuery = this.event.request.intent.slots[canSearch].value;
	// 	var searchResults = searchDatabase(data, searchQuery, canSearch);

	// 	//saving lastSearch results to the current session
	// 	var lastSearch = this.attributes.lastSearch = searchResults;
	// 	var output;

	// 	//saving last intent to session attributes
	// 	this.attributes.lastSearch.lastIntent = "GetCoinValueByCountIntent";

	// 	if (searchResults.count > 1) { //multiple results found
	// 		console.log("Search compvare. Multiple results were found");
	// 		var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
	// 		output = generateSearchResultsMessage(searchQuery, searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
	// 		this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
	// 		this.attributes.lastSearch.lastSpeech = output;
	// 		this.response.speak(output).listen(output);
	// 	} else if (searchResults.count == 1) { //one result found
	// 		this.handler.state = states.RESULTS; // change state to description
	// 		console.log("one match was found");
	// 		if (infoType) {
	// 			//if a specific infoType was requested, redirect to specificInfoIntent
	// 			console.log("infoType was provided as well");
	// 			this.emitWithState("TellCoinValueIntent");
	// 		}
	// 		else {
	// 			console.log("no infoType was provided.");
	// 			output = generateSearchResultsMessage(searchQuery, searchResults.results);
	// 			this.attributes.lastSearch.lastSpeech = output;
	// 			this.response.speak(output).listen(output);
	// 		}
	// 	}
	// 	else {//no match found
	// 		console.log("no match found");
	// 		console.log("searchQuery was  = " + searchQuery);
	// 		console.log("searchResults.results was  = " + searchResults);
	// 		output = generateSearchResultsMessage(searchQuery, searchResults.results);
	// 		this.attributes.lastSearch.lastSpeech = output;
	// 		// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
	// 		this.response.speak(output).listen(output);
	// 	}
	// }
	// else {
	// 	console.log("no searchable slot was provided");
	// 	console.log("searchQuery was  = " + searchQuery);
	// 	console.log("searchResults.results was  = " + searchResults);

	// 	this.response.speak(generateSearchResultsMessage(searchQuery, false)).listen(generateSearchResultsMessage(searchQuery, false));
	// }

	//this.emit(':responseReady');
}


var multipleSearchResultsHandlers = Alexa.CreateStateHandler(states.MULTIPLE_RESULTS, {

	"AMAZON.StartOverIntent": function () {
		this.handler.state = states.SearchUpdateMODE;
		var output = "Ok, starting over." + getGenericHelpMessage(data);
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"AMAZON.YesIntent": function () {
		var output = "Hmm. I think you said - yes, but can you please say the name of the person you'd like to learn more about?";
		this.response.speak(output).listen(output);
		this.emit(':responseReady');
	},
	"AMAZON.NoIntent": function () {
		this.response.speak(SHUTDOWN_MESSAGE);
		this.emit(':responseReady');
	},
	"AMAZON.RepeatIntent": function () {
		this.response.speak(this.attributes.lastSearch.lastSpeech).listen(this.attributes.lastSearch.lastSpeech);
		this.emit(':responseReady');
	},
	"GetCoinValueByCountIntent": function () {
		var slots = this.event.request.intent.slots;
		var firstName = isSlotValid(this.event.request, "firstName");
		var lastName = isSlotValid(this.event.request, "lastName");
		var cityName = isSlotValid(this.event.request, "cityName");
		var infoType = isSlotValid(this.event.request, "infoType");

		console.log("firstName:" + firstName);
		console.log("firstName:" + lastName);
		console.log("firstName:" + cityName);
		console.log("firstName:" + infoType);
		console.log("Intent Name:" + this.event.request.intent.name);

		var canSearch = figureOutWhichSlotToSearchBy(firstName, lastName, cityName);
		console.log("Multiple results found. canSearch is set to = " + canSearch);
		var speechOutput;

		if (canSearch)
			var searchQuery = slots[canSearch].value;
		var searchResults = searchDatabase(this.attributes.lastSearch.results, searchQuery, canSearch);
		var lastSearch;
		var output;

		if (searchResults.count > 1) { //multiple results found again
			console.log("multiple results were found again");
			this.handler.state = states.MULTIPLE_RESULTS;
			output = this.attributes.lastSearch.lastSpeech;
			this.response.speak(output).listen(output);
		} else if (searchResults.count == 1) { //one result found
			this.attributes.lastSearch = searchResults;
			lastSearch = this.attributes.lastSearch;
			this.handler.state = states.RESULTS;
			output = generateSearchResultsMessage(searchQuery, searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			this.response.speak(output).listen(output);

		} else { //no match found
			lastSearch = this.attributes.lastSearch;
			var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
			speechOutput = MULTIPLE_RESULTS_STATE_HELP_MESSAGE + ", " + listOfPeopleFound;
			this.response.speak(speechOutput).listen(speechOutput);
		}
		this.emit(':responseReady');
	},

	"AMAZON.HelpIntent": function () {
		this.response.speak(MULTIPLE_RESULTS_STATE_HELP_MESSAGE).listen(MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
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
	"SessionEndedRequest": function () {
		this.emit("AMAZON.StopIntent");
	},
	"Unhandled": function () {
		console.log("Unhandled intent in multipleSearchResultsHandlers");
		this.response.speak(MULTIPLE_RESULTS_STATE_HELP_MESSAGE).listen(MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
		this.emit(':responseReady');
	}
});
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
			speechOutput = getGenericHelpMessage(data);
			repromptSpeech = getGenericHelpMessage(data);
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
		var output = "Ok, starting over." + getGenericHelpMessage(data);
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

// ------------------------- END of Intent Handlers  ---------------------------------


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

function searchDatabase(dataset, searchQuery, searchType) {
	var matchFound = false;
	var results = [];

	//beginning search
	for (var i = 0; i < dataset.length; i++) {
		if (sanitizeSearchQuery(searchQuery) == dataset[i][searchType]) {
			results.push(dataset[i]);
			matchFound = true;
		}
		if ((i == dataset.length - 1) && (matchFound == false)) {
			//this means that we are on the last record, and no match was found
			matchFound = false;
			console.log("no match was found using " + searchType);
			//if more than searchable items were provided, set searchType to the next item, and set i=0
			//ideally you want to start search with lastName, then firstname, and then cityName
		}
	}
	return {
		count: results.length,
		results: results
	};
}

function figureOutWhichSlotToSearchBy(firstName, lastName, cityName) {
	if (lastName) {
		console.log("search by lastName");
		return "lastName";
	} else if (!lastName && firstName) {
		console.log("search by firstName");
		return "firstName";
	} else if (!lastName && !firstName && cityName) {
		console.log("search by cityName");
		return "cityName";
	} else {
		console.log("no valid slot provided. can't search.");
		return false;
	}
}

function GetCoinValueByCountIntentHandler1() {
	var firstName = isSlotValid(this.event.request, "firstName");
	var lastName = isSlotValid(this.event.request, "lastName");
	var cityName = isSlotValid(this.event.request, "cityName");
	var infoType = isSlotValid(this.event.request, "infoType");

	var canSearch = figureOutWhichSlotToSearchBy(firstName, lastName, cityName);
	console.log("canSearch is set to = " + canSearch);

	if (canSearch) {
		var searchQuery = this.event.request.intent.slots[canSearch].value;
		var searchResults = searchDatabase(data, searchQuery, canSearch);

		//saving lastSearch results to the current session
		var lastSearch = this.attributes.lastSearch = searchResults;
		var output;

		//saving last intent to session attributes
		this.attributes.lastSearch.lastIntent = "GetCoinValueByCountIntent";

		if (searchResults.count > 1) { //multiple results found
			console.log("Search compvare. Multiple results were found");
			var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
			output = generateSearchResultsMessage(searchQuery, searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
			this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
			this.attributes.lastSearch.lastSpeech = output;
			this.response.speak(output).listen(output);
		} else if (searchResults.count == 1) { //one result found
			this.handler.state = states.RESULTS; // change state to description
			console.log("one match was found");
			if (infoType) {
				//if a specific infoType was requested, redirect to specificInfoIntent
				console.log("infoType was provided as well");
				this.emitWithState("TellCoinValueIntent");
			} else {
				console.log("no infoType was provided.");
				output = generateSearchResultsMessage(searchQuery, searchResults.results);
				this.attributes.lastSearch.lastSpeech = output;
				this.response.speak(output).listen(output);
			}
		} else { //no match found
			console.log("no match found");
			console.log("searchQuery was  = " + searchQuery);
			console.log("searchResults.results was  = " + searchResults);
			output = generateSearchResultsMessage(searchQuery, searchResults.results);
			this.attributes.lastSearch.lastSpeech = output;
			// this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
			this.response.speak(output).listen(output);
		}
	} else {
		console.log("no searchable slot was provided");
		console.log("searchQuery was  = " + searchQuery);
		console.log("searchResults.results was  = " + searchResults);

		this.response.speak(generateSearchResultsMessage(searchQuery, false)).listen(generateSearchResultsMessage(searchQuery, false));
	}

	this.emit(':responseReady');
}



function GetCoinValueByDecimalIntentHandler() {

	this.handler.state = states.SearchUpdateMODE;
	this.emitWithState("GetCoinValueByCountIntent");

}
// =====================================================================================================
// ------------------------------- Section 3. Generating Speech Messages -------------------------------
// =====================================================================================================

function generateNextPromptMessage(person, mode) {
	var infoTypes = ["git-hub username", "twitter handle", "linked-in"];
	var prompt;

	if (mode == "current") {
		// if the mode is current, we should give more informaiton about the current contact
		prompt = ". You can say - tell me more, or  tell me " + genderize("his-her", person.gender) + " " + infoTypes[getRandom(0, infoTypes.length - 1)];
	}
	//if the mode is general, we should provide general help information
	else if (mode == "general") {
		prompt = ". " + getGenericHelpMessage(data);
	}
	return prompt;
}

function generateSendingCardToAlexaAppMessage(person, mode) {
	var sentence = "I have sent " + person.firstName + "'s contact card to your Alexa app" + generateNextPromptMessage(person, mode);
	return sentence;
}

function generateSearchResultsMessage(searchQuery, results) {
	var sentence;
	var details;
	var prompt;

	if (results) {
		switch (true) {
			case (results.length == 0):
				sentence = "Hmm. I couldn't find " + searchQuery + ". " + getGenericHelpMessage(data);
				break;
			case (results.length == 1):
				var person = results[0];
				details = person.firstName + " " + person.lastName + " is " + person.title + ", based out of " + person.cityName;
				prompt = generateNextPromptMessage(person, "current");
				sentence = details + prompt;
				console.log(sentence);
				break;
			case (results.length > 1):
				sentence = "I found " + results.length + " matching results";
				break;
		}
	} else {
		sentence = "Sorry, I didn't quite get that. " + getGenericHelpMessage(data);
	}
	return sentence;
}

function getGenericHelpMessage(data) {
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


function generateSearchHelpMessage(gender) {
	var sentence = "Sorry, I don't know that. You can ask me - what's " + genderize("his-her", gender) + " twitter, or give me " + genderize("his-her", gender) + " git-hub username";
	return sentence;
}

function generateTellMeMoreMessage(person) {
	var sentence = person.firstName + " joined the Alexa team in " + person.joinDate + ". " + genderize("his-her", person.gender) + " Twitter handle is " + person.saytwitter + " . " + generateSendingCardToAlexaAppMessage(person, "general");
	return sentence;
}

function generateSpecificInfoMessage(slots, person) {
	var infoTypeValue;
	var sentence;

	if (slots.infoType.value == "git hub") {
		infoTypeValue = "github";
		console.log("resetting gith hub to github");
	} else {
		console.log("no reset required for github");
		infoTypeValue = slots.infoType.value;
	}

	sentence = person.firstName + "'s " + infoTypeValue.toLowerCase() + " is - " + person["say" + infoTypeValue.toLowerCase()] + " . Would you like to find another evangelist? " + getGenericHelpMessage(data);
	return optimizeForSpeech(sentence);
}

// exports.handler = function(event, context, callback) {
// 	var alexa = Alexa.handler(event, context);
// 	alexa.appId = APP_ID;
// 	alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers, multipleSearchResultsHandlers);
// 	alexa.execute();
// };

// =====================================================================================================
// ------------------------------------ Section 4. Helper Functions  -----------------------------------
// =====================================================================================================
// For more helper functions, visit the Alexa cookbook at https://github.com/alexa/alexa-cookbook
//======================================================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomCity(arrayOfStrings) {
	return arrayOfStrings[getRandom(0, data.length - 1)].cityName;
}

function getRandomName(arrayOfStrings) {
	var randomNumber = getRandom(0, data.length - 1);
	return arrayOfStrings[randomNumber].firstName + " " + arrayOfStrings[randomNumber].lastName;
}

function titleCase(str) {
	return str.replace(str[0], str[0].toUpperCase());
}

function generateCard(person) {
	var cardTitle = "Contact Info for " + titleCase(person.firstName) + " " + titleCase(person.lastName);
	var cardBody = "Twitter: " + "@" + person.twitter + " \n" + "GitHub: " + person.github + " \n" + "LinkedIn: " + person.linkedin;
	var imageObj = {
		smallImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
		largeImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
	};
	return {
		"title": cardTitle,
		"body": cardBody,
		"image": imageObj
	};
}

function loopThroughArrayOfObjects(arrayOfStrings) {
	var joinedResult = "";
	// Looping through the each object in the array
	for (var i = 0; i < arrayOfStrings.length; i++) {
		//concatenating names (firstName + lastName ) for each item
		joinedResult = joinedResult + ", " + arrayOfStrings[i].firstName + " " + arrayOfStrings[i].lastName;
	}
	return joinedResult;
}

function genderize(type, gender) {
	var pronouns = {
		"m": {
			"he-she": "he",
			"his-her": "his",
			"him-her": "him"
		},
		"f": {
			"he-she": "she",
			"his-her": "her",
			"him-her": "her"
		}
	};
	return pronouns[gender][type];
}

function sanitizeSearchQuery(searchQuery) {
	searchQuery = searchQuery.replace(/’s/g, "").toLowerCase();
	searchQuery = searchQuery.replace(/'s/g, "").toLowerCase();
	return searchQuery;
}

function optimizeForSpeech(str) {
	var optimizedString = str.replace("github", "git-hub");
	return optimizedString;
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

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

function isInfoTypeValid(infoType) {
	var validTypes = ["git hub", "github", "twitter", "linkedin"];
	return isInArray(infoType, validTypes);
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
	'BuySellCoin': function () {
		if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS") {
			this.emit(':delegate')
		} else {

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
				this.emit(':askWithCard', "Ok. I am cancelling the portfolio update " + getRandomValues(COIN_SELECT_MESSAGE, "MSG") + " The portfolio update has been cancelled. Which coin next ?", this.t('SKILL_NAME'), "The portfolio update has been cancelled now. Which coin next ?")

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
	self.response.speak(sound).listen(getRandomValues(COIN_SELECT_MESSAGE, "MSG")).cardRenderer(self.t('SKILL_NAME'), content, imageObj)
	self.emit(':responseReady');
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

	var alexa = Alexa.handler(request.body, context);
	alexa.resources = languageStrings;
	//alexa.registerHandlers(handlers);
	alexa.registerHandlers(newSessionHandlers, searchUpdateHandlers, descriptionHandlers, multipleSearchResultsHandlers);
	alexa.execute();
}

module.exports = {
	configure: configure
}