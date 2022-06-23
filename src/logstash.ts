import nconf from '@djedi/configuration';
import { Logger, format, transports } from 'winston';
import logstashFormat from './logstash-format';

export default (logger: Logger, winstonContext?: object) => {
  if (
    process.env.NODE_ENV === 'production' &&
    !nconf.get('log:logstash:disabled') &&
    nconf.get('log:logstash:host')
  ) {
    logger.info(`Logstash host ${nconf.get('log:logstash:host') || ''}`, winstonContext);
    const loglevel = nconf.get('log:logstash:level') || 'warn';
    logger.info(`Logstash loglevel ${loglevel}`, winstonContext);
    logger.add(
      new transports.Http({
        host: nconf.get('log:logstash:host') || 'localhost',
        port: nconf.get('log:logstash:port') || 8080,
        path: nconf.get('log:logstash:path') || '/',
        auth: nconf.get('log:logstash:auth'),
        ssl: nconf.get('log:logstash:ssl') !== undefined ? nconf.get('log:logstash:ssl') : true,
        format: format.combine(
          format.errors({ stack: true }),
          format.timestamp(),
          logstashFormat(),
          format.json()
        ),
      })
    );
  }
};
