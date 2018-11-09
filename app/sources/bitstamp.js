const Commander = require('./commander')

var supportedCurrencies = ["EUR", "USD"];

var getQuotes = function(currency) {
  try{
    var options = {
      API_URL: 'https://www.bitstamp.net/api/v2/ticker/btc',
      currency: currency.toLowerCase()
    }
    var commander = new Commander(options)

    return new Promise((resolve, reject) => {
      commander.marketQuote(quotes => {
        if(quotes === false) reject("Can't get markets quotes")
        resolve(quotes)
      })
    })
  }catch(error){ console.log("Source: bitstamp, Error: "+error)}
}

module.exports = {
  getQuotes: getQuotes,
  supportedCurrencies: supportedCurrencies
}
