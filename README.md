# egg-demo


## 使用egg创建多应用模式

`deep` 文件夹下创建 `admin`, `api`, `www` 的 egg 项目并在各种的 `index.js` 里初始化 `baseDir` 路径。

/deep/admin/index.js

``` js
const path = require('path');
// 获取当前子 Application 路径
const baseDir = path.resolve(__dirname);
const getOptions = clusterPort => {
  return {
    baseDir,
    clusterPort,
  };
};

module.exports = getOptions;
```

三个都是相同构架，只有 `home.js` 里的测试页面不同。

``` shell
├── admin
│   ├── app
│   │   ├── controller
│   │   │   └── home.js
│   │   └── router.js
│   ├── config
│   │   ├── config.default.js
│   │   └── plugin.js
│   ├── index.js
│   ├── package.json
├── api
├── www
└── index.js
```

/app.js 用于初始化时把 `clusterPort` 传递到子 `Application` 并创建实例。
``` js
const Application = require('egg').Application;
const compose = require('koa-compose');
// 导入各个 Application 的 options
const appOptions = require('./deep');

// 手动初始化 Application 的中间件并处理请求。
function buildDispatch(app) {
  const next = compose(app.middleware);
  return ctx => {
    return app.handleRequest(ctx, next);
  };
}

// 入口初始
module.exports = app => {
  // 通过各个 options 生成对应的 Application 并把每个处理请求的方法挂载到 `deepApp`
  app.deepApp = {};
  for (const name in appOptions) {
    const deepApp = new Application(appOptions[name](app.options.clusterPort));
    app.deepApp[name] = buildDispatch(deepApp);
  }
};
```

最后通过 root Application 设置一个 `middleware` 通过 `hostname`, 分发到不同的子 Application。

/app/middleware/dispatch.js
``` js
module.exports = () => {
  return async function dispatch(ctx) {
    const allApp = ctx.app.deepApp;
    const defaultInnerApp = allApp['www.test.dev'];
    const innerApp = allApp[ctx.hostname] || defaultInnerApp;
    return innerApp(ctx);
  };
};
```

## 其它方案

使用 [egg-router-plus](https://github.com/eggjs/egg-router-plus) 的子路由模式加子路由添加独有的中间件来做到。

但是会丢失 `egg` 的自动化加载各种组件的功能，并且只能够通过 `path` 进行分发，需要修改大量的url。


## 快速入门

如需进一步了解，参见 [egg 文档][egg]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
