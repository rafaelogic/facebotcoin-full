const co = require('co')
const Sources = require('../sources')

var getQuotes = co.wrap(function* (marketName, curr){
  try{
    if(Array.isArray(curr)){
      var marketQuotes = []
      curr.forEach(currency => {
        marketQuotes.push(getMarketQuotes(marketName, currency))
      })
      return yield Promise.resolve(Promise.all(marketQuotes))
    }else{
      return yield Promise.resolve(getMarketQuotes(marketName, curr))
    }
  }catch(error){
    console.log(`Function: Commander.getQuotes Error:${error}`)
  }
})

var getMarketQuotes = co.wrap(function* (market, currency) {
  switch(market){
    case 'coins':
      var quotes = yield Promise.resolve(Sources.coins(currency))
      return {source: market, currency: currency, ask: quotes.ask, bid: quotes.bid}
    break

    case 'coinbase':
      var quotesAsk = yield Promise.resolve(Sources.coinbase(currency, 'buy'))
      var quotesBid = yield Promise.resolve(Sources.coinbase(currency, 'sell'))
      return {source: market, currency: currency, ask: quotesAsk, bid: quotesBid}
    break

    case 'cexio':
      var quotes = yield Promise.resolve(Sources.cexio(currency))
      return {source: market, currency: currency, ask: quotes.ask, bid: quotes.bid}
    break

    case 'bitstamp':
      var quotes = yield Promise.resolve(Sources.bitstamp(currency))
      return {source: market, currency: currency, ask: quotes.ask, bid: quotes.open}
    break

    default: console.log('Error getMarketQuotes')
  }
})

var getMarketCurrencies = function(market) {
  switch(market){
    case 'bitstamp':
      return Sources.bitstampSupportedCurrencies
    break

    case 'cexio':
      return Sources.cexioSupportedCurrencies
    break

    case 'coinbase':
      return Sources.coinbaseSupportedCurrencies
    break

    case 'coins':
      return Sources.coinsSupportedCurrencies
    break

    default: console.log('Error getMarketCurrencies')
  }
}

module.exports = {
  getQuotes:getQuotes,
  getMarketQuotes:getMarketQuotes,
  getMarketCurrencies:getMarketCurrencies
}
