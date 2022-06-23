import nconf from '@djedi/configuration';
import Sentry from '@djedi/winston-raven-sentry';
import { Logger } from 'winston';

export default (logger: Logger, winstonContext?: object) => {
  if (
    process.env.NODE_ENV === 'production' &&
    !nconf.get('log:sentry:disabled') &&
    nconf.get('log:sentry:dsn')
  ) {
    logger.info(`Sentry ${nconf.get('log:sentry:dsn') || ''}`, winstonContext);
    const loglevel = nconf.get('log:sentry:level') || 'warn';
    logger.info(`Sentry loglevel ${loglevel}`, winstonContext);
    logger.info(
      `Sentry release: ${nconf.get('application:releasenumber') || 'RELEASENUMBER'}`,
      winstonContext
    );
    logger.info(`Sentry git tag: ${nconf.get('application:gittag') || ''}`, winstonContext);
    logger.info(`Sentry git branch: ${nconf.get('application:gitbranch') || ''}`, winstonContext);
    logger.add(
      new Sentry({
        dsn: nconf.get('log:sentry:dsn') || '',
        level: loglevel,
        patchGlobal: true,
        config: {
          release: nconf.get('application:releasenumber') || 'RELEASENUMBER',
          tags: {
            git_tags: nconf.get('application:gittag') || '',
            git_branch: nconf.get('application:gitbranch') || '',
          },
        },
      })
    );
  }
};
