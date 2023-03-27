import "reflect-metadata";

const ROUTE_PREFIX = "ROUTE_PREFIX";
export const HTTP_METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};
export interface RouteMeta {
  path: string;
  method: string;
  handler: Function;
}

export function Route(path: string, method: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes: RouteMeta[] = Reflect.getMetadata(ROUTE_PREFIX, target) || [];
    routes.push({ path, method, handler: descriptor.value });
    Reflect.defineMetadata(ROUTE_PREFIX, routes, target);
  };
}
