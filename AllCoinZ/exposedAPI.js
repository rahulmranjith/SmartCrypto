
const Util = require('../AllCoinZ/util')
const fetchCoin = require('../AllCoinZ/fetchCoin');

var welcome = function (req, res) {

    res.status(200).send('JAI - Welcome to Smart Crypto \n' + new Date()).end();

}

var getCoins = function (req, res) {

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
}

var deleteUser = function (req, res) {

    if (req.params.secret == "rmr999") {
        Util.m_deleteUser(req.params.key).then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })
    } else {
        res.status(400).send("Check request")
    }

}

var getUsers = function (req, res) {
    if (req.params.secret == "rmr999") {
        Util.m_getUsers().then(function (useritem) {
            var users = JSON.stringify(useritem)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(users)
        })
    } else {
        res.status(400).send("Check the request")
    }

}

var getCoinValue = function (req, res) {
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

}
module.exports = {
    welcome: welcome, getCoins: getCoins, deleteUser: deleteUser, getUsers: getUsers, getCoinValue: getCoinValue

}