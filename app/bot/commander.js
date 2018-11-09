const co = require('co')
const Subscribers =require('./subscribers')
const Quoter =require('./quoter')
const format =require('../helpers/formatter')

var getBuyersAlert = co.wrap(function* () {
  var bitstampBuyers = yield Promise.resolve(getSubscribersAlert('bitstamp', 'buyer'))
  var cexioBuyers = yield Promise.resolve(getSubscribersAlert('cexio', 'buyer'))
  var coinbaseBuyers = yield Promise.resolve(getSubscribersAlert('coinbase', 'buyer'))
  var coinsBuyers = yield Promise.resolve(getSubscribersAlert('coins', 'buyer'))

  return {bitstampBuyers:bitstampBuyers, cexioBuyers:cexioBuyers, coinbaseBuyers:coinbaseBuyers, coinsBuyers:coinsBuyers}
})

var getSellersAlert = co.wrap(function* () {
  var bitstampSellers = yield Promise.resolve(getSubscribersAlert('bitstamp', 'seller'))
  var cexioSellers = yield Promise.resolve(getSubscribersAlert('cexio', 'seller'))
  var coinbaseSellers = yield Promise.resolve(getSubscribersAlert('coinbase', 'seller'))
  var coinsSellers = yield Promise.resolve(getSubscribersAlert('coins', 'seller'))

  return {bitstampSellers:bitstampSellers, cexioSellers:cexioSellers, coinbaseSellers:coinbaseSellers, coinsSellers:coinsSellers}
})

var getUsersAlert = co.wrap(function* () {
  var bitstampSubs = yield Promise.resolve(getSubscribersAlert('bitstamp', 'user'))
  var cexioSubs = yield Promise.resolve(getSubscribersAlert('cexio', 'user'))
  var coinbaseSubs = yield Promise.resolve(getSubscribersAlert('coinbase', 'user'))
  var coinsSubs = yield Promise.resolve(getSubscribersAlert('coins', 'user'))

  return {bitstampSubs:bitstampSubs, cexioSubs:cexioSubs, coinbaseSubs:coinbaseSubs, coinsSubs:coinsSubs}
})

var getAlert = co.wrap(function* (market, currency) {
  try{
    var marketCurrencies = Quoter.getMarketCurrencies(market)
    var quotes = yield Promise.resolve(Quoter.getQuotes(market, currency))
    return{
      message: `
Sell: ${format.numberWithCommas(quotes.bid)}
Buy : ${format.numberWithCommas(quotes.ask)}
      `}
  }catch(error){
    console.log(`Function: Commander.getAlert, ${error}`)
  }
})

var getSubscribersAlert = co.wrap(function* (marketName, subscriberType) {
  try{
    var marketCurrencies = Quoter.getMarketCurrencies(marketName)
    var market = yield Promise.resolve(getSubscribedMarketAndCurrencies(marketName, marketCurrencies, subscriberType))
    if(market.hasSubscribers !== false) {
      var quotes = yield Promise.resolve(Quoter.getQuotes(marketName, market.subscribedCurrencies))
      var subscribed = market.allSubscribers
      var alerts = []

      subscribed.forEach(subscriber => {
        var textMessage = getTextMessage(quotes, subscriber, subscriberType)
        if(textMessage != undefined){
          alerts.push(textMessage)
        }
      })

      return alerts
    }else{
      console.log(`No ${subscriberType} subscribers to ${marketName} as of the moment`)
    }
  }catch(error){
    console.log(`Function: Commander.getSubscribersAlert, ${error}`)
  }
})

var getSubscribedMarketAndCurrencies = co.wrap(function* (marketName, supportedCurrencies, subscriberType) {
  try{
    var query = {market: marketName, type: subscriberType}
    var subscribed = yield Promise.resolve(getSubscribers(query))
    if(subscribed.subscribers.length > 0){
      var marketQuotes = []
      var subscribedCurrencies = []
      var allSubscribers = []

      supportedCurrencies.forEach(currency => {
        var currencySubscribers = subscribed.subscribers.filter(o => o.currency === currency)
        if(currencySubscribers.length > 0) {
          subscribedCurrencies.push(currency)
          currencySubscribers.forEach(subscriber => {
            allSubscribers.push(subscriber)
          })
         }
      })
      return {hasSubscribers: true, subscribedCurrencies: subscribedCurrencies, allSubscribers: allSubscribers }
    }else{
      return {hasSubscribers: false}
    }
  }catch(error){
    console.log(`Function: Commander.getSubscribedMarketAndCurrencies, ${error}`)
  }
})

var getSubscribers = co.wrap(function* (query) {
  var subscribers = yield Promise.resolve(Subscribers.getSubscribriptions(query))
  return {subscribers:subscribers}
})

var getTextMessage = function(quote, subscriber, subscriberType){
  try{
    var Id = subscriber.fb_id
    var name = subscriber.first_name
    var currency = subscriber.currency
    var price = parseFloat(subscriber.price)

    var marketPrice = 0
    var isTargetHit = false
    var msg = ''

    if(subscriberType ==='buyer') {
      marketPrice = quote.ask
      msg = 'Buy '
      if(marketPrice <= price){
        isTargetHit = true
      }
    }else if(subscriberType ==='seller') {
      marketPrice = quote.bid
      msg = 'Sell '
      if(marketPrice >= price){
        isTargetHit = true
      }
    }else {
      return{
        subscriberID: Id,
        message: `
Sell: ${format.numberWithCommas(quote.bid)}
Buy : ${format.numberWithCommas(quote.ask)}
        `}
    }

    if(isTargetHit){
      return{
        subscriberID: Id, subscriberName:name, subscriberPrice:price,
        message: `Hey ${name} your price ${currency}${format.numberWithCommas(price)} is in range with bitcoin price @ ${currency}${format.numberWithCommas(marketPrice)}. ${msg} Now! `
      }
    }
  }catch(error){
    console.log(`Function: getTextMessage, ${error}`)
  }
}

module.exports = {
  getAlert,
  getUsersAlert,
  getBuyersAlert,
  getSellersAlert,
  getSubscribersAlert
}
