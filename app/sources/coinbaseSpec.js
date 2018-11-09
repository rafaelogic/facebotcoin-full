const expect = require('chai').expect
const Commander = require('./commander')

describe('Sources', () => {
  describe('#Coinbase', () => {
    var currency = 'php'
    var api_url = 'https://www.bitstamp.net/api/v2/ticker/btc'+currency+'/'

    it('should get bitcoin buying quotes in PHP currency', () => {
      var options = {
        API_URL: api_url+'buy'
      }
      var commander = new Commander(options)
      commander
        .marketQuote(quotes => {
          expect(quotes).to.be.a('object')
        })
    })

    it('should get bitcoin selling quotes in PHP currency', () => {
      var options = {
        API_URL: api_url+'sell'
      }
      var commander = new Commander(options)
      commander
        .marketQuote(quotes => {
          expect(quotes).to.be.a('object')
        })
    })

  })
})
