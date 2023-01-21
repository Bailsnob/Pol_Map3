import { readFile, writeFile } from "fs";

export function jsonToObjLiteral(theJson) {
  return new Promise((resolve, reject) => {
    readFile(theJson, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

export function objLiteralToJson(theObjLiteral, fileName) {
  return new Promise((resolve, reject) => {
    writeFile(fileName, JSON.stringify(theObjLiteral), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export default {
  jsonToObjLiteral,
  objLiteralToJson
}