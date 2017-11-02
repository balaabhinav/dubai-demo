import axios from 'axios';
import { config } from '../config/config';
import twit from 'twit';
import request from 'request';

const T = new twit({
  consumer_key : config.consumerKey,
  consumer_secret : config.consumerSecret,
  access_token : config.accessToken,
  access_token_secret : config.accessSecret,
})
let authToken = null;
let consumer_key = config.consumerKey;
let consumer_secret = config.consumerSecret;
let encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

let options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
};

// Obtaining the Authorization token to get trending topic by location
request.post(options, function(error, response, body) {
	if(error)
		console.error(error);
	
		authToken = JSON.parse(body);
});

export const getTrends = () => {
	// Setting the authorization header
	axios.defaults.headers.common['Authorization'] = "Bearer "+authToken.access_token;
	
	// calling the spi to get list of trending topics by WOEID of the location
	return new Promise((resolve, reject) => {

		axios.get("https://api.twitter.com/1.1/trends/place.json?id="+config.woeID)
			.then( data => {
				return resolve(data.data[0]);
			})
			.catch( err => {
				console.log("Error => ", err);
				return resolve(err);
			})
			
	})
}

export const streamTrend = (filter, socketConn) => {
	// instantiate the event listener for the twitter stream with the filter
	let stream = T.stream('statuses/filter', { track : filter })

	// When tweet is received send it to all listeners attached to the filter room
	stream.on('tweet', (tweet) => socketConn.to(filter).emit('tweet-stream', tweet));
}