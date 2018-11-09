const expect = require('chai').expect
const Sources = require('../sources')
const format =require('../helpers/formatter')

describe('Bot', () => {
  describe('Commander', () => {
    var quote = {
      source: "coins",
      currency: "PHP",
      ask: "431396.02",
      bid: "422853.73"
    }

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


    var subscribedMarketAndCurrencies = {
      hasSubscribers: true,
      subscribedCurrencies: [ 'PHP', 'USD' ],
      allSubscribers: [
        [ subscriber, subscriber2 ],
        [ subscriber3 ]
      ]
     }

     describe('#getBuyersAlert()', () => {
       var alert = {
         subscriberID: subscriber.fb_id,
         subscriberName:subscriber.first_name,
         subscriberPrice:subscriber.price,
         message: 'BUYER_PREDEFINED_ALERT_MSG'
       }

       var buyerAlert = {
         bitstampSubs:{},
         cexioSubs:{},
         coinbaseSubs:alert,
         coinsSubs:{}
       }

       it('should return alert object that will be use to send alerts to the bitcoin buyer subscribers', () => {
         expect(alert.subscriberID).to.equal(subscriber.fb_id)
         expect(alert.subscriberName).to.equal(subscriber.first_name)
         expect(alert.subscriberPrice).to.equal(subscriber.price)
         expect(buyerAlert).to.be.an('object')
       })
     })

     describe('#getSellersAlert()', () => {
       var alert = {
         subscriberID: subscriber2.fb_id,
         subscriberName:subscriber2.first_name,
         subscriberPrice:subscriber2.price,
         message: 'SELLER_PREDEFINED_ALERT_MSG'
       }

       var sellerAlert = {
         bitstampSubs:{},
         cexioSubs:{},
         coinbaseSubs:{},
         coinsSubs:alert
       }

       it('should return alert object that will be use to send alerts to the bitcoin seller subscribers', () => {
         expect(alert.subscriberID).to.equal(subscriber2.fb_id)
         expect(alert.subscriberName).to.equal(subscriber2.first_name)
         expect(alert.subscriberPrice).to.equal(subscriber2.price)
         expect(sellerAlert).to.be.an('object')
       })
     })

     describe('#getUsersAlert()', () => {
       var alert = {
         subscriberID: subscriber3.fb_id,
         subscriberName:subscriber3.first_name,
         message: 'USER_PREDEFINED_ALERT_MSG'
       }

       var sellerAlert = {
         bitstampSubs:alert,
         cexioSubs:{},
         coinbaseSubs:{},
         coinsSubs:{}
       }

       it('should return alert object that will be use to send alerts to the bitcoin quotes subscribers', () => {
         expect(alert.subscriberID).to.equal(subscriber3.fb_id)
         expect(alert.subscriberName).to.equal(subscriber3.first_name)
         expect(sellerAlert).to.be.an('object')
       })
     })

     describe('#getAlert()', () => {
       it('should return bitcoin quotes from the selected source', () => {
         expect(quote).to.be.an('object')
       })
     })

     describe('#getSubscribersAlert()', () => {
       var alert = {
         subscriberID: subscriber2._id, subscriberName:subscriber2.first_name, subscriberPrice:subscriber2.price,
         message: 'SELLER_PREDEFINED_ALERT_MSG'
       }

       it('should get market quotes from the selected source', () => {
         expect(quote).to.be.an('object')
       })

       it('should return alert object that will be use send alerts to subscribers', () => {
         expect(alert.subscriberID).to.equal(subscriber2._id)
         expect(alert.subscriberName).to.equal(subscriber2.first_name)
         expect(alert.subscriberPrice).to.equal(subscriber2.price)
         expect(alert).to.be.an('object')
       })

       it('should return alert that will be sent to the subscribers based on their type', () => {
         expect(parseFloat(quote.ask)).to.be.below(parseFloat(subscriber.price))
         expect(parseFloat(quote.bid)).to.be.above(parseFloat(subscriber2.price))
         expect(parseFloat(subscriber3.price)).to.equal(0)
       })
     })

    describe('#getSubscribedMarketAndCurrencies()', () => {
      it('should return true if there are subscribers', () => {
        expect(subscribedMarketAndCurrencies.hasSubscribers).to.be.true
      })

      it('should return all subscribers who\s subscribed for alerts with the same currency', () => {
        expect(subscribedMarketAndCurrencies.allSubscribers[0][0].currency).to.equal('PHP')
        expect(subscribedMarketAndCurrencies.allSubscribers[0][1].currency).to.equal('PHP')
        expect(subscribedMarketAndCurrencies.allSubscribers[1][0].currency).to.equal('USD')
        expect(subscribedMarketAndCurrencies).to.be.a('object')
      })

      it('should return currencies that has subscribers', () => {
        expect(subscribedMarketAndCurrencies.subscribedCurrencies).to.be.an('array')
      })

    })

    describe('#getTextMessage()', function(){
      it('should return subscriber\'s facebook ID', () => {
        expect(subscriber.fb_id).to.equal('12345')
      })

      it('should return text message to buy now if the subscribersType is equal to buyer and quote ask value is lesser than the subscrber\'s price', () => {
        expect(subscriber.type).to.equal('buyer')
        expect(parseFloat(quote.ask)).to.be.below(parseFloat(subscriber.price))
      })

      it('should return text message to sell now if the subscribersType is equal to seller and quote ask value is higher than the subscrber\'s price', () => {
        expect(subscriber2.type).to.equal('seller')
        expect(parseFloat(quote.bid)).to.be.above(parseFloat(subscriber2.price))
      })

      it('should return text message of bitcoin current prices if the subscribersType is equal to user', () => {
        expect(subscriber3.type).to.equal('user')
        expect(parseFloat(subscriber3.price)).to.equal(0)
      })
    })
  })
})
