const router = require('express').Router()
require('dotenv').config()
const request = require('request')

const Bot = require('../bot')

router.route('/')
    .get((req, res, next) => {
        res.sendStatus(200)
    })

router.route('/webhook')
  .get((req, res, next) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
      console.log("Validating webhook")
      res.status(200).send(req.query['hub.challenge'])
    } else {
      console.error("Failed validation. Make sure the validation tokens match.")
      res.sendStatus(403)
    }
  })

router.route('/webhook')
  .post((req, res, next) => {
    var data = req.body

    // Make sure this is a page subscription
    if (data.object == 'page') {

      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function(pageEntry) {
        var pageID = pageEntry.id
        var timeOfEvent = pageEntry.time

        // Iterate over each messaging event
        pageEntry.messaging.forEach(function(messagingEvent) {
          if (messagingEvent.message) {
            Bot.db(req.app.locals.db)
            Bot.receivedMessage(messagingEvent)
          }else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent)
          }
        })
      })
    }
   
    res.sendStatus(200)
    return
  })

router.route('/alert/hour')
  .get((req, res, next) => {
    Bot.db(req.app.locals.db)
    Bot.sendMessageHourly()
    res.sendStatus(200)
  })

router.route('/alert/minutes')
  .get((req, res, next) => {
    try{
      Bot.db(req.app.locals.db)
      Bot.sendMessage()
      res.sendStatus(200)
    }catch(error){console.log(error)}
  })

module.exports = router
