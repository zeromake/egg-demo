'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'admin, home';
  }
}

module.exports = HomeController;
