import Koa from 'koa';
import Router from 'koa-router';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
const ROUTE_PREFIX = 'ROUTE_PREFIX';
let api = {};
let apiName = [];
const root = path.join(__dirname, '../api');
export function registerRoutes(app: Koa, dir: string) {
  let router = new Router();
  fs.readdirSync(dir).forEach(function (file) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      registerRoutes(app, filePath);
    } else if (file.endsWith('.ts')) {
      let controller = require(filePath);
      api = Object.assign(api, controller);
      let name = Object.keys(controller);
      apiName.push({
        name: name[0],
        prefix: dir.split(root)[1].replace(/\\/g, '/') + (file.split('.')[0] === 'index' ? '' : '/' + file.split('.')[0]),
      });
    }
  });
  apiName.forEach((data) => {
    const controller = api[data.name];
    const routes = Reflect.getMetadata(ROUTE_PREFIX, controller.prototype) || [];
    routes.forEach((route) => {
      router[route.method](data.prefix + route.path, route.handler.bind(controller));
    });
  });
  app.use(router.routes());
}
