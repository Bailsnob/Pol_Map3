import * as config from "./config.mjs";
doStuff();

function doStuff() {
  const { x: myVar, doSomething: run } = config;
  // console.log(myVar);
  run();
}
