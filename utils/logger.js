const winston = require('winston');
const config = require('../config')

const logger = new (winston.Logger)({
  level: config.log.level,
  transports: [
    new (winston.transports.Console)({ timestamp: true }),
    new (winston.transports.File)({ filename: config.log.log_file })
  ]
});

module.exports = logger;
