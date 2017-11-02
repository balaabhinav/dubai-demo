'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.streamTrend = exports.getTrends = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config/config');

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var T = new _twit2.default({
	consumer_key: _config.config.consumerKey,
	consumer_secret: _config.config.consumerSecret,
	access_token: _config.config.accessToken,
	access_token_secret: _config.config.accessSecret
});
var authToken = null;
var consumer_key = _config.config.consumerKey;
var consumer_secret = _config.config.consumerSecret;
var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

var options = {
	url: 'https://api.twitter.com/oauth2/token',
	headers: {
		'Authorization': 'Basic ' + encode_secret,
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
	body: 'grant_type=client_credentials'
};

// Obtaining the Authorization token to get trending topic by location
_request2.default.post(options, function (error, response, body) {
	if (error) console.error(error);

	authToken = JSON.parse(body);
});

var getTrends = exports.getTrends = function getTrends() {
	// Setting the authorization header
	_axios2.default.defaults.headers.common['Authorization'] = "Bearer " + authToken.access_token;

	// calling the spi to get list of trending topics by WOEID of the location
	return new Promise(function (resolve, reject) {

		_axios2.default.get("https://api.twitter.com/1.1/trends/place.json?id=" + _config.config.woeID).then(function (data) {
			if (data && data.data) return resolve(data.data[0]);
		}).catch(function (err) {
			console.log("Error => ", err);
			return resolve(err);
		});
	});
};

var streamTrend = exports.streamTrend = function streamTrend(filter, socketConn) {
	// instantiate the event listener for the twitter stream with the filter
	var stream = T.stream('statuses/filter', { track: filter });

	// When tweet is received send it to all listeners attached to the filter room
	stream.on('tweet', function (tweet) {
		return socketConn.to(filter).emit('tweet-stream', tweet);
	});
};