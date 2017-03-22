import * as Hapi from "hapi";
const HTTP_OK = 200;

export interface IRegister {
  (server:any, options:any, next:any): void;
  attributes?: any;
}

export default
class TypeScriptPlugin {
  constructor() {
    this.register.attributes = {
      name: "TypeScriptPlugin",
      version: "0.0.1"
    };
  }

  register:IRegister =  (server: Hapi.Server, options, next) => {
    server.route({
      method: "GET",
      path: "/hello-typescript",
      handler: (request:any, reply:any) => {
        reply("HELLO from TypeScript").code(HTTP_OK);
      }
    });
    next();
  };
}
