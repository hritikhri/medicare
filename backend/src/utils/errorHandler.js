const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'error.log' })]
});

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
};

module.exports = errorHandler;