import winston from "winston";

// Configuración de niveles de logging
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Configuración de colores para la consola
const colors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta',
};

// Definir el transporte para el archivo de errores
const errorTransport = new winston.transports.File({ filename: 'errors.log', level: 'error' });

// Configurar el logger
const logger = winston.createLogger({
  levels: levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
    errorTransport,
  ],
});

// Crear un método para registrar eventos de nivel HTTP
logger.http = function (message) {
  logger.log({ level: 'http', message: message });
};

// Crear un método para registrar eventos de nivel FATAL
logger.fatal = function (message) {
  logger.log({ level: 'fatal', message: message });
};

export default logger;