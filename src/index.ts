import nconf from '@djedi/configuration';
import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import sentry from './sentry';
import empty from './empty-format';
import kv from './kv-format';
import logstash from './logstash';

export * from './proxies';

export const logger = winston.createLogger({
  level: nconf.get('log:level') || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        nconf.get('log:classic') ? winston.format.align() : empty(),
        nconf.get('log:classic') ? winston.format.colorize() : empty(),
        nconf.get('log:classic') ? winston.format.simple() : empty(),
        nconf.get('log:classic') ? empty() : kv()
      ),
    }),
  ],
});

process.on('unhandledRejection', (reason: {} | null | undefined, _p) => {
  logger.error({ message: reason });
});
process.on('uncaughtException', (ex) => {
  logger.error({ message: ex });
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'production' && nconf.get('log:dir')) {
  if (!fs.existsSync(nconf.get('log:dir'))) fs.mkdirSync(nconf.get('log:dir'));
  logger.add(
    new DailyRotateFile({
      //	frequency: nconf.get('log:frequency') || null,
      datePattern: nconf.get('log:datePattern') || 'YYYY-MM-DD',
      zippedArchive: nconf.get('log:zippedArchive') || true,
      maxFiles: nconf.get('log:maxFiles') || '366d',
      maxSize: nconf.get('log:maxSize') || null,
      dirname: nconf.get('log:dir'),
      filename: 'errors-%DATE%.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.align(),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
      ),
    })
  );
  logger.add(
    new DailyRotateFile({
      //	frequency: nconf.get('log:frequency') || null,
      datePattern: nconf.get('log:datePattern') || 'YYYY-MM-DD',
      zippedArchive: nconf.get('log:zippedArchive') || true,
      maxFiles: nconf.get('log:maxFiles') || '366d',
      maxSize: nconf.get('log:maxSize') || null,
      dirname: nconf.get('log:dir'),
      filename: 'combined-%DATE%.log',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.align(),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
      ),
    })
  );

  logger.add(
    new DailyRotateFile({
      //	frequency: nconf.get('log:frequency') || null,
      datePattern: nconf.get('log:datePattern') || 'YYYY-MM-DD',
      zippedArchive: nconf.get('log:zippedArchive') || true,
      maxFiles: nconf.get('log:maxFiles') || '366d',
      maxSize: nconf.get('log:maxSize') || null,
      dirname: nconf.get('log:dir'),
      filename: 'errors-%DATE%.json',
      level: 'error',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
  logger.add(
    new DailyRotateFile({
      //	frequency: nconf.get('log:frequency') || null,
      datePattern: nconf.get('log:datePattern') || 'YYYY-MM-DD',
      zippedArchive: nconf.get('log:zippedArchive') || true,
      maxFiles: nconf.get('log:maxFiles') || '366d',
      maxSize: nconf.get('log:maxSize') || null,
      dirname: nconf.get('log:dir'),
      filename: 'combined-%DATE%.json',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

sentry(logger);
logstash(logger);

export const morganFormat = (immediate: boolean) =>
  `level=debug ts=:date[iso] msg="${
    immediate ? 'entering' : 'quitting'
  } :method :url HTTP/:http-version" token=:id remote-addr=:remote-addr remote-user=:remote-user referrer=":referrer" user-agent":user-agent"`;
