import { format } from 'logform';
import { MESSAGE } from 'triple-beam';
import { inspect } from 'util';

export default format((info) => {
  const { level, message, timestamp, ...rest } = info;
  let stringifiedRest = '';
  for (let key in rest) {
    stringifiedRest += ` ${key}=${inspect(rest[key], { compact: true })}`;
  }
  info[MESSAGE as unknown as string] = `level=${level} ts=${timestamp} msg=${inspect(
    message
  )}${stringifiedRest}`;
  return info;
});
