const expect = require('chai').expect
const Sources = require('../sources')

describe('Bot', () => {
  describe('Facebook', () => {
    var currency = 'uSD'
    var messageTextBuy = 'buy bitstamp -usd 25000'
    var messageTextSell = 'sell cexio -Usd 5000'
    var messageTextUser = 'quote coinbase -Php'
    var messageTextQuote = '? coins -pHp'

    var subscriber = {
      _id: '5a78008f99d4d1c96aeba565',
      fb_id: '12345',
      first_name: 'Juan',
      type: 'buyer',
      market: 'coinbase',
      currency: 'PHP',
      price: '700000'
    }

    var subscriber2 = {
      _id: '68a8008f99d4d1c96aeba565',
      fb_id: '23451',
      first_name: 'John',
      type: 'seller',
      market: 'coins',
      currency: 'PHP',
      price: '200000'
    }

    var subscriber3 = {
      _id: '68a8008f99d4d1c96aeba565',
      fb_id: '34512',
      first_name: 'Jane',
      type: 'user',
      market: 'bitstamp',
      currency: 'USD',
      price: '0'
    }

    describe('#receivedMessage()', () => {
      var keywords = ['hi', 'hello']
      it('should send greeting message if the user input hi or hello in the messenger', () => {
        expect(keywords[0]).to.equal('hi')
        expect(keywords[1]).to.equal('hello')
      })

      it('should send help message if the user input help in the messenger', () => {
        var keyword = 'help'
        expect(keyword).to.equal('help')
      })

      it('should send bitcoin quotes from the desired market and currency in the messenger', () => {
        var parsedCurrency = parseCurrencyKeyword(messageTextQuote)
        expect(parsedCurrency).to.equal('pHp')
        var market = parseMarketKeyword(messageTextQuote)
        expect(market).to.equal('coins')
        var currency = parsedCurrency.toUpperCase()
        expect(currency).to.equal('PHP')
      })

      it('should subscribe the facebook user to hourly bitcoin quotes update', () => {
        var params =   {
            messageText:messageTextUser.toUpperCase(),
            senderID:subscriber3.fb_id,
            first_name:subscriber3.first_name,
            subscriberType:subscriber3.type,
            price: subscriber3.price
          }

          expect(params.senderID).to.equal('34512')
          expect(params.first_name).to.equal('Jane')
          expect(params.subscriberType).to.equal('user')
          expect(parseFloat(params.price)).to.equal(0)
      })

      it('should subscribe the facebook user as a buyer subscriber which recieves alert every 5 mins.', () => {
        var price = messageTextBuy.replace( /\D+/g, '')
        var params =   {
          messageText:messageTextBuy.toUpperCase(),
          senderID:subscriber.fb_id,
          first_name: subscriber.first_name,
          subscriberType: subscriber.type,
          price: price
        }

          expect(params.senderID).to.equal('12345')
          expect(params.first_name).to.equal('Juan')
          expect(params.subscriberType).to.equal('buyer')
          expect(parseFloat(params.price)).to.equal(25000)
      })

      it('should subscribe the facebook user as a seller subscriber which recieves alert every 5 mins.', () => {
        var price = messageTextSell.replace( /\D+/g, '')
        var params =   {
          messageText:messageTextSell.toUpperCase(),
          senderID:subscriber2.fb_id,
          first_name: subscriber2.first_name,
          subscriberType: subscriber2.type,
          price: price
        }

          expect(params.senderID).to.equal('23451')
          expect(params.first_name).to.equal('John')
          expect(params.subscriberType).to.equal('seller')
          expect(parseFloat(params.price)).to.equal(5000)
      })
    })

    describe('#sendQuote()', () => {
      var quote = {
        source: "coins",
        currency: "PHP",
        ask: "431396.02",
        bid: "422853.73"
      }

      it('should return bitcoin quotes from the selected source', () => {
        expect(quote).to.be.an('object')
      })
    })

    describe('#sendMessageHourly() - Hourly alerts sent to quotes (user) subscribers', () => {
      var subscribers = [
        {
          subscriberID: 51234,
          subscriberName: 'Dave',
          message: 'USER_PREDEFINED_ALERT_MSG'
        },
        {
          subscriberID: 52341,
          subscriberName: 'Dianne',
          message: 'USER_PREDEFINED_ALERT_MSG'
        }
      ]

      var subscriberAlerts = {
        bitstampSubs:[],
        cexioSubs:[],
        coinbaseSubs:[],
        coinsSubs:subscribers
      }

      it('should send text message to the buyer subscribers', () => {
        expect(subscriberAlerts).to.be.an('object')
      })

    })

    describe('#sendMessage() - 5 mins. interval sent to the buyer and seller subscribers', () => {
      var buyers = [
        {
          subscriberID: 12345,
          subscriberName: 'Juan',
          subscriberPrice: 700000,
          message: 'BUYER_PREDEFINED_ALERT_MSG'
        },
        {
          subscriberID: 23451,
          subscriberName: 'Juana',
          subscriberPrice: 600000,
          message: 'BUYER_PREDEFINED_ALERT_MSG'
        }
      ]

      var sellers = [
        {
          subscriberID: 34512,
          subscriberName: 'John',
          subscriberPrice: 5000,
          message: 'SELLER_PREDEFINED_ALERT_MSG'
        },
        {
          subscriberID: 45123,
          subscriberName: 'Jane',
          subscriberPrice: 10000,
          message: 'SELLER_PREDEFINED_ALERT_MSG'
        }
      ]

      var buyerAlerts = {
        bitstampSubs:[],
        cexioSubs:[],
        coinbaseSubs:buyers,
        coinsSubs:[]
      }

      var sellerAlerts = {
        bitstampSubs:[],
        cexioSubs:[],
        coinbaseSubs:sellers,
        coinsSubs:[]
      }

      it('should send text message to the buyer subscribers', () => {
        expect(buyerAlerts).to.be.an('object')
      })

      it('should send text message to the sellers subscribers', () => {
        expect(sellerAlerts).to.be.an('object')
      })
    })

    describe('#parseKeyword()', () => {
      it('should check if the message text has a matching buy | sell | quote | ? keyword', () => {
        expect(parseKeyword(messageTextBuy)).to.equal('buy')
        expect(parseKeyword(messageTextSell)).to.equal('sell')
        expect(parseKeyword(messageTextUser)).to.equal('quote')
        expect(parseKeyword(messageTextQuote)).to.equal('?')
      })
    })

    describe('#parseMarketKeyword()', () => {
      it('should check if the message text has a match market keyword with sources', () => {
        expect(parseMarketKeyword(messageTextBuy)).to.equal('bitstamp')
        expect(parseMarketKeyword(messageTextSell)).to.equal('cexio')
        expect(parseMarketKeyword(messageTextUser)).to.equal('coinbase')
        expect(parseMarketKeyword(messageTextQuote)).to.equal('coins')
      })
    })

    describe('#parseCurrencyKeyword()', () => {
      it('should remove the "-" and return the currency keyword', () => {
        expect(parseCurrencyKeyword(messageTextUser)).to.equal('Php')
      })
    })

    describe('#isCurrencySupported()', () => {
      it('should return true if the selected currency supported by the markets (sources) otherwise false', () => {
        expect(Sources.bitstampSupportedCurrencies).to.be.an('array')
        expect(Sources.cexioSupportedCurrencies).to.be.an('array')
        expect(Sources.coinbaseSupportedCurrencies).to.be.an('array')
        expect(Sources.coinsSupportedCurrencies).to.be.an('array')
        expect(isCurrencySupported('bitstamp', currency)).to.be.true
        expect(isCurrencySupported('cexio', currency)).to.be.true
        expect(isCurrencySupported('coinbase', currency)).to.be.true
        expect(isCurrencySupported('coins', currency)).to.be.true
      })
    })
  })
})

function parseKeyword(messageText) {
  var isMatched = true
  var msgTxt = messageText.toLowerCase()
  console.log(msgTxt)
  switch(isMatched){
    case /\?/.test(msgTxt):
      return '?'
    break

    case /buy/.test(msgTxt):
      return 'buy'
    break

    case /quote/.test(msgTxt):
      return 'quote'
    break

    case /sell/.test(msgTxt):
      return 'sell'
    break

    case /market/.test(msgTxt):
      return 'market'
    break

    case /stop/.test(msgTxt):
      return 'stop'
    break

    default: return false
  }
}

function parseMarketKeyword(messageText) {
  var isMatched = true
  var msgTxt = messageText.toLowerCase()

  switch(isMatched){
    case /bitstamp/.test(msgTxt):
      return 'bitstamp'
    break

    case /cexio/.test(msgTxt):
      return 'cexio'
    break

    case /coinbase/.test(msgTxt):
      return 'coinbase'
    break

    case /coins/.test(msgTxt):
      return 'coins'
    break

    default: return false
  }
}

function parseCurrencyKeyword (messageText) {
  var rx = /-\w{3}/g
  var currency = messageText.match(rx)
  if(currency !== null){
      return currency[0].replace('-', '')
  }
  return false
}

function isCurrencySupported(market, currency) {
  if(currency !== false){
    switch(market){
      case 'bitstamp':
        return Sources.bitstampSupportedCurrencies.find(o => o === currency.toUpperCase()) ? true:false
      break

      case 'cexio':
        return Sources.cexioSupportedCurrencies.find(o => o === currency.toUpperCase()) ? true:false
      break

      case 'coinbase':
        return Sources.coinbaseSupportedCurrencies.find(o => o === currency.toUpperCase()) ? true:false
      break

      case 'coins':
        return Sources.coinsSupportedCurrencies.find(o => o === currency.toUpperCase()) ? true:false
      break

      default:
        return false
    }
  }else{
    return false
  }
}
