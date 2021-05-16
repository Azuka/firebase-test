// eslint-disable-next-line
import bodyParser from "body-parser";

// require('./tracer')('firebase-test');

import * as traceAgent from '@google-cloud/trace-agent';

const production = process.env.NODE_ENV === 'production';
if (production) {
  traceAgent.start();
}

import express, { Response, Request } from 'express';
import * as http from 'http';
import redoc from 'redoc-express';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import debug from 'debug';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { ErrorReporting } from '@google-cloud/error-reporting';
import { HelloRoutes } from './hello/hello.routes.config';
import { RegisterRoutes } from './build/routes';
import swaggerUi from 'swagger-ui-express';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// here we are adding middleware to parse all incoming requests as JSON
app.use(bodyParser.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (production) {
  loggerOptions.transports.push(new LoggingWinston());
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

app.use(express.json());

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

/**************************************
Routes
***************************************/
RegisterRoutes(app);
routes.push(new HelloRoutes(app));
// define title and specUrl location
// serve redoc
app.get(
  '/redoc',
  redoc({
    title: 'Firebase Test Docs',
    specUrl: '/docs/swagger.json',
  })
);
app.get('/docs/swagger.json', async (_req: Request, res: Response) => {
    return res.send(await import('./build/swagger.json'));
});
app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./build/swagger.json')));
});

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

// Note that express error handling middleware should be attached after all
// the other routes and use() calls. See the Express.js docs.
if (production) {
  const errors = new ErrorReporting();
  app.use(errors.express);
}
// No routes below this

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});
