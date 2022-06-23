import { inspect } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { Logger, Profiler } from 'winston';
import { logger as logger0 } from './index';

interface CallLoggerOptions {
  logger?: Logger;
  name?: string;
  level?: 'info' | 'debug' | 'silly';
  profiling?: boolean;
  uuid?: boolean;
  extra?: any;
}

interface ObjectLoggerOptions extends CallLoggerOptions {
  depth?: number;
}

const formatData = (arg: any): string => {
  switch (typeof arg) {
    case 'function':
      return arg.toString();
    case 'undefined':
      return 'undefined';
    default:
      return inspect(arg, { compact: true, colors: true, breakLength: Infinity, depth: Infinity });
  }
};

export const logCall = (fct: any, options?: CallLoggerOptions) =>
  new Proxy(fct, {
    apply: (target, thisArg, argumentsList) => {
      let {
        logger = logger0,
        name,
        level = 'silly',
        profiling = false,
        uuid = false,
        extra = {},
      }: CallLoggerOptions = options || {
        logger: logger0,
      };
      const fname = name || target.name || 'function';

      const args = Array.from(argumentsList).map((arg) => formatData(arg));

      if (uuid) extra.callId = uuidv4();
      logger[level](`Calling ${fname}(${args.join(', ')})`, extra);
      let profiler: Profiler | undefined;
      if (profiling) profiler = logger.startTimer();
      try {
        const retraw: any = target.apply(thisArg, argumentsList);
        const ret = formatData(retraw);
        if (profiling && profiler)
          profiler.done({ ...extra, message: `Returning ${fname}: ${ret}`, level });
        else logger[level](`Returning ${fname}: ${ret}`, extra);
        if (retraw instanceof Promise) {
          return retraw
            .then((value) => {
              if (profiling && profiler)
                profiler.done({
                  ...extra,
                  message: `Promise ${fname} resolve: ${formatData(value)}`,
                  level,
                });
              else logger[level](`Promise ${fname} resolve: ${formatData(value)}`, extra);
              return value;
            })
            .catch((err) => {
              if (profiling && profiler)
                profiler.done({
                  ...extra,
                  message: `Exception ${fname}: ${err}`,
                  level: 'error',
                  stack: err.stack,
                });
              else logger.error({ ...extra, message: err, functionName: fname });
              return err;
            });
        } else return retraw;
      } catch (err) {
        if (profiling && profiler)
          profiler.done({
            ...extra,
            message: `Exception ${fname}: ${err}`,
            level: 'error',
            stack: (err as any).stack,
          });
        else logger.error({ ...extra, message: err, functionName: fname });
        throw err;
      }
    },
  });

export const logObject = (obj: object, options?: ObjectLoggerOptions) => {
  const { depth = 1, name = '' } = options || { depth: 1 };
  const loggerobj: { [key: string]: any } = {};
  for (let [key, value] of Object.entries(obj)) {
    //	console.log(`${key}: ${value}`,depth);
    switch (typeof value) {
      case 'function':
        loggerobj[key] = logCall(value, { ...options, name: `${name}${name ? '.' : ''}${key}` });
        break;
      case 'object':
        if (depth > 1)
          loggerobj[key] = logObject(value, {
            ...options,
            name: `${name}${name ? '.' : ''}${key}`,
            depth: depth - 1,
          });
        else loggerobj[key] = value;
        break;
      default:
        loggerobj[key] = value;
    }
  }

  return loggerobj;
};
