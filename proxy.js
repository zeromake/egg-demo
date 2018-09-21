'use strict';

const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(proxy({
  target: 'http://127.0.0.1:7001',
  logLevel: 'debug',
}));

const server = app.listen(80);

module.exports = server;
