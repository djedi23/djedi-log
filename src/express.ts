import express, { Request, Response } from 'express';
import { logCall, logger } from './index';

const app = express();

app.get(
  '/',
  logCall(
    (_req: Request, res: Response) => {
      res.send('OK');
    },
    { name: 'express', profiling: true, uuid: true }
  )
);

app.listen(3000, () => {
  logger.info('httpd started.');
});
