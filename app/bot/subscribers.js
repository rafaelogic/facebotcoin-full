'use strict'

var collection = 'subscribers'
var db

var database = function(connection){
  db = connection
}

var subscribe = function(subscriber) {
    save(subscriber)
}

var unsubscribe = function(subscriber) {
  remove(subscriber)
}

var getSubscribriptions = function(query = {}) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find(query)
      .toArray((err, res) => {
        if(err) reject(`Can't get users. Please check if it has a subscription.`)
        resolve(res)
    })
  })
}

function save(subscriber) {
  db.collection(collection)
    .findAndModify(
      {fb_id: subscriber.fb_id},
      [['type', 1]],
      {$set:subscriber},
      {upsert: true, new:true},
      (err, result) => {
        if (err) console.log(err)
        console.log('1 document inserted')
      }
    )
}

function remove(query){
  db.collection(collection)
    .findOneAndDelete(query, (err, res) => {
      if(err) console.log('Delete error: ' + err)
      console.log(res)
    })
}

module.exports = {
  database:database,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  getSubscribriptions: getSubscribriptions
}
