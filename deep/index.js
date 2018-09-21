'use strict';


const adminApp = require('./admin');
const apiApp = require('./api');
const wwwApp = require('./www');

module.exports = {
  'www.test.dev': wwwApp,
  'admin.test.dev': adminApp,
  'api.test.dev': apiApp,
};
