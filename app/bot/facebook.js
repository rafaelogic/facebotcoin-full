const request = require("request");
require("dotenv").config();
const co = require("co");

const Commander = require("./commander");
const Sources = require("../sources");
const Subscribers = require("./subscribers");
const Format = require("../helpers/formatter");

var receivedMessage = function(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log(
    "Received message for user %d and page %d at %d with message:",
    senderID,
    recipientID,
    timeOfMessage
  );
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  getName(senderID)
    .then(user => {
      var first_name = user.first_name;

      if (isEcho) {
        console.log(
          "Received echo for message %s and app %d with metadata %s",
          messageId,
          appId,
          metadata
        );
        return;
      }

      if (messageText) {
        //filter non numbers
        var price = messageText.replace(/\D+/g, "");

        var keyword = parseKeyword(messageText) || messageText;

        switch (keyword) {
          case "hello":
          case "hi":
            greetingMessage(senderID, first_name);
            break;

          case "help":
            helpMessage(senderID, first_name);
            break;

          case "?":
            var parsedCurrency = parseCurrencyKeyword(messageText);
            if (parsedCurrency === false) {
              if (messageText === "?") {
                sendTextMessage(
                  senderID,
                  `${first_name}, your command is invalid please follow this format e.g ? COINS -PHP or type HELP to know more.`
                );
              } else {
                sendTextMessage(
                  senderID,
                  `${first_name}, you need to add a "-" before your currency. e.g ? COINS -PHP`
                );
              }
              return;
            }
            var market = parseMarketKeyword(messageText);
            var currency = parsedCurrency.toUpperCase();
            if (market) {
              sendQuote(market, currency, senderID);
            } else {
              if (currency) {
                sendQuote("coinbase", currency, senderID);
              } else {
                sendTextMessage(
                  senderID,
                  `I'm sorry ${first_name}, I am not allowed to get quotes from this market.`
                );
              }
            }
            break;

          case "quote":
            var params = {
              messageText: messageText.toUpperCase(),
              senderID: senderID,
              first_name: first_name,
              subscriberType: subscriberType,
              price: 0
            };
            var send = new sendTextMessageToSubscribers(params);
            break;

          case "buy":
          case "sell":
            var subscriberType = keyword === "buy" ? "buyer" : "seller";
            if (price === "0") {
              sendTextMessage(
                senderID,
                `Hey ${first_name}, your price is invalid.`
              );
            } else {
              var params = {
                messageText: messageText.toUpperCase(),
                senderID: senderID,
                first_name: first_name,
                subscriberType: subscriberType,
                price: price
              };
              var send = new sendTextMessageToSubscribers(params);
            }
            break;

          case "market":
            sendTextMessage(
              senderID,
              `${first_name}, these are the keyword for market: ${Sources.list.join(" | ")}`
            );
            break;

          case "stop":
            sendTextMessage(
              senderID,
              `${first_name}, you've unsubscribed. You won't receive alerts from me anymore, awwww :(`
            );
            var subscriberData = { fb_id: senderID };
            Subscribers.unsubscribe(subscriberData);
            break;

          default:
            sendTextMessage(senderID, messageText);
        }
      } else if (messageAttachments) {
        textMessage;
        sendTextMessage(senderID, "Message with attachment received");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

var sendTextMessageToSubscribers = function(params) {
  var msgTxt = params.messageText;
  var name = params.first_name;
  var price = params.price;
  var senderId = params.senderID;
  var currencyKeyword = parseCurrencyKeyword(msgTxt);
  var marketKeyword = parseMarketKeyword(msgTxt);
  var isSupported = isCurrencySupported(marketKeyword, currencyKeyword);
  if (
    marketKeyword !== false &&
    currencyKeyword !== false &&
    price !== "" &&
    isSupported !== false
  ) {
    var subscriberData = {
      fb_id: senderId,
      first_name: name,
      type: params.subscriberType,
      market: marketKeyword,
      currency: currencyKeyword,
      price: price
    };
    //if price is 0 it will be subscribe to hourly updates
    if (price === 0) {
      sendTextMessage(
        senderId,
        `${name}, thanks for subscribing. You will receive my bitcoin prices alert every hour from ${marketKeyword} in ${currencyKeyword} currency`
      );
    } else {
      var term = params.subscriberType === "buyer" ? "buy" : "sell";
      sendTextMessage(
        senderId,
        `${name}, you've requested to be alerted to ${term} from ${marketKeyword} @ ${currencyKeyword}${Format.numberWithCommas(
          price
        )} price`
      );
    }
    //Save subscriber (fb user) its data to database
    Subscribers.subscribe(subscriberData);
  } else {
    if (msgTxt === "BUY" || msgTxt === "SELL") {
      sendTextMessage(
        senderId,
        `${name}, the keyword for ${msgTxt} alert is
${msgTxt} MARKET -CURRENCY PRICE
e.g ${msgTxt} COINS -PHP 777888.`
      );
    } else if (msgTxt === "QUOTE") {
      sendTextMessage(
        senderId,
        `${name}, the keyword for ${msgTxt} alert is
${msgTxt} MARKET -CURRENCY
e.g ${msgTxt} COINS -PHP.`
      );
    } else if (marketKeyword === false) {
      sendTextMessage(
        senderId,
        `I'm sorry ${name}, I can't get quotes from this market`
      );
    } else if (isSupported === false) {
      sendTextMessage(
        senderId,
        `I'm sorry ${name}, the currency you have entered is not supported with ${marketKeyword}.`
      );
    } else if (price === "") {
      sendTextMessage(
        senderId,
        `I'm sorry ${name}, you must enter a price to subscribe from buy or sell alert.`
      );
    } else {
      sendTextMessage(
        senderId,
        `${name}, I don't know what you are talking about, please type HELP to get exactly the right keyword to enter.`
      );
    }
  }
};

var sendQuote = function(market, currency, senderId) {
  try {
    Commander.getAlert(market, currency)
      .then(data => {
        sendTextMessage(senderId, data.message);
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

var sendMessageHourly = function() {
  console.log(
    "==================== START OF HOURLY ALERTS ===================="
  );
  try {
    co(function*() {
      var usersAlert = yield Promise.resolve(Commander.getUsersAlert());

      Sources.list.forEach(market => {
        var prop = market + "Subs";
        var usersMarketAlert = usersAlert[prop];
        if (usersMarketAlert !== undefined) {
          usersMarketAlert.forEach(alert => {
            var id = alert.subscriberID;
            //var id = 1555317024583475
            var msg = alert.message;
            sendTextMessage(id, msg);
          });
        }
      });
    });
  } catch (error) {
    console.log(`Function: facebook.sendMessageHourly, ${error}`);
  }
};

var sendMessage = function() {
  console.log(
    "==================== START OF MINUTELY ALERTS ===================="
  );
  try {
    co(function*() {
      var buyersAlert = yield Promise.resolve(Commander.getBuyersAlert());
      var sellersAlert = yield Promise.resolve(Commander.getSellersAlert());

      Sources.list.forEach(market => {
        var prop = market + "Buyers";
        var buyersMarketAlert = buyersAlert[prop];
        if (buyersMarketAlert !== undefined) {
          buyersMarketAlert.forEach(alert => {
            var id = alert.subscriberID;
            //var id = 1555317024583475
            var msg = alert.message;
            sendTextMessage(id, msg);
          });
        }

        var prop = market + "Sellers";
        var sellersMarketAlert = sellersAlert[prop];
        if (sellersMarketAlert !== undefined) {
          sellersMarketAlert.forEach(alert => {
            var id = alert.subscriberID;
            //var id = 1555317024583475
            var msg = alert.message;
            sendTextMessage(id, msg);
          });
        }
      });
    });
  } catch (error) {
    console.log(`Function: facebook.sendMessage, ${error}`);
  }
};

function getName(senderId) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri:
          "https://graph.facebook.com/v2.6/" +
          senderId +
          "?fields=first_name&access_token=" +
          process.env.PAGE_ACCESS_TOKEN,
        method: "GET",
        json: true
      },
      function(error, res, body) {
        if (error) {
          return reject(error);
        }
        resolve(body);
      }
    );
  });
}

function greetingMessage(recipientId, name) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: `
Welcome to Botcoin ${name}!
Type "help" to get started.
      `
    }
  };
  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

var sendTypingOn = function(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
};

var sendTypingOff = function(recipientId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
};

function helpMessage(recipientId, name) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: `
What do you want to do ${name}?

Markets: bitstamp | cexio | coinbase | coins

?     - Ask the current price of bitcoin from your desired market & currency. Just type '? COINBASE -PHP' or '? -PHP'

Quote - Subscribe to current price of Bitcoin.Just type 'QUOTE MARKET -CURRENCY' e.g. 'QUOTE COINBASE -PHP'.

Buy   - Subscribe to be alerted when prices go below your target. Just type 'BUY MARKET -CURRENCY <YOUR TARGET PRICE>' e.g. 'BUY COINBASE -PHP 852000'.

Sell  - Subscribe to be alerted when prices go above your target. Just type 'SELL MARKET -CURRENCY <YOUR TARGET PRICE>' e.g. 'SELL COINBASE -PHP 924000'.

Stop  - Unsubscribed from my alerts.
      `
    }
  };

  callSendAPI(messageData);
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function parseKeyword(messageText) {
  var isMatched = true;
  var msgTxt = messageText.toLowerCase();
  console.log(msgTxt);
  switch (isMatched) {
    case /\?/.test(msgTxt):
      return "?";
      break;

    case /buy/.test(msgTxt):
      return "buy";
      break;

    case /quote/.test(msgTxt):
      return "quote";
      break;

    case /sell/.test(msgTxt):
      return "sell";
      break;

    case /market/.test(msgTxt):
      return "market";
      break;

    case /stop/.test(msgTxt):
      return "stop";
      break;

    default:
      return false;
  }
}

function parseMarketKeyword(messageText) {
  var isMatched = true;
  var msgTxt = messageText.toLowerCase();

  switch (isMatched) {
    case /bitstamp/.test(msgTxt):
      return "bitstamp";
      break;

    case /cexio/.test(msgTxt):
      return "cexio";
      break;

    case /coinbase/.test(msgTxt):
      return "coinbase";
      break;

    case /coins/.test(msgTxt):
      return "coins";
      break;

    default:
      return false;
  }
}

function parseCurrencyKeyword(messageText) {
  var rx = /-\w{3}/g;
  var currency = messageText.match(rx);
  if (currency !== null) {
    return currency[0].replace("-", "");
  }
  return false;
}

function isCurrencySupported(market, currency) {
  if (currency !== false) {
    switch (market) {
      case "bitstamp":
        return Sources.bitstampSupportedCurrencies.find(
          o => o === currency.toUpperCase()
        )
          ? true
          : false;
        break;

      case "cexio":
        return Sources.cexioSupportedCurrencies.find(
          o => o === currency.toUpperCase()
        )
          ? true
          : false;
        break;

      case "coinbase":
        return Sources.coinbaseSupportedCurrencies.find(
          o => o === currency.toUpperCase()
        )
          ? true
          : false;
        break;

      case "coins":
        return Sources.coinsSupportedCurrencies.find(
          o => o === currency.toUpperCase()
        )
          ? true
          : false;
        break;

      default:
        return false;
    }
  } else {
    return false;
  }
}

function callSendAPI(messageData) {
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: messageData
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log(
            "Successfully sent message with id %s to recipient %s",
            messageId,
            recipientId
          );
        } else {
          console.log(
            "Successfully called Send API for recipient %s",
            recipientId
          );
        }
      } else {
        console.log(
          "Failed calling Send API",
          response.statusCode,
          response.statusMessage,
          body.error
        );
      }
    }
  );
}
module.exports = {
  receivedMessage: receivedMessage,
  sendMessage: sendMessage,
  sendMessageHourly: sendMessageHourly
};
