var allcoins;

function setCoins(coins){
  allcoins=JSON.parse(coins)

}
var BaseLinkUrl="https://www.cryptocompare.com";
//console.log(JSON.stringify(jsonCoin));
function findCoin (coinName) {
  coinName=coinName.toUpperCase();  
  var coin = allcoins.Coins.filter(function (coin) {
        return (coin.c.toUpperCase() == coinName || coin.n.toUpperCase() == coinName)
    });
  return coin;
}


module.exports={

m_setCoins :setCoins,
m_findCoin:findCoin
}