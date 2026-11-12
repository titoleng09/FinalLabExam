const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// USE PROXY SERVER TO REDIRECT INCOMING REQUEST
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

// Pod-1 : Registration runs in the SAME pod as the gateway -> localhost
// Pod-2 : Login runs in a different pod -> reached via Kubernetes Service name
const REG_SERVICE_URL = process.env.REG_SERVICE_URL || 'http://localhost:5003';
const LOGIN_SERVICE_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:5004';


// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Hello API Gateway');
});


// REGISTRATION MICROSERVICE  ->  /reg/*
app.use('/reg', (req, res) => {
    console.log("INSIDE API GATEWAY REG ROUTE");
    proxy.web(req, res, { target: REG_SERVICE_URL });
});


// LOGIN MICROSERVICE  ->  /login/*
app.use('/login', (req, res) => {
    console.log("INSIDE API GATEWAY LOGIN ROUTE");
    proxy.web(req, res, { target: LOGIN_SERVICE_URL });
});


proxy.on('error', (error, req, res) => {
    console.error(`Proxy request failed: ${error.code}`);

    if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
    }

    res.end(JSON.stringify({ error: 'Service unavailable' }));
});


const port = process.env.PORT || 5005;

app.listen(port, () => {
    console.log("API Gateway Service is running on PORT NO : ", port);
});
