const expect = require('chai').expect
const Commander = require('./commander')

describe('Sources', () => {
  describe('#Coins', () => {
    var api_url = 'https://quote.coins.ph/v1/markets/BTC-'
    it('should get bitcoin quotes in PHP currency', () => {
      var options = {
        API_URL: api_url,
        currency: 'php'
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
