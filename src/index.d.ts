import { Logger } from 'winston';

export interface CallLoggerOptions {
  logger?: Logger;
  name?: string;
  level?: 'info' | 'debug' | 'silly';
  profiling?: boolean;
  uuid?: boolean;
  extra?: any;
}

export interface ObjectLoggerOptions extends CallLoggerOptions {
  depth?: number;
}

export declare const logger: Logger;
export declare function logCall(fct: any, options?: CallLoggerOptions): any;
export declare function logObject(obj: object, options?: ObjectLoggerOptions): any;
