const bitstamp = require('./bitstamp')
const cexio = require('./cexio')
const coinbase = require('./coinbase')
const coins = require('./coins')

var currencies = [ "AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTC",
  "BTN","BWP","BYN","BYR","BZD","CAD","CDF","CHF","CLF","CLP","CNH","CNY","COP","CRC","CUC","CVE","CZK","DJF","DKK","DOP","DZD","EEK","EGP","ERN","ETB",
  "EUR","FJD","FKP","GBP","GEL","GGP","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","IMP","INR","IQD","ISK","JEP","JMD",
  "JOD","JPY","KES","KGS","KHR","KMF","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LVL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP",
  "MRO","MTL","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD",
  "RUB","RWF","SAR","SBD","SCR","SEK","SGD","SHP","SLL","SOS","SRD","SSP","STD","SVC","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH",
  "UGX","USD","UYU","UZS","VEF","VND","VUV","WST","XAF","XAG","XAU","XCD","XDR","XOF","XPD","XPF","XPT","YER","ZAR","ZMK","ZMW","ZWL"]

var markets = ["bitstamp", "cexio", "coinbase", "coins"]

module.exports = {
  currencies:currencies,
  list:markets,

  bitstamp: bitstamp.getQuotes,
  bitstampSupportedCurrencies: bitstamp.supportedCurrencies,

  cexio: cexio.getQuotes,
  cexioSupportedCurrencies: cexio.supportedCurrencies,

  coinbase: coinbase.getQuotes,
  coinbaseSupportedCurrencies: coinbase.supportedCurrencies,

  coins: coins.getQuotes,
  coinsSupportedCurrencies: coins.supportedCurrencies
}