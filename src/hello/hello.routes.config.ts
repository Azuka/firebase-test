import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';

export class HelloRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'HelloRoutes');
  }

  configureRoutes(): express.Application {
    this.app
      .route(`/hello/:name`)
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`Hello ${req.params.name}`);
      });

    return this.app;
  }
}
