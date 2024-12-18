import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
        new winston.transports.File({ filename: 'app.log' }) // Optionally, log to a file as well
    ]
});

export default logger;
