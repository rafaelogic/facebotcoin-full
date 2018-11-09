const expect = require('chai').expect
const Commander = require('./commander')

describe('Sources', () => {
  describe('#Bitstamp', () => {
    var api_url = 'https://www.bitstamp.net/api/v2/ticker/btc'

    it('should get bitcoin quotes in EUR currency', () => {
      var options = {
        API_URL: api_url,
        currency: 'eur'
      }
      var commander = new Commander(options)
      commander
        .marketQuote(quotes => {
          expect(quotes).to.be.a('object')
        })
    })

    it('should get bitcoin quotes in USD currency', () => {
      var options = {
        API_URL: api_url,
        currency: 'usd'
      }
      var commander = new Commander(options)
      commander
        .marketQuote(quotes => {
          expect(quotes).to.be.a('object')
        })
    })

  })
})
