import 'reflect-metadata';
import  multer from 'koa-multer';

const ROUTE_PREFIX = 'ROUTE_PREFIX';
export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};
export interface RouteMeta {
  path: string;
  method: string;
  handler: Function;
}

export function Route(path: string, method: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const routes: RouteMeta[] = Reflect.getMetadata(ROUTE_PREFIX, target) || [];
    routes.push({ path, method, handler: descriptor.value });
    Reflect.defineMetadata(ROUTE_PREFIX, routes, target);
  };
}
export function Upload(field: string, destination: string) {
  const upload = multer({ dest: destination });
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const ctx = args[0];
      return upload.single(field)(ctx, () => originalMethod.apply(this, args));
    };
  };
}
