const expect = require('chai').expect

describe('Helpers', () => {
  describe('Formatter', () => {
    describe('#getNumbersOnly()', () => {
      var str = "buy coins -php 800000"
      var price = str.replace( /^\D+/g, '')

      it('should parse user message and get the price entered', () => {
        expect(parseFloat(price)).to.equal(800000)
      })
    })

    describe('#numberWithCommas()', () => {
      var price = '800000'
      var newPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      it('should format the prices in messages to have a comma in every 3 digit numbers', () => {
        expect(newPrice).to.equal('800,000')
      })
    })

  })
})
