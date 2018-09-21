'use strict';


module.exports = () => {
  return async function dispatch(ctx) {
    const allApp = ctx.app.deepApp;
    const defaultInnerApp = allApp['www.test.dev'];
    const innerApp = allApp[ctx.hostname] || defaultInnerApp;
    return innerApp(ctx);
  };
};
