const Commander = require('./commander')

var supportedCurrencies = ["CLP", "HKD", "IDR", "MYR", "PHP", "THB", "TWD", "USD", "VND"]

var getQuotes = function(currency) {
  try{
    var options = {
      API_URL: 'https://quote.coins.ph/v1/markets/BTC-',
      currency: currency
    }
    var commander = new Commander(options)

    return new Promise((resolve, reject) => {
      commander.marketQuote(quotes => {
        if(!quotes) reject("Can't get markets quotes")
        resolve(quotes.market)
      })
    })
  }catch(error){ console.log("Source: coins, Error: "+error)}
}

//Get only bitcoin products if all markets
function getBitcoins(quotes){
  return quotes.filter(o => o.product === "BTC")
}

module.exports = {
  getQuotes:getQuotes,
  supportedCurrencies:supportedCurrencies
}
