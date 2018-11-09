const request = require('request')
const expect = require('chai').expect

describe('Sources', () => {
  describe('Commander', () => {
    describe('#_getJSON()', () => {
      var api_url = 'https://quote.coins.ph/v1/markets/BTC-PHP'

      it('should get JSON object response from the API', () => {
        request(api_url, (error, response, body) => {
          expect(JSON.parse(body)).to.be.a('object')
        })
      })

    })
  })
})
