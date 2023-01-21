import {
  csvToArray,
  stripQuotesInArray,
  convertNumbersInArray,
  arrayToCsv
} from "./csv.mjs";

import {jsonToObjLiteral, objLiteralToJson} from "./json.mjs";

// csvToArray("test.csv")
//   .then((array) => {
//     stripQuotesInArray(array);
//     convertNumbersInArray(array);
//     return array;
//   })
//   .then((array) => arrayToCsv(array, "../utilitiesTest/output.csv"))
//   .then(() => console.log("csv finished"))
//   .catch((reason) => {
//     console.error(reason);
//   });

// jsonToObjLiteral("test.json")
//   .then((obj) => objLiteralToJson(obj, "output.json"))
//   .then(() => console.log("json finished"))
//   .catch((reason) => {
//     console.log(reason);
//   });

csvToArray("test.csv").then((array) => {
  // stripQuotesInArray(array);
  convertNumbersInArray(array);
  console.log(array);
})