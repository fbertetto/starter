'use strict';


var _ = require('lodash');
var isProduction = process.env.NODE_ENV === 'production';
var isDevelopment = false

if (
  process.env.NODE_ENV === 'development' ||
  !process.env.NODE_ENV
) {
  isDevelopment = true
}

var isMocha = !!_.find(process.argv, function(val) {
  return val.indexOf('mocha') !== -1;
});
var isTest = process.env.NODE_ENV === 'test' || isMocha;

var nconf = require('nconf');
var fs = require('fs');

var configFile = __dirname + '/local.json';

if (isTest) {
  configFile = __dirname + '/test.json';
} else if (isDevelopment) {
  configFile = __dirname + '/development.json';
}

nconf.use('memory');
if (fs.existsSync(configFile) !== false) {
  nconf.file('overrides', {file: configFile})
}

nconf.file('defaults', {file: __dirname + '/root.json'});

if (process.env.PORT) {
  nconf.set('server:port', process.env.PORT);
}

if (process.env.SEARCHBOX_URL) {
  nconf.set('elasticsearch:host', process.env.SEARCHBOX_URL);
} else if (process.env.ELASTICSEARCH_URL) {
  nconf.set('elasticsearch:host', process.env.ELASTICSEARCH_URL);
}

exports.get = function() {
  return nconf.get();
}
module.exports = exports;
