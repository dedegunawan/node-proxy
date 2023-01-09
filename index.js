const express = require('express');
//const morgan = require("morgan");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const {request} = require("express");
const axios = require("axios");


require('dotenv').config();

// Create Express Server
const app = express();

const default_config = require('./config.json')[process.env.NODE_ENV || 'dev'];



// Configuration
const PORT = process.env.FROM_ENV ? process.env.PORT : default_config.port;
const HOST = process.env.FROM_ENV ? process.env.HOST : default_config.host;
const API_SERVICE_URL = process.env.FROM_ENV ? process.env.API_SERVICE_URL : default_config.api_service_url;
const API_KEY_LOG = process.env.FROM_ENV ? process.env.API_KEY_LOG : default_config.api_key_log;

let requestStart = 0;

function log(proxyRes, responseBuffer, request, response, requestStart) {
	if (!API_KEY_LOG || API_KEY_LOG.length <= 0) {
		console.log("Not logged");
		return 0;
	}

	const { rawHeaders, httpVersion, method, socket, url } = request;
	const { remoteAddress, remoteFamily } = socket;

	const { statusCode, statusMessage } = response;
	const responseHeaders = response.getHeaders();
	const body = responseBuffer.toString('utf-8');

	let logStream = JSON.stringify({
		request: {
			timestamp: requestStart,
			processingTime: Date.now() - requestStart,
			rawHeaders,
			httpVersion,
			method,
			remoteAddress,
			remoteFamily,
			url
		},
		response_body: body,
		response: {
			statusCode: response.statusCode,
			statusMessage: response.statusMessage,
			headers: responseHeaders
		},
		other: {
			proxy: {
				PORT,
				HOST,
				API_SERVICE_URL,
			},
		}
	});

	sendLog(logStream)
};

function sendLog(log) {
	try {
		axios.post('https://simple-log.dede-gunawan.web.id/api/logs', {
			log,
		}, {
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer '+API_KEY_LOG
			},
		}).then(response => {
			console.log('Menyimpan log baru => ', response.data.status, ' id : ', response.data.log_id)
		})
	} catch (error) {
		console.log('Send file failed')
	}
	console.log('Hallo')

}
// disable Logging
// app.use(morgan('dev'));

app.use('/', function (req, res, next) {
	requestStart = Date.now();
	next();
})

// Info GET endpoint
app.get('/info', (req, res, next) => {
	res.send('This is a proxy service');
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
	target: API_SERVICE_URL,
	changeOrigin: true,
	selfHandleResponse: true,
	onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
		log(proxyRes, responseBuffer, req, res, requestStart)
		return responseBuffer.toString('utf8');
	}),
}));


// Start Proxy
app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});


