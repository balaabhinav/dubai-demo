import express from 'express';
import * as lib from '../lib/trends';
const trends = express.Router();

trends.get('/', (req, res) => {
	lib.getTrends()
		.then(data => {
			res.status(200).json(data);
		})
		.catch( err => {
			res.status(500).json(err);
		})
})

export default trends
