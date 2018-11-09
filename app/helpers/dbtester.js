var collection = "subscribers"
var db

var database = function(connection){
  db = connection
  db.createCollection(collection)
}

var seed = function(){
  try{
    save({
      fb_id: 12345267890,
      first_name: 'Rafael',
      type: 'buyer',
      market: 'coins',
      currency: 'PHP',
      price: 800000
    })

    save({
      fb_id: 12345678390,
      first_name: 'Dave',
      type: 'buyer',
      market: 'coins',
      currency: 'PHP',
      price: 700000
    })

    save({
      fb_id: 123416700891,
      first_name: 'Diosa',
      type: 'buyer',
      market: 'coins',
      currency: 'USD',
      price: 25000
    })

    save({
      fb_id: 1234567891,
      first_name: 'Jean',
      type: 'buyer',
      market: 'coins',
      currency: 'USD',
      price: 35000
    })

    save({
      fb_id: 2345678901,
      first_name: 'Raff',
      type: 'seller',
      market: 'coins',
      currency: 'PHP',
      price: 500000
    })

    save({
      fb_id: 2345678902,
      first_name: 'David',
      type: 'seller',
      market: 'coins',
      currency: 'PHP',
      price: 500000
    })

    save({
      fb_id: 2345678911,
      type: 'seller',
      first_name: 'Rashcia',
      market: 'coins',
      currency: 'USD',
      price: 5000
    })

    save({
      fb_id: 34567289111,
      type: 'user',
      first_name: 'Ehna',
      market: 'coins',
      currency: 'USD',
      price: 0
    })

    save({
      fb_id: 34567289110,
      type: 'user',
      first_name: 'Josie',
      market: 'coins',
      currency: 'USD',
      price: 0
    })

    save({
      fb_id: 5465455548,
      type: 'buyer',
      first_name: 'Amaya',
      market: 'bitstamp',
      currency: 'USD',
      price: 25000
    })

    save({
      fb_id: 345672849110,
      type: 'seller',
      first_name: 'Roman',
      market: 'coinbase',
      currency: 'AUD',
      price: 0
    })

    save({
      fb_id: 345673289110,
      type: 'user',
      first_name: 'Tomas',
      market: 'cexio',
      currency: 'USD',
      price: 0
    })
  }catch(error){ console.log(error) }
}

var find = function() {
  try{
    finder()
      .then(users => {
        console.log(users)
      })
      .catch((err) => {
        console.log(err)
      })
  }catch(error) {
    console.log(error)
  }
}

var clear = function()
{
  try{
    db.collection(collection).drop()
  }catch(err){ console.log(err) }
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

// use for getting all the subscribers
function finder(query = {}){
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find(query)
      .toArray((err, res) => {
        if(res.length > 0) {
          resolve(res)
        }else{
          reject(err)
          console.log(`Can't get users`)
        }
    })
  })
}

module.exports = {
  seed:seed,
  find:find,
  clear:clear,
  database:database
}
