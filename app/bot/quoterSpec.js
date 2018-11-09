const expect = require('chai').expect
const Sources = require('../sources')

describe('Bot', () => {
  describe('Quoter', () => {
    var quote = {
      source: 'coins',
      currency: 'PHP',
      ask: 400000,
      bid: 350000
    }

    describe('#getQuotes()', () => {
      var yieldedQuotes = { source: 'bitstamp', currency: 'USD', ask: 15000, bid: 10000 }
      var yieldedQuotes1 = { source: 'cexio', currency: 'EUR', ask: 10000, bid: 8000 }
      var yieldedQuotes2 = { source: 'coinbase', currency: 'AUD', ask: 35000, bid: 30000 }
      var yieldedQuotes3 = { source: 'coins', currency: 'PHP', ask: 500000, bid: 450000 }

      it('should return resolve promise of quotes from different markets and its currencies that has subscribers', () => {
        expect(yieldedQuotes).to.be.an('object')
        expect(yieldedQuotes1).to.be.an('object')
        expect(yieldedQuotes2).to.be.an('object')
        expect(yieldedQuotes3).to.be.an('object')
        expect(Promise.all([yieldedQuotes, yieldedQuotes1, yieldedQuotes2, yieldedQuotes3])).to.be.a('promise')
      })

      it('should return quotes from the selected markets and currency', () => {
        expect(quote).to.be.an('object')
      })

    })

    describe('#getMarketQuotes()', () => {
      it('should return quotes from the selected market', () => {
        expect(quote.source).to.equal('coins')
        expect(quote.currency).to.equal('PHP')
        expect(quote.ask).to.equal(400000)
        expect(quote.bid).to.equal(350000)
        expect(quote).to.be.an('object')

      })
    })

    describe('#getMarketCurrencies()', () => {
      it('should return market\'s supported currencies', () => {
        expect(Sources.bitstampSupportedCurrencies).to.be.an('array')
        expect(Sources.cexioSupportedCurrencies).to.be.an('array')
        expect(Sources.coinbaseSupportedCurrencies).to.be.an('array')
        expect(Sources.coinsSupportedCurrencies).to.be.an('array')
      })
    })
  })
})
