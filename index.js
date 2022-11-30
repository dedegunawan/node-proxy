const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');


require('dotenv').config();

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const API_SERVICE_URL = process.env.API_SERVICE_URL || "http://127.0.0.1:8000";

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
	res.send('This is a proxy service which proxies to JSONPlaceholder API.');
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