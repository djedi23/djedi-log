import nconf from '@djedi/configuration';
import { format } from 'logform';
import os from 'os';

let nonce = 0;

export default format((info) => {
  info.nonce = new Date().getTime() * 1000 + nonce;
  nonce++;
  info.release = nconf.get('application:releasenumber') || 'RELEASENUMBER';
  info.hostname = os.hostname();
  info.os = {
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
  };
  if (nconf.get('application:name')) info.app_name = nconf.get('application:name') || '';
  if (nconf.get('application:component'))
    info.app_component = nconf.get('application:component') || '';
  if (nconf.get('application:gittag')) info.git_tags = nconf.get('application:gittag') || '';
  if (nconf.get('application:gitbranch'))
    info.git_branch = nconf.get('application:gitbranch') || '';
  return info;
});
