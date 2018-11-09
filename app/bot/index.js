const facebook = require('./facebook')
const subscribers = require('./subscribers')

module.exports = {
  db: subscribers.database,
  receivedMessage: facebook.receivedMessage,
  sendMessage: facebook.sendMessage,
  sendMessageHourly: facebook.sendMessageHourly
}
