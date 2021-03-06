// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendUrl: "http://localhost:3000/api",
  websocketurl: "ws://localhost:3001",
  backend: "http://localhost:8080/api/v1/tasks",
  backend_splitting: "http://localhost:8080/api/v1/splitting/entity",
  backend_splitting_func: "http://localhost:8080/api/v1/splitting/functionality",
  backend_final_modules: "http://localhost:8080/api/v1/splitting/finalModules",
  backend_arch: "http://localhost:8080/api/v1/mean/architecture"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
