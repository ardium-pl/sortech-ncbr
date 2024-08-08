import winston from 'winston';
import moment from 'moment';

// Konfiguracja formatowania logów
const logFormat = winston.format.printf(({level, message, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Tworzenie loggera
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().format('YYYY-MM-DD HH:mm:ss')
        }),
        logFormat
    ),
    transports: [
        // Logi konsolowe
        new winston.transports.Console(),
        // Logi do pliku
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

// Eksport loggera jako nazwanego eksportu
export {logger};

// Funkcja loggera
export function log(level, message, meta = {}) {
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    logger.log({
        level,
        message: `${logMessage} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`.trim()
    });
}


// Funkcje pomocnicze dla różnych poziomów logowania
export const info = (message, meta) => log('info', message, meta);
export const warn = (message, meta) => log('warn', message, meta);
export const error = (message, meta) => log('error', message, meta);
export const debug = (message, meta) => log('debug', message, meta);

// Middleware do logowania żądań HTTP
export function loggerMiddleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        log('info', message, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip
        });
    });
    next();
}
