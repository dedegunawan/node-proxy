const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');


require('dotenv').config();

// Create Express Server
const app = express();

const default_config = require('./config.json')[process.env.NODE_ENV || 'dev'];

// Configuration
const PORT = process.env.FROM_ENV ? process.env.PORT : default_config.port;
const HOST = process.env.FROM_ENV ? process.env.HOST : default_config.host;
const API_SERVICE_URL = process.env.FROM_ENV ? process.env.API_SERVICE_URL : default_config.api_service_url;

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
	res.send('This is a proxy service');
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
	target: API_SERVICE_URL,
	changeOrigin: true,
}));

// Start Proxy
app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});