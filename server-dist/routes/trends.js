'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _trends = require('../lib/trends');

var lib = _interopRequireWildcard(_trends);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trends = _express2.default.Router();

trends.get('/', function (req, res) {
	lib.getTrends().then(function (data) {
		res.status(200).json(data);
	}).catch(function (err) {
		res.status(500).json(err);
	});
});

exports.default = trends;