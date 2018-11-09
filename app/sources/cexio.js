const Commander = require('./commander')

var supportedCurrencies = ["EUR", "GBP", "RUB", "USD"]

var getQuotes = function(currency) {
  try{
    var options = {
      API_URL: 'https://cex.io/api/ticker/BTC/',
      currency: currency
    }
    var commander = new Commander(options)

    return new Promise((resolve, reject) => {
      commander.marketQuote(quotes => {
        if(!quotes) reject("Can't get markets quotes")
        resolve(quotes)
      })
    })
  }catch(error){ console.log("Source: cexio, Error: "+error)}
}

module.exports = {
  getQuotes: getQuotes,
  supportedCurrencies: supportedCurrencies
}
