'use strict';
const Application = require('egg').Application;
const appOptions = require('./deep');
const compose = require('koa-compose');


function buildDispatch(app) {
  const next = compose(app.middleware);
  return ctx => {
    return app.handleRequest(ctx, next);
  };
}


module.exports = app => {
  app.deepApp = {};
  for (const name in appOptions) {
    const deepApp = new Application(appOptions[name](app.options.clusterPort));
    app.deepApp[name] = buildDispatch(deepApp);
  }
};
